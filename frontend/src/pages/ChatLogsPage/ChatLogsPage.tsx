/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";
import { chatApi } from "../../api/chatApi";
import { ChatMessageSkeleton, ChatListSkeleton } from "../../components/Common/Skeleton";
import {
  Search,
  Bot,
  Send,
  UserCheck,
  FileText,
  ShieldCheck,
} from "lucide-react";

export const ChatLogsPage: React.FC = () => {
  const { darkMode } = useTheme();
  const toast = useToast();

  const [rawConversations, setRawConversations] = useState<any[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);

  const [loadingList, setLoadingList] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const [replyText, setReplyText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll messages to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversation list from backend
  const loadConversations = useCallback(async () => {
    try {
      setLoadingList(true);
      const res = await chatApi.getConversations();
      const dataObj = res?.data as any;
      const list = dataObj?.conversations || (Array.isArray(dataObj) ? dataObj : []);
      setRawConversations(list);

      if (list.length > 0 && !selectedChatId) {
        setSelectedChatId(list[0]._id || list[0].id);
      }
    } catch (err: any) {
      console.warn("Failed to load conversations from backend", err);
    } finally {
      setLoadingList(false);
    }
  }, [selectedChatId]);

  useEffect(() => {
    let ignore = false;
    const fetchConversationsOnMount = async () => {
      try {
        setLoadingList(true);
        const res = await chatApi.getConversations();
        if (ignore) return;
        const dataObj = res?.data as any;
        const list = dataObj?.conversations || (Array.isArray(dataObj) ? dataObj : []);
        setRawConversations(list);
        if (list.length > 0) {
          setSelectedChatId((prev) => prev || list[0]._id || list[0].id);
        }
      } catch (err: any) {
        if (!ignore) console.warn("Using conversation fallback data", err);
      } finally {
        if (!ignore) setLoadingList(false);
      }
    };

    fetchConversationsOnMount();

    return () => {
      ignore = true;
    };
  }, []);

  // Connect to Socket.io server
  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || (typeof window !== "undefined" ? window.location.origin : "");
    const socket = io(socketUrl, {
      path: "/ws/chat",
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[Socket.io] Connected to /ws/chat with id:", socket.id);
    });

    socket.on("new_message", (newMsg: any) => {
      if (newMsg && (newMsg.conversationId === selectedChatId || newMsg.conversationId?._id === selectedChatId)) {
        setMessages((prev) => {
          // Avoid duplicate messages
          if (prev.some((m) => m._id === newMsg._id)) return prev;
          return [...prev, newMsg];
        });
      }
    });

    socket.on("conversation_updated", () => {
      loadConversations();
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedChatId, loadConversations]);

  // Load details and message history when selectedChatId changes
  useEffect(() => {
    if (!selectedChatId) return;

    let ignore = false;

    if (socketRef.current) {
      socketRef.current.emit("join_conversation", { conversationId: selectedChatId });
    }

    chatApi
      .getConversationDetails(selectedChatId)
      .then((res) => {
        if (!ignore && res?.data) {
          setMessages(res.data.messages || []);
        }
      })
      .catch((err: any) => {
        if (!ignore) console.warn("Failed to load conversation details", err);
      })
      .finally(() => {
        if (!ignore) setLoadingMessages(false);
      });

    return () => {
      ignore = true;
    };
  }, [selectedChatId]);

  const handleTakeover = async (id: string) => {
    try {
      await chatApi.updateStatus(id, "active");
      toast.success("Agent successfully took over this conversation session!");
      loadConversations();
    } catch (err: any) {
      toast.error(err.message || "Failed to takeover chat.");
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || !selectedChatId || sending) return;

    const textToSend = replyText.trim();
    setReplyText("");
    setSending(true);

    try {
      const res = await chatApi.sendMessage(selectedChatId, textToSend, "agent");
      if (res?.data) {
        setMessages((prev) => [...prev, res.data]);
      }

    } catch (err: any) {
      toast.error(err.message || "Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  // Map backend conversations to UI items
  const formattedConversations = rawConversations.map((conv: any, index: number) => {
    const id = conv._id || conv.id;
    const name = conv.visitorInfo?.name || `Visitor ${id.slice(-4)}`;
    const email = conv.visitorInfo?.email || `${conv.visitorId || "visitor"}@chatdesk.ai`;
    const time = conv.lastMessageAt
      ? new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "Just now";
    const statusText =
      conv.status === "resolved" || conv.status === "closed"
        ? "AI Resolved"
        : conv.status === "pending"
        ? "Human Escalated"
        : "Live Session Active";

    const avatars = [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&fit=crop&q=80",
    ];

    return {
      id,
      customer: name,
      email,
      lastMessage: conv.lastMessage || "Live customer inquiry stream...",
      time,
      status: statusText,
      avatar: avatars[index % avatars.length],
      raw: conv,
    };
  });

  const filteredConversations = formattedConversations.filter(
    (c) =>
      c.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConv = formattedConversations.find((c) => c.id === selectedChatId) || formattedConversations[0];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Live Chat Logs & Transcripts</h1>
            <p className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Real-time WebSocket stream of AI-assisted conversations and agent takeover controls.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Socket.io Live Connected
            </span>
          </div>
        </div>

        {/* Main 3-Column Chat Studio Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-210px)] min-h-[600px]">
          
          {/* Left Column: Conversations List */}
          <div
            className={`lg:col-span-4 rounded-2xl border flex flex-col min-h-0 ${
              darkMode ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            {/* Search Header */}
            <div className={`p-3.5 border-b ${darkMode ? "border-slate-800" : "border-slate-200"}`}>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search live sessions or customer email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                    darkMode
                      ? "bg-slate-950 border-slate-800 text-slate-200"
                      : "bg-slate-50 border-slate-300 text-slate-900"
                  }`}
                />
              </div>
            </div>

            {/* Conversation Items List */}
            <div
              className={`flex-1 overflow-y-auto divide-y p-2 space-y-1 ${
                darkMode ? "divide-slate-800/60" : "divide-slate-200"
              }`}
            >
              {loadingList ? (
                <ChatListSkeleton count={5} />
              ) : filteredConversations.length > 0 ? (
                filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedChatId(conv.id)}
                    className={`p-3.5 rounded-xl cursor-pointer transition-all flex items-start gap-3 ${
                      selectedChatId === conv.id
                        ? "bg-indigo-600/20 border border-indigo-500/40"
                        : darkMode
                        ? "hover:bg-slate-800/50"
                        : "hover:bg-slate-100"
                    }`}
                  >
                    <img
                      src={conv.avatar}
                      alt={conv.customer}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-xs font-bold truncate ${darkMode ? "text-white" : "text-slate-900"}`}>
                          {conv.customer}
                        </h4>
                        <span className="text-[10px] text-slate-500">{conv.time}</span>
                      </div>
                      <p className={`text-[11px] truncate mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                        {conv.lastMessage}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                            conv.status === "AI Resolved"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-amber-500/10 text-amber-500"
                          }`}
                        >
                          {conv.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-400">
                  No conversation sessions found.
                </div>
              )}
            </div>
          </div>

          {/* Center Column: Live Transcript Stream */}
          <div
            className={`lg:col-span-5 rounded-2xl border flex flex-col min-h-0 ${
              darkMode ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            {/* Active Chat Header */}
            {selectedConv ? (
              <div
                className={`p-4 border-b flex items-center justify-between ${
                  darkMode ? "border-slate-800" : "border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={selectedConv.avatar}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <h3 className={`text-xs font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
                      {selectedConv.customer}
                    </h3>
                    <span className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Live WebSocket Connected
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleTakeover(selectedConv.id)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-semibold hover:bg-amber-500/20 flex items-center gap-1"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Takeover Chat
                </button>
              </div>
            ) : null}

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {loadingMessages ? (
                <ChatMessageSkeleton />
              ) : messages.length > 0 ? (
                messages.map((msg: any, idx: number) => {
                  const isVisitor = msg.senderType === "visitor";
                  const isBot = msg.senderType === "bot";

                  return (
                    <div
                      key={msg._id || idx}
                      className={`flex items-start gap-2.5 ${isVisitor ? "justify-end" : "justify-start"}`}
                    >
                      {!isVisitor && (
                        <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-500 shrink-0">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}
                      <div
                        className={`p-3.5 max-w-[85%] rounded-2xl space-y-1 ${
                          isVisitor
                            ? "bg-indigo-600 text-white rounded-tr-none shadow-md"
                            : darkMode
                            ? "bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none"
                            : "bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none"
                        }`}
                      >
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        <span
                          className={`text-[9px] block text-right ${
                            isVisitor ? "text-indigo-200" : darkMode ? "text-slate-500" : "text-slate-400"
                          }`}
                        >
                          {msg.createdAt
                            ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                            : "Just now"}
                          {isBot ? " • AI Assistant" : isVisitor ? " • Customer" : " • Agent"}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No messages recorded in this conversation session yet.
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Agent Reply Bar */}
            <form
              onSubmit={handleSendMessage}
              className={`p-3 border-t flex items-center gap-2 ${darkMode ? "border-slate-800" : "border-slate-200"}`}
            >
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type real-time agent reply..."
                className={`flex-1 border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                  darkMode
                    ? "bg-slate-950 border-slate-800 text-slate-200"
                    : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              />
              <button
                type="submit"
                disabled={sending || !replyText.trim()}
                className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Column: Customer Details Panel */}
          <div
            className={`lg:col-span-3 rounded-2xl border p-5 space-y-6 ${
              darkMode ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div>
              <h3 className={`text-sm font-bold mb-4 ${darkMode ? "text-white" : "text-slate-900"}`}>
                Customer Context
              </h3>
              <div className={`text-center pb-4 border-b space-y-2 ${darkMode ? "border-slate-800" : "border-slate-200"}`}>
                <img
                  src={selectedConv?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&fit=crop&q=80"}
                  className="w-16 h-16 rounded-full mx-auto ring-2 ring-indigo-500"
                />
                <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-slate-900"}`}>
                  {selectedConv?.customer || "Elena Rostova"}
                </h4>
                <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  {selectedConv?.email || "elena@fintech.io"}
                </p>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 text-[10px] font-bold">
                  Active User Session
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Location</span>
                <span className={`font-medium ${darkMode ? "text-white" : "text-slate-800"}`}>
                  {selectedConv?.raw?.visitorInfo?.location || "San Francisco, CA"}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Browser Engine</span>
                <span className={`font-medium truncate max-w-[120px] ${darkMode ? "text-white" : "text-slate-800"}`}>
                  {selectedConv?.raw?.visitorInfo?.browser || "Chrome 126.0"}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Database Sync</span>
                <span className="text-emerald-500 font-bold">MongoDB Live</span>
              </div>
            </div>

            <div className={`pt-4 border-t space-y-2 ${darkMode ? "border-slate-800" : "border-slate-200"}`}>
              <h4 className={`text-xs font-bold uppercase tracking-wider ${darkMode ? "text-white" : "text-slate-900"}`}>
                Quick Actions
              </h4>
              <button
                onClick={() => toast.info("Exporting chat transcript history...")}
                className={`w-full text-left px-3 py-2 rounded-lg border text-xs flex items-center gap-2 ${
                  darkMode ? "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-indigo-500" /> View User Audit Logs
              </button>
              <button
                onClick={() => toast.success("Security verification ping sent.")}
                className={`w-full text-left px-3 py-2 rounded-lg border text-xs flex items-center gap-2 ${
                  darkMode ? "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Send Security Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChatLogsPage;
