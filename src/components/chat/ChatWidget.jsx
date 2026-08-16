import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import { useSelector } from 'react-redux'
import { selectIsLoggedIn, selectUser } from '../../store/slices/authSlice'
import useWebSocket from '../../hooks/useWebSocket'
import { chatApi } from '../../api/chatApi'
import MessageBubble from './MessageBubble'
import Spinner from '../ui/Spinner'

/*
 * ═══════════════════════════════════════════════════════════════
 * WHY THIS FILE EXISTS
 * ═══════════════════════════════════════════════════════════════
 * Floating chat button + panel, present on every customer-facing page
 * (mounted in PublicLayout below). Combines THREE data sources:
 *
 *   1. GET /api/chat/history — past messages (backend Part 20's
 *      CustomerChatHistoryController), loaded ONCE when the panel
 *      first opens
 *   2. WebSocket subscription to /user/queue/messages — NEW messages
 *      pushed in real time while the connection is open (backend's
 *      convertAndSendToUser in ChatService.sendAdminReply)
 *   3. WebSocket publish to /app/chat.send — sending a new message
 *      (backend's ChatController @MessageMapping)
 *
 * ═══════════════════════════════════════════════════════════════
 * WHY CONNECT ONLY WHEN THE PANEL OPENS (not on every page load)?
 * ═══════════════════════════════════════════════════════════════
 * Keeping a WebSocket connection open for every logged-in customer on
 * every page, all the time, is unnecessary server load for a support
 * chat feature most customers never use in a given session. We connect
 * lazily — only when they actually click the chat button — and
 * disconnect when they close the panel. This matches real-world
 * e-commerce chat widget behavior (Intercom, Zendesk work this way too).
 * ═══════════════════════════════════════════════════════════════
 */

export default function ChatWidget() {
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const user = useSelector(selectUser)
  const { isConnected, connect, disconnect, subscribe, publish } = useWebSocket()

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [loadingHistory, setLoadingHistory] = useState(false)
  const messagesEndRef = useRef(null)



  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])


  const openChat = async () => {
    setIsOpen(true)
    setLoadingHistory(true)

    // Load past message history first
    try {
      const response = await chatApi.getChatHistory()
      setMessages(response.data || [])
    } catch {
      // Non-fatal — chat can still work for new messages
    } finally {
      setLoadingHistory(false)
    }

    // Connect WebSocket and subscribe to receive admin replies
    connect()
  }


  // Once connected, subscribe to the private message queue
  useEffect(() => {
    if (isConnected && isOpen) {
      subscribe('/user/queue/messages', (newMessage) => {
        setMessages((prev) => [...prev, newMessage])
      })
    }
  }, [isConnected, isOpen, subscribe])


  const closeChat = () => {
    setIsOpen(false)
    disconnect()
  }

  
  const handleSend = (e) => {
    e.preventDefault()
    const trimmed = inputValue.trim()
    if (!trimmed) return

    const sent = publish('/app/chat.send', { content: trimmed })

    if (sent) {
      // Optimistically add the message locally — backend also echoes
      // it back via /topic/admin-inbox, but that's for ADMIN's view,
      // not ours, so we add it here directly for instant feedback
      setMessages((prev) => [...prev, {
        senderId: user.userId,
        message: trimmed,
        createdAt: new Date().toISOString(),
      }])
      setInputValue('')
    }
  }


    // Don't render the widget at all for logged-out visitors
  if (!isLoggedIn) return null


  return (
    <div className="fixed bottom-6 right-6 z-50">

      {/* ── FLOATING BUTTON ──────────────────────────────────── */}
      {!isOpen && (
        <button
          onClick={openChat}
          className="w-14 h-14 rounded-full bg-[#0078D4] text-white shadow-lg flex items-center justify-center hover:bg-[#106EBE] hover:scale-105 transition-all"
        >
          <MessageCircle size={24} />
        </button>
      )}


      {/* ── CHAT PANEL ───────────────────────────────────────── */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-modal border border-gray-100 flex flex-col animate-slide-up">

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-[#0078D4] rounded-t-2xl">
            <div>
              <p className="text-white font-display font-semibold text-sm">
                Support Chat
              </p>
              <p className="text-blue-200 text-[11px] flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-400' : 'bg-gray-300'}`} />
                {isConnected ? 'Connected' : 'Connecting...'}
              </p>
            </div>
            <button
              onClick={closeChat}
              className="text-white/80 hover:text-white p-1"
            >
              <X size={20} />
            </button>
          </div>


          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {loadingHistory ? (
              <div className="flex items-center justify-center h-full">
                <Spinner size="md" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <MessageCircle size={32} className="text-gray-200 mb-3" />
                <p className="text-sm text-gray-400">
                  Send us a message — we're happy to help!
                </p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <MessageBubble
                  key={i}
                  message={msg}
                  isOwnMessage={msg.senderId === user.userId}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          

          {/* Input */}
          <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t border-gray-100">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              disabled={!isConnected}
              className="flex-1 px-3 py-2 text-sm bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0078D4] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!isConnected || !inputValue.trim()}
              className="w-9 h-9 rounded-lg bg-[#0078D4] text-white flex items-center justify-center disabled:opacity-40 hover:bg-[#106EBE] transition-colors flex-shrink-0"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
