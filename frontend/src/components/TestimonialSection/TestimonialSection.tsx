import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { Star } from "lucide-react";

export const TestimonialSection: React.FC = () => {
  const { darkMode } = useTheme();

  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "VP of Customer Support at CloudScale",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      quote: "ChatDesk AI cut our first response time from 45 minutes down to 0 seconds. It resolved 88% of tier-1 support tickets autonomously on day one.",
      rating: 5
    },
    {
      name: "Marcus Vance",
      role: "Head of Operations at NovaCommerce",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      quote: "The knowledge base ingestion is magic. We uploaded 500 pages of technical documentation and our bot answered complex developer API questions flawlessly.",
      rating: 5
    },
    {
      name: "Elena Rostova",
      role: "Lead Product Manager at FinTech Global",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      quote: "Our support agents love the Slack handover integration. The AI pre-populates all customer context so human takeover takes 10 seconds.",
      rating: 5
    }
  ];

  return (
    <section id="reviews" className={`py-24 border-t transition-colors duration-200 ${
      darkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
            darkMode ? "text-white" : "text-slate-900"
          }`}>
            Loved By Modern Support Teams Worldwide
          </h2>
          <p className={`text-base ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            See how leading tech companies scale their customer support operations effortlessly.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className={`p-8 rounded-2xl border flex flex-col justify-between shadow-xl relative group transition-all ${
                darkMode
                  ? "bg-slate-950/80 border-slate-800 hover:border-indigo-500/40"
                  : "bg-slate-50 border-slate-200 hover:border-indigo-400"
              }`}
            >
              <div className="space-y-4 mb-6">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className={`text-sm leading-relaxed italic ${
                  darkMode ? "text-slate-300" : "text-slate-700"
                }`}>
                  "{t.quote}"
                </p>
              </div>

              <div className={`flex items-center gap-3 pt-4 border-t ${darkMode ? "border-slate-800/80" : "border-slate-200"}`}>
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-500/50"
                />
                <div>
                  <h4 className={`text-sm font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>{t.name}</h4>
                  <span className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TestimonialSection;
