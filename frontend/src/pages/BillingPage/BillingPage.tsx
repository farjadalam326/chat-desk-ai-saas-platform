/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import StripeModal from "../../components/Billing/StripeModal";
import TierSelectorModal from "../../components/Billing/TierSelectorModal";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";
import { billingApi } from "../../api/billingApi";
import type { BillingUsage } from "../../api/billingApi";
import { PlanCardSkeleton, TableRowSkeleton } from "../../components/Common/Skeleton";
import { Download, Plus, Sparkles } from "lucide-react";

export const BillingPage: React.FC = () => {
  const { darkMode } = useTheme();
  const toast = useToast();
  const [usage, setUsage] = useState<BillingUsage | null>(null);
  const [fetchingUsage, setFetchingUsage] = useState(true);
  const [loading, setLoading] = useState(false);

  // Modal States
  const [isTierSelectorOpen, setIsTierSelectorOpen] = useState(false);
  const [isStripeOpen, setIsStripeOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ id: string; name: string; price: number }>({
    id: "pro",
    name: "Pro",
    price: 79,
  });

  const loadUsage = () => {
    setFetchingUsage(true);
    billingApi
      .getUsage()
      .then((res) => {
        if (res?.data) {
          setUsage(res.data);
        }
      })
      .catch((err: any) => {
        console.warn("Using billing usage fallback data", err);
      })
      .finally(() => {
        setFetchingUsage(false);
      });
  };

  useEffect(() => {
    let ignore = false;
    billingApi
      .getUsage()
      .then((res) => {
        if (!ignore && res?.data) {
          setUsage(res.data);
        }
      })
      .catch((err: any) => {
        if (!ignore) {
          console.warn("Using billing usage fallback data", err);
        }
      })
      .finally(() => {
        if (!ignore) setFetchingUsage(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const openStripeModal = (planId: string, planName: string, price: number) => {
    setSelectedPlan({ id: planId, name: planName, price });
    setIsStripeOpen(true);
  };

  const handleSelectTierFromBox = (planId: string, planName: string, price: number) => {
    setIsTierSelectorOpen(false);
    openStripeModal(planId, planName, price);
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm("Are you sure you want to cancel your active subscription? Your workspace will be moved to the Free plan.")) {
      return;
    }
    try {
      setLoading(true);
      const res = await billingApi.cancelSubscription();
      toast.success(res?.data?.message || "Subscription cancelled successfully.");
      loadUsage();
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel subscription.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId: string) => {
    try {
      setLoading(true);
      const res = await billingApi.createCheckoutSession(planId);
      if (res?.data?.checkoutUrl && res.data.checkoutUrl.startsWith("http")) {
        window.location.href = res.data.checkoutUrl;
      } else {
        openStripeModal(
          planId,
          planId === "enterprise" ? "Enterprise" : planId === "starter" ? "Starter" : "Pro",
          planId === "enterprise" ? 249 : planId === "starter" ? 29 : 79
        );
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to initiate checkout session.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = (invId: string) => {
    toast.success(`Downloading PDF invoice receipt for ${invId}...`);
  };

  const invoices = usage?.invoices || [
    {
      id: "INV-2026-007",
      date: "Jul 1, 2026",
      amount: "$79.00",
      status: "Paid",
      plan: "Pro Plan (Monthly)",
    },
    {
      id: "INV-2026-006",
      date: "Jun 1, 2026",
      amount: "$79.00",
      status: "Paid",
      plan: "Pro Plan (Monthly)",
    },
    {
      id: "INV-2026-005",
      date: "May 1, 2026",
      amount: "$79.00",
      status: "Paid",
      plan: "Pro Plan (Monthly)",
    },
    {
      id: "INV-2026-004",
      date: "Apr 1, 2026",
      amount: "$79.00",
      status: "Paid",
      plan: "Pro Plan (Monthly)",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Billing & Usage Subscription
            </h1>
            <p
              className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
            >
              Manage active plan tiers, monthly AI token quotas, and invoice
              receipts.
            </p>
          </div>

          <button
            onClick={() => handleUpgrade("enterprise")}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />{" "}
            {loading ? "Processing..." : "Upgrade to Enterprise"}
          </button>
        </div>

        {/* Current Plan Overview Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {fetchingUsage ? (
            <div className="lg:col-span-2">
              <PlanCardSkeleton />
            </div>
          ) : (
            <div
              className={`lg:col-span-2 p-6 rounded-2xl border space-y-6 ${
                darkMode
                  ? "bg-slate-900/90 border-slate-800"
                  : "bg-white border-slate-200 shadow-sm"
              }`}
            >
            {(() => {
              const planKey = (usage?.plan || "pro").toLowerCase();
              const isFreePlan = planKey === "free";
              const planTitle = isFreePlan
                ? "Free Tier Plan"
                : planKey === "starter"
                ? "Starter Plan Subscription"
                : planKey === "enterprise"
                ? "Enterprise Plan Subscription"
                : "Pro Plan Subscription";
              const planPrice = isFreePlan
                ? "$0.00 / month"
                : planKey === "starter"
                ? "$29.00 / month"
                : planKey === "enterprise"
                ? "$249.00 / month"
                : "$79.00 / month";
              const planBadge = isFreePlan
                ? "Active • Free Tier"
                : `Active • Renews ${usage?.nextBillingDate || "Aug 25, 2026"}`;

              const usedMessages = usage?.messagesUsed ?? usage?.conversations?.used ?? 0;
              const limitMessages = usage?.messagesLimit ?? usage?.conversations?.limit ?? (isFreePlan ? 500 : 5000);
              const remainingMessages = Math.max(0, limitMessages - usedMessages);
              const usagePercentage = Math.min(100, Math.round((usedMessages / (limitMessages || 1)) * 100));

              return (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-500">
                        Current Plan
                      </span>
                      <h2
                        className={`text-2xl font-extrabold ${darkMode ? "text-white" : "text-slate-900"}`}
                      >
                        {planTitle}
                      </h2>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      isFreePlan
                        ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                        : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    }`}>
                      {planBadge}
                    </span>
                  </div>

                  {/* Credit Quota Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span
                        className={darkMode ? "text-slate-300" : "text-slate-700"}
                      >
                        Monthly AI Messages Used
                      </span>
                      <span className="text-indigo-500 font-bold">
                        {`${usedMessages.toLocaleString()} / ${limitMessages.toLocaleString()} Messages`}
                      </span>
                    </div>
                    <div
                      className={`w-full h-3 rounded-full overflow-hidden border ${
                        darkMode
                          ? "bg-slate-950 border-slate-800"
                          : "bg-slate-100 border-slate-200"
                      }`}
                    >
                      <div
                        className="h-full bg-gradient-to-r from-indigo-600 to-emerald-400"
                        style={{
                          width: `${usagePercentage}%`,
                        }}
                      ></div>
                    </div>
                    <p
                      className={`text-[11px] ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                    >
                      {isFreePlan
                        ? `${remainingMessages.toLocaleString()} messages remaining. No monthly recurring charge.`
                        : `${remainingMessages.toLocaleString()} messages remaining. Reset date: ${usage?.nextBillingDate || "Aug 25, 2026"}.`}
                    </p>
                  </div>

                  <div
                    className={`pt-4 border-t flex items-center justify-between ${darkMode ? "border-slate-800" : "border-slate-200"}`}
                  >
                    <span
                      className={`text-xs font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}
                    >
                      {planPrice}
                    </span>
                    <div className="flex items-center gap-3">
                      {!isFreePlan && (
                        <button
                          onClick={handleCancelSubscription}
                          disabled={loading}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                            darkMode
                              ? "bg-slate-800 text-red-400 border-slate-700 hover:bg-red-500/10 hover:border-red-500/30"
                              : "bg-slate-100 text-red-600 border-slate-300 hover:bg-red-50"
                          }`}
                        >
                          Cancel Subscription
                        </button>
                      )}
                      <button
                        onClick={() => setIsTierSelectorOpen(true)}
                        className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-semibold shadow-md shadow-indigo-600/20"
                      >
                        {isFreePlan ? "Upgrade Plan" : "Change Tier"}
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}

          {/* Payment Method Card */}
          <div
            className={`p-6 rounded-2xl border space-y-4 flex flex-col justify-between ${
              darkMode
                ? "bg-slate-900/90 border-slate-800"
                : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div>
              <h3
                className={`text-base font-bold mb-4 ${darkMode ? "text-white" : "text-slate-900"}`}
              >
                Payment Method
              </h3>
              <div
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  darkMode
                    ? "bg-slate-950 border-slate-800"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-7 rounded bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-bold text-xs text-indigo-500">
                    VISA
                  </div>
                  <div>
                    <p
                      className={`text-xs font-bold ${darkMode ? "text-white" : "text-slate-900"}`}
                    >
                      •••• •••• •••• 4242
                    </p>
                    <p
                      className={`text-[10px] ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                    >
                      Expires 12/28
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                    darkMode
                      ? "bg-slate-800 text-slate-300"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  Default
                </span>
              </div>
            </div>

            <button
              onClick={() => openStripeModal("pro", "Pro Card Setup", 79)}
              className={`w-full py-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 ${
                darkMode
                  ? "bg-slate-800 text-slate-200 border-slate-700"
                  : "bg-slate-100 text-slate-800 border-slate-300"
              }`}
            >
              <Plus className="w-4 h-4" /> Add Payment Card
            </button>
          </div>
        </div>

        {/* Invoice Receipts Table */}
        <div
          className={`p-6 rounded-2xl border space-y-4 ${
            darkMode
              ? "bg-slate-900/90 border-slate-800"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <h3
            className={`text-base font-bold ${darkMode ? "text-white" : "text-slate-900"}`}
          >
            Invoice History
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr
                  className={`border-b ${darkMode ? "border-slate-800 text-slate-400" : "border-slate-200 text-slate-500"}`}
                >
                  <th className="py-3 px-4 font-semibold">Invoice Number</th>
                  <th className="py-3 px-4 font-semibold">Plan Detail</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Amount</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">PDF</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${darkMode ? "divide-slate-800/60" : "divide-slate-200"}`}
              >
                {fetchingUsage ? (
                  Array.from({ length: 4 }).map((_, idx) => <TableRowSkeleton key={idx} columns={6} />)
                ) : (
                  invoices.map((inv, idx) => (
                    <tr
                      key={idx}
                      className={
                        darkMode ? "hover:bg-slate-800/30" : "hover:bg-slate-50"
                      }
                    >
                      <td className="py-3.5 px-4 font-mono font-medium text-indigo-500">
                        {inv.id}
                      </td>
                      <td
                        className={`py-3.5 px-4 ${darkMode ? "text-slate-200" : "text-slate-800"}`}
                      >
                        {inv.plan}
                      </td>
                      <td
                        className={`py-3.5 px-4 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                      >
                        {inv.date}
                      </td>
                      <td
                        className={`py-3.5 px-4 font-bold ${darkMode ? "text-white" : "text-slate-900"}`}
                      >
                        {inv.amount}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold text-[10px]">
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDownloadPDF(inv.id)}
                          title="Download Invoice PDF"
                          className={`p-1.5 rounded-lg border transition-colors ${
                            darkMode
                              ? "bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600"
                              : "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300"
                          }`}
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Tier Selector Box Modal */}
      <TierSelectorModal
        isOpen={isTierSelectorOpen}
        onClose={() => setIsTierSelectorOpen(false)}
        currentPlan={usage?.plan || "pro"}
        onSelectPlan={handleSelectTierFromBox}
      />

      {/* Stripe Interactive Payment Modal */}
      <StripeModal
        isOpen={isStripeOpen}
        onClose={() => setIsStripeOpen(false)}
        planId={selectedPlan.id}
        planName={selectedPlan.name}
        price={selectedPlan.price}
        onSuccess={loadUsage}
      />
    </DashboardLayout>
  );
};

export default BillingPage;
