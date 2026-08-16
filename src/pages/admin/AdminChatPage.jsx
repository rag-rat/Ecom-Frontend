import { useState, useEffect, useRef } from "react";
import { MessageSquare, Lock, LockOpen, Send } from "lucide-react";
import { chatApi } from "../../api/chatApi";
import useWebSocket from "../../hooks/useWebSocket";
import { timeAgo, formatDateTime } from "../../utils/formatDate";
import MessageBubble from "../../components/chat/MessageBubble";
import Spinner from "../../components/ui/Spinner";
import { clsx } from "clsx";
import toast from "react-hot-toast";

/*
 * ═══════════════════════════════════════════════════════════════
 * WHY THIS FILE EXISTS
 * ═══════════════════════════════════════════════════════════════
 * The admin's support inbox — a two-panel layout (conversation list
 * + active chat), matching how every helpdesk tool (Zendesk, Intercom)
 * is laid out. Reuses useWebSocket (Part 16) and MessageBubble
 * (Part 16) — same underlying real-time infrastructure, different UI.
 *
 * ═══════════════════════════════════════════════════════════════
 * KEY ASYMMETRY WITH THE CUSTOMER'S ChatWidget (Part 16)
 * ═══════════════════════════════════════════════════════════════
 * Customer sends messages via WebSocket publish (/app/chat.send).
 * ADMIN sends replies via a REGULAR REST POST
 * (chatApi.sendAdminReply → backend's AdminChatController), NOT
 * via WebSocket publish — this matches backend Part 20's deliberate
 * design choice explained in that module: the admin dashboard is a
 * fuller web app where a REST POST is simpler than maintaining a
 * persistent STOMP client purely for sending.
 *
 * Admin's WebSocket connection here is used ONLY for RECEIVING new
 * incoming customer messages in real time (subscribed to
 * /topic/admin-inbox), never for sending.
 * ═══════════════════════════════════════════════════════════════
 */

export default function AdminChatPage() {
  const { isConnected, connect, subscribe } = useWebSocket();

  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchConversations = () => {
    setLoadingConversations(true);
    chatApi
      .getAllConversations(0, 50)
      .then((res) => setConversations(res.data?.content || []))
      .catch(() => {})
      .finally(() => setLoadingConversations(false));
  };

  useEffect(() => {
    fetchConversations();
    connect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Subscribe to the shared admin inbox topic for real-time new-message notifications
  useEffect(() => {
    if (isConnected) {
      subscribe("/topic/admin-inbox", async (newMessage) => {
        // If this message belongs to the currently open conversation,
        // append it live to the message panel
        if (
          activeConversation &&
          newMessage.conversationId === activeConversation.id
        ) {
          setMessages((prev) => [...prev, newMessage]);
          try {
            const response = await chatApi.markConversationAsRead(
              newMessage.conversationId,
            );

            // console.log("MARKED AS READ:", response);
          } catch (err) {
            console.error("MARK AS READ FAILED:", err);
          }
        }

        // Refresh the conversation list to show updated preview/unread count
        fetchConversations();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, activeConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const openConversation = async (conversation) => {
    setActiveConversation(conversation);
    setLoadingMessages(true);
    try {
      const response = await chatApi.getConversationMessages(conversation.id);
      setMessages(response.data || []);
      fetchConversations(); // refresh to clear unread badge
    } catch {
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    const trimmed = replyText.trim();
    if (!trimmed || !activeConversation) return;

    setSending(true);
    try {
      const response = await chatApi.sendAdminReply(
        activeConversation.id,
        trimmed,
      );
      setMessages((prev) => [...prev, response.data]);
      setReplyText("");
      fetchConversations();
    } catch (err) {
      toast.error(err.message || "Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  const toggleConversationStatus = async () => {
    if (!activeConversation) return;
    try {
      if (activeConversation.status === "OPEN") {
        await chatApi.closeConversation(activeConversation.id);
        toast.success("Conversation closed");
      } else {
        await chatApi.reopenConversation(activeConversation.id);
        toast.success("Conversation reopened");
      }
      setActiveConversation({
        ...activeConversation,
        status: activeConversation.status === "OPEN" ? "CLOSED" : "OPEN",
      });
      fetchConversations();
    } catch (err) {
      toast.error(err.message || "Failed to update conversation");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-8">
      <h1 className="text-2xl font-display font-bold text-white mb-6">
        Support Chat
      </h1>

      <div
        className="bg-gray-900 rounded-xl border border-gray-800 shadow-lg shadow-black/20 overflow-hidden flex"
        style={{ height: "600px" }}
      >
        {/* ── CONVERSATION LIST ────────────────────────────── */}
        <div className="w-72 border-r border-gray-800 overflow-y-auto flex-shrink-0">
          {loadingConversations ? (
            <div className="py-12 flex justify-center">
              <Spinner />
            </div>
          ) : conversations.length === 0 ? (
            <p className="text-center text-gray-500 text-sm py-12 px-4">
              No conversations yet
            </p>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => openConversation(conv)}
                className={clsx(
                  "w-full text-left px-4 py-3.5 border-b border-gray-800/80 transition-all duration-150",
                  "hover:bg-gray-800/70",
                  activeConversation?.id === conv.id &&
                    "bg-blue-500/[0.08] border-l-2 border-l-[#0078D4]",
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-gray-300">
                      {conv.customerName?.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* Conversation content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-white truncate">
                        {conv.customerName}
                      </p>

                      {conv.lastMessageAt && (
                        <span className="text-[10px] text-gray-600 flex-shrink-0">
                          {timeAgo(conv.lastMessageAt)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-1.5">
                      <p
                        className={clsx(
                          "text-xs truncate",
                          conv.unreadCount > 0
                            ? "text-gray-300 font-medium"
                            : "text-gray-500",
                        )}
                      >
                        {conv.lastMessagePreview || "No messages yet"}
                      </p>

                      {conv.unreadCount > 0 && (
                        <span className="min-w-5 h-5 px-1.5 rounded-full bg-[#0078D4] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>

                    {conv.status === "CLOSED" && (
                      <div className="mt-1.5">
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-gray-800 text-[9px] text-gray-500 border border-gray-700">
                          <Lock size={9} />
                          Closed
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* ── ACTIVE CHAT PANEL ────────────────────────────── */}
        <div className="flex-1 flex flex-col">
          {!activeConversation ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-700">
              <MessageSquare size={40} />
              <p className="text-sm text-gray-500 mt-2">
                Select a conversation to start replying
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800">
                <div>
                  <p className="font-medium text-white text-sm">
                    {activeConversation.customerName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {activeConversation.status}
                  </p>
                </div>
                <button
                  onClick={toggleConversationStatus}
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-gray-200 border border-gray-700 rounded-lg px-3 py-1.5 transition-colors"
                >
                  {activeConversation.status === "OPEN" ? (
                    <>
                      <Lock size={12} /> Close
                    </>
                  ) : (
                    <>
                      <LockOpen size={12} /> Reopen
                    </>
                  )}
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {loadingMessages ? (
                  <div className="flex-1 flex items-center justify-center h-full">
                    <Spinner />
                  </div>
                ) : (
                  messages.map((msg, i) => (
                    <MessageBubble
                      key={i}
                      message={msg}
                      isOwnMessage={msg.senderId === "ADMIN"}
                    />
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply input */}
              <form
                onSubmit={handleSendReply}
                className="flex items-center gap-2 p-4 border-t border-gray-800"
              >
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1 px-3 py-2.5 text-sm bg-gray-800 text-gray-100 placeholder:text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0078D4]"
                />
                <button
                  type="submit"
                  disabled={sending || !replyText.trim()}
                  className="w-10 h-10 rounded-lg bg-[#0078D4] text-white flex items-center justify-center disabled:opacity-40 hover:bg-[#106EBE] transition-colors flex-shrink-0"
                >
                  <Send size={15} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
