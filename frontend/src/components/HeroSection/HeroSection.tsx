import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { Bot, Sparkles, ArrowRight, PlayCircle, CheckCircle2 } from "lucide-react";

export const HeroSection: React.FC = () => {
  const { darkMode } = useTheme();

  return (
    <section className={`relative overflow-hidden transition-colors duration-200 pt-12 pb-20 lg:pt-20 lg:pb-32 ${
      darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
    }`}>
      {/* Background Glow effects */}
      <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none ${
        darkMode ? "bg-indigo-600/15" : "bg-indigo-400/20"
      }`}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Banner */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Pill Tag */}
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold shadow-inner ${
              darkMode
                ? "bg-indigo-950/80 border-indigo-500/30 text-indigo-300"
                : "bg-indigo-50 border-indigo-200 text-indigo-700"
            }`}>
              <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
              <span>Next-Gen Autonomous AI Support Agent</span>
              <span className="bg-indigo-500/20 text-indigo-600 dark:text-indigo-200 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold">v3.5 RAG</span>
            </div>

            {/* Main Headline */}
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] ${
              darkMode ? "text-white" : "text-slate-900"
            }`}>
              AI Support Desktop That Resolves <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500">85% of Tickets</span> Instantly
            </h1>

            {/* Subtitle */}
            <p className={`text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0 ${
              darkMode ? "text-slate-300" : "text-slate-600"
            }`}>
              Train custom AI support bots on your PDFs, website URLs, & knowledge base in 60 seconds. Deliver instantaneous, human-grade customer service with seamless live agent escalation.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/onboarding"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/prototype"
                className={`w-full sm:w-auto px-7 py-4 rounded-xl border font-semibold text-base transition-all flex items-center justify-center gap-2.5 ${
                  darkMode
                    ? "bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700"
                    : "bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-sm"
                }`}
              >
                <PlayCircle className="w-5 h-5 text-indigo-500" />
                <span>Live Interactive Demo</span>
              </Link>
            </div>

            {/* Key Value Bullets */}
            <div className={`pt-6 grid grid-cols-3 gap-4 border-t max-w-lg mx-auto lg:mx-0 text-left ${
              darkMode ? "border-slate-800/80 text-slate-300" : "border-slate-200 text-slate-700"
            }`}>
              <div className="flex items-center gap-2 text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>5-Min Setup</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>SOC-2 & GDPR Ready</span>
              </div>
            </div>

          </div>

          {/* Right Live Interactive Demo Widget Mockup */}
          <div className="lg:col-span-5 relative">
            <div className={`relative rounded-2xl border p-4 sm:p-6 shadow-2xl backdrop-blur-xl transition-colors ${
              darkMode
                ? "bg-slate-900/90 border-slate-700/70 shadow-indigo-950/80"
                : "bg-white border-slate-200 shadow-slate-300/50"
            }`}>
              
              {/* Card Header */}
              <div className={`flex items-center justify-between border-b pb-4 mb-4 ${
                darkMode ? "border-slate-800" : "border-slate-200"
              }`}>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                      <Bot className="w-6 h-6" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-slate-900"></span>
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>ChatDesk AI Agent</h4>
                    <span className="text-xs text-emerald-500 flex items-center gap-1 font-medium">
                      Active • Training Sync 100%
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-500 text-xs font-semibold border border-indigo-500/20">
                  Live Preview
                </span>
              </div>

              {/* Chat Thread */}
              <div className="space-y-3.5 mb-4 text-xs">
                {/* Customer bubble */}
                <div className="flex justify-end">
                  <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-none px-4 py-2.5 max-w-[85%] shadow-md">
                    Hi! How do I integrate ChatDesk AI into my React & Shopify app?
                  </div>
                </div>

                {/* AI response bubble */}
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div className={`border rounded-2xl rounded-tl-none px-4 py-3 max-w-[90%] leading-relaxed space-y-2 ${
                    darkMode
                      ? "bg-slate-800/90 text-slate-200 border-slate-700/80"
                      : "bg-slate-100 text-slate-800 border-slate-200"
                  }`}>
                    <p>
                      You can embed ChatDesk AI in 1 line of JavaScript or install our React package:
                    </p>
                    <div className={`p-2.5 rounded-lg border text-[11px] font-mono overflow-x-auto ${
                      darkMode ? "bg-slate-950 border-slate-800 text-emerald-400" : "bg-white border-slate-300 text-emerald-600"
                    }`}>
                      &lt;script src="https://cdn.chatdesk.ai/v3/widget.js" data-key="cd_live_992"&gt;&lt;/script&gt;
                    </div>
                    <p className={`text-[11px] ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      ⚡ Source verified from Docs #142 (Confidence: 99.4%)
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Input Bar */}
              <div className="relative flex items-center">
                <input
                  type="text"
                  readOnly
                  value="Ask anything about your knowledge base..."
                  className={`w-full border rounded-xl px-4 py-3 text-xs pr-10 focus:outline-none ${
                    darkMode
                      ? "bg-slate-950 border-slate-700 text-slate-400"
                      : "bg-slate-50 border-slate-300 text-slate-600"
                  }`}
                />
                <button className="absolute right-2 p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
