import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { ArrowRight, Bot, CheckCircle2 } from "lucide-react";

export const CtaSection: React.FC = () => {
  const { darkMode } = useTheme();

  return (
    <section className={`py-20 relative overflow-hidden transition-colors duration-200 ${
      darkMode ? "bg-gradient-to-b from-slate-900 to-slate-950 text-slate-100" : "bg-gradient-to-b from-slate-100 to-slate-50 text-slate-900"
    }`}>
      
      {/* Radial glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full blur-[150px] pointer-events-none ${
        darkMode ? "bg-indigo-600/20" : "bg-indigo-400/25"
      }`}></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`p-10 sm:p-14 rounded-3xl border shadow-2xl text-center space-y-8 backdrop-blur-xl transition-colors ${
          darkMode ? "bg-slate-900/90 border-slate-800" : "bg-white/90 border-slate-200"
        }`}>
          
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30">
            <Bot className="w-9 h-9 text-white" />
          </div>

          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight ${
              darkMode ? "text-white" : "text-slate-900"
            }`}>
              Ready To Automate Your Support Desktop Today?
            </h2>
            <p className={`text-base sm:text-lg ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
              Join 1,200+ fast-growing companies resolving support tickets 24/7 with zero latency.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/onboarding"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 hover:scale-105 transition-all flex items-center justify-center gap-3"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/prototype"
              className={`w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-base border transition-colors ${
                darkMode
                  ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300"
              }`}
            >
              Test Prototype Demo
            </Link>
          </div>

          <div className={`flex flex-wrap items-center justify-center gap-6 text-xs pt-4 ${
            darkMode ? "text-slate-400" : "text-slate-500"
          }`}>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free 14-day trial
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Cancel anytime
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CtaSection;
