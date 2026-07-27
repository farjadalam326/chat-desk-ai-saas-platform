import React from 'react';
import { X, Check, Zap, Sparkles, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface TierSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: string;
  onSelectPlan: (planId: string, planName: string, price: number) => void;
}

export const TierSelectorModal: React.FC<TierSelectorModalProps> = ({
  isOpen,
  onClose,
  currentPlan,
  onSelectPlan,
}) => {
  const { darkMode } = useTheme();

  if (!isOpen) return null;

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for early-stage startups and small stores.',
      price: 29,
      features: [
        '1,000 AI Messages / mo',
        '1 Chatbot Agent',
        '10 MB Document Uploads',
        'Standard Web Widget',
        'Email Support',
      ],
      popular: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For growing teams that need live handover and analytics.',
      price: 79,
      features: [
        '10,000 AI Messages / mo',
        '5 Chatbot Agents',
        '100 MB Document Uploads',
        'Custom Branding & Widget Studio',
        'Live Agent Slack / Handover',
        'Multi-LLM Routing (GPT-4o & Claude)',
        'Priority Support',
      ],
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Dedicated infrastructure, custom SLA, and SOC-2 compliance.',
      price: 249,
      features: [
        'Unlimited AI Messages',
        'Unlimited Chatbot Agents',
        'Unlimited Document Syncing',
        'Custom Domain & CNAME',
        'Dedicated Account Manager',
        'SOC-2 Type II Audit & HIPAA',
        '99.99% Uptime Guarantee',
      ],
      popular: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className={`relative w-full max-w-4xl rounded-3xl p-6 sm:p-8 border shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
                Subscription Management
              </span>
            </div>
            <h2 className={`text-xl sm:text-2xl font-extrabold tracking-tight mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Select Your Subscription Plan
            </h2>
            <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Choose a tier below to switch or upgrade your workspace capabilities instantly.
            </p>
          </div>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              darkMode ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-900'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Plans Grid Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((p) => {
            const isCurrent = currentPlan.toLowerCase() === p.id.toLowerCase();
            return (
              <div
                key={p.id}
                className={`relative rounded-2xl p-5 border flex flex-col justify-between transition-all duration-200 ${
                  p.popular
                    ? darkMode
                      ? 'bg-slate-950/90 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                      : 'bg-indigo-50/40 border-indigo-300 shadow-md'
                    : darkMode
                    ? 'bg-slate-950/40 border-slate-800'
                    : 'bg-slate-50/60 border-slate-200'
                }`}
              >
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-emerald-400 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Most Popular
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{p.name}</h3>
                    <p className={`text-xs mt-1 line-clamp-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {p.description}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>${p.price}</span>
                    <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>/ month</span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800/40 text-xs">
                    {p.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                        <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center justify-center gap-1.5 cursor-not-allowed"
                    >
                      <ShieldCheck className="w-4 h-4" /> Current Active Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectPlan(p.id, p.name, p.price)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md ${
                        p.popular
                          ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
                          : darkMode
                          ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                          : 'bg-white hover:bg-slate-100 text-slate-900 border border-slate-300'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" /> Select & Pay with Stripe
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default TierSelectorModal;
