import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { Bot, FileText, Palette, BarChart3, Zap, RefreshCw, Cpu } from "lucide-react";

export const FeaturesSection: React.FC = () => {
  const { darkMode } = useTheme();

  const features = [
    {
      icon: <FileText className="w-6 h-6 text-indigo-500" />,
      title: "RAG Document Ingestion",
      description: "Upload PDFs, TXT, DOCX or auto-crawl website URLs to build vector embeddings in seconds."
    },
    {
      icon: <Bot className="w-6 h-6 text-emerald-500" />,
      title: "Autonomous Resolution Agent",
      description: "Answers user questions accurately based strictly on your verified knowledge base sources."
    },
    {
      icon: <Palette className="w-6 h-6 text-amber-500" />,
      title: "Visual Widget Studio",
      description: "Customize brand colors, launcher avatars, position, welcome text & bot personality visually."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-cyan-500" />,
      title: "Real-Time CSAT & Analytics",
      description: "Track deflection rate, resolution speed, sentiment scores, and top customer query trends."
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-purple-500" />,
      title: "Seamless Human Handover",
      description: "Instantly transfer high-priority or negative sentiment chats to live human agent queues."
    },
    {
      icon: <Cpu className="w-6 h-6 text-rose-500" />,
      title: "Multi-LLM Model Selector",
      description: "Switch seamlessly between GPT-4o, Claude 3.5 Sonnet, and Gemini 1.5 Pro to optimize cost & speed."
    }
  ];

  return (
    <section id="features" className={`py-24 border-y transition-colors duration-200 ${
      darkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-semibold">
            <Zap className="w-4 h-4" />
            <span>Built For Modern Support Teams</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
            darkMode ? "text-white" : "text-slate-900"
          }`}>
            Everything You Need To Automate Customer Support
          </h2>
          <p className={`text-base sm:text-lg ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            Deploy an enterprise-grade AI chatbot that works around the clock, scales infinitely, and never sleeps.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, index) => (
            <div
              key={index}
              className={`p-8 rounded-2xl border transition-all duration-300 group shadow-lg ${
                darkMode
                  ? "bg-slate-950/70 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-950"
                  : "bg-slate-50 border-slate-200 hover:border-indigo-400 hover:bg-white"
              }`}
            >
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${
                darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
              }`}>
                {item.icon}
              </div>
              <h3 className={`text-xl font-bold mb-3 transition-colors ${
                darkMode ? "text-white group-hover:text-indigo-300" : "text-slate-900 group-hover:text-indigo-600"
              }`}>
                {item.title}
              </h3>
              <p className={`text-sm leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;
