import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { billingApi, type PlanItem } from "../../api/billingApi";
import { Check, Sparkles } from "lucide-react";

export const PricingSection: React.FC = () => {
  const { darkMode } = useTheme();
  const [annual, setAnnual] = useState(true);
  const [plans, setPlans] = useState<PlanItem[]>([
    {
      id: "starter",
      name: "Starter",
      description: "Perfect for early-stage startups and small stores.",
      priceMonthly: 29,
      priceAnnual: 24,
      features: [
        "1,000 AI Messages / mo",
        "1 Chatbot Agent",
        "10 MB Document Uploads",
        "Standard Web Widget",
        "Email Support",
      ],
      cta: "Start Starter Plan",
      highlighted: false,
    },
    {
      id: "pro",
      name: "Pro",
      description: "For growing teams that need live handover and analytics.",
      priceMonthly: 79,
      priceAnnual: 65,
      features: [
        "10,000 AI Messages / mo",
        "5 Chatbot Agents",
        "100 MB Document Uploads",
        "Custom Branding & Widget Studio",
        "Live Agent Slack / Handover",
        "Multi-LLM Routing (GPT-4o & Claude)",
        "Priority Support",
      ],
      cta: "Start 14-Day Free Trial",
      highlighted: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "Dedicated infrastructure, custom SLA, and SOC-2 compliance.",
      priceMonthly: 249,
      priceAnnual: 199,
      features: [
        "Unlimited AI Messages",
        "Unlimited Chatbot Agents",
        "Unlimited Document Syncing",
        "Custom Domain & CNAME",
        "Dedicated Account Manager",
        "SOC-2 Type II Audit & HIPAA",
        "99.99% Uptime Guarantee",
      ],
      cta: "Contact Enterprise Sales",
      highlighted: false,
    },
  ]);

  useEffect(() => {
    let ignore = false;
    billingApi
      .getPublicPlans()
      .then((res) => {
        if (!ignore && res?.data && Array.isArray(res.data) && res.data.length > 0) {
          setPlans(res.data);
        }
      })
      .catch((err: unknown) => {
        console.warn("Using default pricing plans fallback", err);
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section id="pricing" className={`py-24 transition-colors duration-200 ${
      darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-500 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Transparent Pricing</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
            darkMode ? "text-white" : "text-slate-900"
          }`}>
            Simple Plans That Scale With Your Growth
          </h2>
          <p className={`text-base sm:text-lg ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            No hidden fees. Cancel anytime. Start with a 14-day free trial.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <span className={`text-sm font-medium ${!annual ? (darkMode ? "text-white" : "text-slate-900") : "text-slate-400"}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`w-14 h-8 rounded-full p-1 relative border transition-colors ${
                darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-200 border-slate-300"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-indigo-500 transition-transform ${
                  annual ? "translate-x-6 bg-emerald-400" : "translate-x-0"
                }`}
              ></div>
            </button>
            <span className={`text-sm font-medium flex items-center gap-1.5 ${annual ? (darkMode ? "text-white" : "text-slate-900") : "text-slate-400"}`}>
              Annual
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 text-[10px] font-bold">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => {
            const price = annual ? plan.priceAnnual : plan.priceMonthly;

            return (
              <div
                key={index}
                className={`rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  plan.highlighted
                    ? darkMode
                      ? "bg-slate-900 border-2 border-indigo-500 shadow-2xl shadow-indigo-600/20 scale-105"
                      : "bg-white border-2 border-indigo-600 shadow-xl scale-105"
                    : darkMode
                    ? "bg-slate-900/60 border border-slate-800 hover:border-slate-700"
                    : "bg-white border border-slate-200 shadow-sm hover:border-slate-300"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-emerald-400 text-white font-bold text-xs px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
                    Most Popular Choice
                  </div>
                )}

                <div>
                  <h3 className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-slate-900"}`}>{plan.name}</h3>
                  <p className={`text-xs mb-6 h-10 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{plan.description}</p>

                  <div className={`flex items-baseline gap-1 mb-8 border-b pb-6 ${darkMode ? "border-slate-800" : "border-slate-200"}`}>
                    <span className={`text-4xl font-extrabold ${darkMode ? "text-white" : "text-slate-900"}`}>${price}</span>
                    <span className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>/ month</span>
                  </div>

                  <ul className="space-y-3.5 mb-8 text-sm">
                    {plan.features.map((feat, i) => (
                      <li key={i} className={`flex items-center gap-3 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={`/signup?plan=${plan.id || "pro"}`}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm text-center transition-all shadow-md ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-indigo-600 to-emerald-500 text-white hover:opacity-95 shadow-indigo-600/30"
                      : darkMode
                      ? "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default PricingSection;
