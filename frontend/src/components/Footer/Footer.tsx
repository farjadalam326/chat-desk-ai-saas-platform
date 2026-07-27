import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { Bot, ShieldCheck } from "lucide-react";

export const Footer: React.FC = () => {
  const { darkMode } = useTheme();

  return (
    <footer className={`border-t pt-16 pb-12 transition-colors duration-200 ${
      darkMode ? "bg-slate-950 text-slate-400 border-slate-800/80" : "bg-slate-100 text-slate-600 border-slate-200"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand info column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className={`text-xl font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
                ChatDesk<span className="text-indigo-500">.AI</span>
              </span>
            </Link>
            <p className={`text-sm leading-relaxed max-w-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              Empower your support team with autonomous AI customer agents trained directly on your knowledge base. Resolve 85%+ of tickets instantly 24/7.
            </p>
            
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-colors ${
                darkMode ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-white" : "bg-white border-slate-200 text-slate-600 hover:text-slate-900"
              }`}>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-colors ${
                darkMode ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-white" : "bg-white border-slate-200 text-slate-600 hover:text-slate-900"
              }`}>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${darkMode ? "text-white" : "text-slate-900"}`}>Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/#features" className="hover:text-indigo-500 transition-colors">AI Chatbot Agent</Link></li>
              <li><Link to="/widget-customization" className="hover:text-indigo-500 transition-colors">Widget Studio</Link></li>
              <li><Link to="/knowledge-base" className="hover:text-indigo-500 transition-colors">RAG Knowledge Base</Link></li>
              <li><Link to="/analytics" className="hover:text-indigo-500 transition-colors">Analytics & Insights</Link></li>
              <li><Link to="/prototype" className="hover:text-indigo-500 transition-colors">Interactive Demo</Link></li>
            </ul>
          </div>

          {/* Solution Links */}
          <div>
            <h4 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${darkMode ? "text-white" : "text-slate-900"}`}>Solutions</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/dashboard" className="hover:text-indigo-500 transition-colors">Live Agent Handover</Link></li>
              <li><Link to="/onboarding" className="hover:text-indigo-500 transition-colors">PDF & Web Scraper Sync</Link></li>
              <li><Link to="/settings" className="hover:text-indigo-500 transition-colors">Multi-LLM Routing</Link></li>
              <li><Link to="/billing" className="hover:text-indigo-500 transition-colors">Enterprise SLA</Link></li>
              <li><Link to="/chat-logs" className="hover:text-indigo-500 transition-colors">Omnichannel Ingestion</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${darkMode ? "text-white" : "text-slate-900"}`}>Account & Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/login" className="hover:text-indigo-500 transition-colors">Sign In</Link></li>
              <li><Link to="/signup" className="hover:text-indigo-500 transition-colors">Create Account</Link></li>
              <li><Link to="/settings" className="hover:text-indigo-500 transition-colors">API & Webhooks</Link></li>
              <li><a href="#" className="hover:text-indigo-500 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-500 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

        </div>

        <div className={`pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-xs ${
          darkMode ? "border-slate-900 text-slate-500" : "border-slate-200 text-slate-500"
        }`}>
          <p>© {new Date().getFullYear()} ChatDesk AI SaaS Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-emerald-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All Systems Operational (99.99% Uptime)
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-indigo-500" /> SOC2 Certified
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
