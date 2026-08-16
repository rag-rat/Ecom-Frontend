import { useEffect, useRef, useState, useCallback } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client/dist/sockjs'

/*
 * ═══════════════════════════════════════════════════════════════
 * WHY THIS FILE EXISTS
 * ═══════════════════════════════════════════════════════════════
 * Manages the entire STOMP/WebSocket connection lifecycle — matches
 * backend Part 20's WebSocketConfig and WebSocketAuthInterceptor
 * exactly. This is a REUSABLE hook used by BOTH the customer
 * ChatWidget (this part) and the admin chat page (Part 18).
 *
 * ═══════════════════════════════════════════════════════════════
 * WHY SockJS INSTEAD OF PLAIN WebSocket?
 * ═══════════════════════════════════════════════════════════════
 * SockJS mirrors backend Part 20's `.withSockJS()` endpoint
 * configuration — it provides automatic fallback to HTTP long-polling
 * if a raw WebSocket connection is blocked by a restrictive network
 * (some corporate firewalls block WS). We connect to `/ws` (SockJS
 * handles the underlying transport negotiation automatically), NOT to
 * `/ws/websocket` directly, which would bypass SockJS's fallback logic.
 *
 * ═══════════════════════════════════════════════════════════════
 * HOW THE JWT GETS TO THE BACKEND'S CONNECT HANDSHAKE
 * ═══════════════════════════════════════════════════════════════
 * connectHeaders: { Authorization: 'Bearer <token>' } — this is
 * EXACTLY what backend Part 20's WebSocketAuthInterceptor reads from
 * the STOMP CONNECT frame's native headers (accessor.getNativeHeader
 * ("Authorization")). This is DIFFERENT from a normal HTTP request's
 * Authorization header (which axiosInstance's interceptor, Part 2,
 * handles) — STOMP has its own header mechanism layered on top of
 * the WebSocket connection.
 *
 * ═══════════════════════════════════════════════════════════════
 * RECONNECTION STRATEGY
 * ═══════════════════════════════════════════════════════════════
 * reconnectDelay: 5000 tells the STOMP client to automatically retry
 * connecting every 5 seconds if the connection drops (network blip,
 * server restart, laptop sleep/wake). Without this, a dropped
 * connection would silently stop the chat working until a full page
 * refresh — reconnectDelay makes it self-healing.
 * ═══════════════════════════════════════════════════════════════
 */

export default function useWebSocket() {
  const clientRef = useRef(null)
  const [isConnected, setIsConnected] = useState(false)
  const subscriptionsRef = useRef({})


  const connect = useCallback(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) return

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9092'

    const client = new Client({
      webSocketFactory: () => new SockJS(`${baseUrl}/ws`),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: () => {
        setIsConnected(true)
      },
      onDisconnect: () => {
        setIsConnected(false)
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers?.message)
        setIsConnected(false)
      },
    })

    client.activate()
    clientRef.current = client
  }, [])


  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.deactivate()
      clientRef.current = null
      setIsConnected(false)
    }
  }, [])


  /*
   * subscribe()
   * ─────────────
   * Wraps STOMP's subscribe() with automatic cleanup tracking.
   * Returns nothing — caller doesn't need to manually unsubscribe,
   * that's handled in the useEffect cleanup of the component using
   * this hook (see ChatWidget below).
   *
   * @param destination  e.g. '/user/queue/messages' or '/topic/admin-inbox'
   * @param callback     called with the parsed JSON payload of each message
   */
  const subscribe = useCallback((destination, callback) => {
    if (!clientRef.current || !isConnected) return

    const subscription = clientRef.current.subscribe(destination, (message) => {
      try {
        const payload = JSON.parse(message.body)
        callback(payload)
      } catch (e) {
        console.error('Failed to parse WebSocket message:', e)
      }
    })

    subscriptionsRef.current[destination] = subscription
  }, [isConnected])

  
  const unsubscribe = useCallback((destination) => {
    subscriptionsRef.current[destination]?.unsubscribe()
    delete subscriptionsRef.current[destination]
  }, [])


  /*
   * publish()
   * ───────────
   * Sends a message TO the server, matching backend Part 20's
   * @MessageMapping("/chat.send") — the destination MUST be prefixed
   * with /app (backend's setApplicationDestinationPrefixes) for the
   * server to route it to the correct @MessageMapping handler.
   */
  const publish = useCallback((destination, body) => {
    if (!clientRef.current || !isConnected) {
      console.warn('Cannot send message — WebSocket not connected')
      return false
    }
    clientRef.current.publish({
      destination,
      body: JSON.stringify(body),
    })
    return true
  }, [isConnected])

  // Clean up connection when the hook's owning component unmounts
  useEffect(() => {
    return () => disconnect()
  }, [disconnect])

  return { isConnected, connect, disconnect, subscribe, unsubscribe, publish }
}