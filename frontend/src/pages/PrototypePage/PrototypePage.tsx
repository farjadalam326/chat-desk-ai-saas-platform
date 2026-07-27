import React, { useState } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { useTheme } from "../../context/ThemeContext";
import {
  Bot,
  Send,
  RefreshCw
} from "lucide-react";

export const PrototypePage: React.FC = () => {
  const { darkMode } = useTheme();

  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! Welcome to ChatDesk AI Support Platform. How can I assist you with your knowledge base or API integration today?", time: "10:00 AM", sources: [] as string[] },
    { sender: "user", text: "What is the vector similarity threshold for auto-resolving tickets?", time: "10:01 AM", sources: [] as string[] },
    { sender: "bot", text: "By default, ChatDesk AI requires a cosine similarity score of >= 0.85 against your indexed knowledge base to issue an autonomous resolution response. If the score falls below 0.80, it escalates to live agents.", time: "10:01 AM", sources: ["Pinecone RAG Spec #4", "Docs/Guardrails.pdf (p.12)"] }
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), sources: [] as string[] };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botReply = {
        sender: "bot",
        text: `Simulated RAG Answer for "${input}": Retrieved 3 context chunks with 98.4% confidence score. All system safety guardrails verified!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: ["Verified Knowledge Vector #881"]
      };
      setMessages(prev => [...prev, botReply]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">Interactive Prototype Playground</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">
                Full-Stack Simulation
              </span>
            </div>
            <p className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Test live customer AI responses, threshold scoring, RAG citation sources, and human agent takeover.
            </p>
          </div>

          <button
            onClick={() => setMessages([messages[0]])}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
              darkMode ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-white" : "bg-white border-slate-200 text-slate-700 hover:text-slate-900 shadow-sm"
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-500" /> Reset Prototype State
          </button>
        </div>

        {/* Prototype Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Interactive Chat Window */}
          <div className={`lg:col-span-8 rounded-2xl border flex flex-col h-[550px] overflow-hidden ${
            darkMode ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          }`}>
            
            {/* Header */}
            <div className={`p-4 border-b flex items-center justify-between ${
              darkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-400 flex items-center justify-center text-white font-bold shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-xs font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>ChatDesk Support Bot (Prototype v3.5)</h3>
                  <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    RAG Vector Engine Active
                  </span>
                </div>
              </div>

              <span className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-500 font-mono font-bold border border-indigo-500/20">
                GPT-4o + Pinecone
              </span>
            </div>

            {/* Message Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl p-3.5 space-y-2 ${
                      m.sender === "user"
                        ? "bg-indigo-600 text-white rounded-tr-none"
                        : darkMode
                        ? "bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none"
                        : "bg-slate-100 border border-slate-200 text-slate-800 rounded-tl-none"
                    }`}
                  >
                    <p className="leading-relaxed">{m.text}</p>
                    {m.sources.length > 0 && (
                      <div className={`pt-2 border-t text-[10px] space-y-1 ${darkMode ? "border-slate-800 text-indigo-300" : "border-slate-200 text-indigo-700"}`}>
                        <span className="font-bold text-emerald-500">Verified RAG Sources:</span>
                        <div className="flex flex-wrap gap-1">
                          {m.sources.map((s, i) => (
                            <span key={i} className={`px-2 py-0.5 rounded border ${
                              darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-300"
                            }`}>
                              📄 {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1">{m.time}</span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-indigo-500 font-medium italic">
                  <Bot className="w-4 h-4 animate-spin" />
                  Generating RAG vector response...
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className={`p-3 border-t flex items-center gap-2 ${
              darkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
            }`}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask prototype bot a question..."
                className={`flex-1 border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                  darkMode ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-white border-slate-300 text-slate-900"
                }`}
              />
              <button type="submit" className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold">
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>

          {/* Right Live Telemetry Sidebar */}
          <div className={`lg:col-span-4 rounded-2xl border p-6 space-y-6 ${
            darkMode ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          }`}>
            <h3 className={`text-base font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Live RAG Telemetry</h3>

            <div className="space-y-4 text-xs">
              <div className={`p-3.5 rounded-xl border space-y-1 ${
                darkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
              }`}>
                <span className={`block ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Current Confidence Score</span>
                <span className="text-lg font-extrabold text-emerald-500 font-mono">98.4% (PASS)</span>
              </div>

              <div className={`p-3.5 rounded-xl border space-y-1 ${
                darkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
              }`}>
                <span className={`block ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Retrieved Vector Chunks</span>
                <span className="text-sm font-bold text-indigo-500 font-mono">3 Chunks Matched</span>
              </div>

              <div className={`p-3.5 rounded-xl border space-y-1 ${
                darkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
              }`}>
                <span className={`block ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Escalation Threshold</span>
                <span className={`text-sm font-bold font-mono ${darkMode ? "text-slate-200" : "text-slate-800"}`}>&lt; 80.0% Similarity</span>
              </div>
            </div>

            <div className={`pt-4 border-t space-y-2 text-xs ${darkMode ? "border-slate-800" : "border-slate-200"}`}>
              <span className={`font-bold block ${darkMode ? "text-white" : "text-slate-900"}`}>Preset Test Queries</span>
              <button
                onClick={() => setInput("How do I upgrade my billing tier to Enterprise?")}
                className={`w-full text-left p-2.5 rounded-xl border transition-colors ${
                  darkMode ? "bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500" : "bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900 hover:border-indigo-500"
                }`}
              >
                💡 "How do I upgrade billing to Enterprise?"
              </button>
              <button
                onClick={() => setInput("Can I customize the bot widget accent color?")}
                className={`w-full text-left p-2.5 rounded-xl border transition-colors ${
                  darkMode ? "bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500" : "bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900 hover:border-indigo-500"
                }`}
              >
                💡 "Can I customize the widget accent color?"
              </button>
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default PrototypePage;
