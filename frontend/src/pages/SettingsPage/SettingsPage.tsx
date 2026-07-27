/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";
import { settingsApi } from "../../api/settingsApi";
import { CardListSkeleton } from "../../components/Common/Skeleton";
import type {
  TeamMember,
  WebhookConfig,
  SecurityConfig,
} from "../../api/settingsApi";
import {
  Cpu,
  Key,
  Users,
  Webhook,
  ShieldCheck,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Copy,
  Plus,
  Trash2,
  Send,
  UserPlus,
  CheckCircle,
  ShieldAlert,
  Check,
} from "lucide-react";

export const SettingsPage: React.FC = () => {
  const { darkMode } = useTheme();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("ai");

  // State: AI Config
  const [selectedModel, setSelectedModel] = useState("gemini-1.5-flash");
  const [temperature, setTemperature] = useState(0.3);
  const [systemPrompt, setSystemPrompt] = useState(
    "You are ChatDesk AI, a helpful, polite, and technical support agent. Never invent facts. Base all answers strictly on verified docs.",
  );

  // State: API Keys
  const [apiKey, setApiKey] = useState("cd_live_9984712049817294871");
  const [showKey, setShowKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // State: Team Members
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "agent">("agent");
  const [inviting, setInviting] = useState(false);

  // State: Webhooks
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([
    "conversation.created",
    "ticket.resolved",
  ]);
  const [addingWebhook, setAddingWebhook] = useState(false);
  const [testingWebhookId, setTestingWebhookId] = useState<string | null>(null);

  // State: Security & SSO
  const [security, setSecurity] = useState<SecurityConfig>({
    enforceSso: false,
    ssoProvider: "Google SAML 2.0",
    enforce2FA: true,
    sessionTimeoutHours: 24,
    ipWhitelist: "",
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initial Data Fetch
  useEffect(() => {
    let isMounted = true;

    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [settingsRes, teamRes] = await Promise.allSettled([
          settingsApi.getSettings(),
          settingsApi.getTeamMembers(),
        ]);

        if (!isMounted) return;

        if (settingsRes.status === "fulfilled" && settingsRes.value?.data) {
          const data = settingsRes.value.data;
          if (data.aiModel) setSelectedModel(data.aiModel);
          if (data.systemPrompt) setSystemPrompt(data.systemPrompt);
          if (data.temperature !== undefined) setTemperature(data.temperature);
          if (data.apiKey) setApiKey(data.apiKey);
          if (data.webhooks) setWebhooks(data.webhooks);
          if (data.security) setSecurity(data.security);
        }

        if (teamRes.status === "fulfilled" && teamRes.value?.data) {
          setTeamMembers(teamRes.value.data);
        }
      } catch (err: any) {
        if (isMounted) console.warn("Using default settings fallback", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAllData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Actions
  const handleSave = async () => {
    try {
      setSaving(true);
      await settingsApi.updateSettings({
        aiModel: selectedModel,
        systemPrompt,
        temperature,
        security,
      });
      toast.success("Platform settings updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleRotateKey = async () => {
    try {
      const res = await settingsApi.rotateApiKey();
      if (res?.data?.apiKey) {
        setApiKey(res.data.apiKey);
      }
      toast.success("API key rotated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to rotate API key.");
    }
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    toast.success("API Key copied to clipboard!");
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // Team Member Handlers
  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) {
      toast.error("Please enter a valid email address.");
      return;
    }
    try {
      setInviting(true);
      const res = await settingsApi.inviteTeamMember({
        name: inviteName.trim(),
        email: inviteEmail.trim(),
        role: inviteRole,
      });
      if (res?.data) {
        setTeamMembers((prev) => [...prev, res.data]);
        toast.success(`Invite sent to ${inviteEmail}!`);
        setInviteName("");
        setInviteEmail("");
        setShowInviteModal(false);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to invite team member.");
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveMember = async (id: string, name: string) => {
    if (
      !window.confirm(
        `Are you sure you want to remove ${name} from the workspace?`,
      )
    )
      return;
    try {
      await settingsApi.removeTeamMember(id);
      setTeamMembers((prev) => prev.filter((m) => m._id !== id));
      toast.success(`${name} removed from team.`);
    } catch (err: any) {
      toast.error(err.message || "Failed to remove team member.");
    }
  };

  // Webhook Handlers
  const handleAddWebhookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!webhookUrl.trim()) {
      toast.error("Please enter a valid webhook URL.");
      return;
    }
    try {
      setAddingWebhook(true);
      const res = await settingsApi.addWebhook({
        url: webhookUrl.trim(),
        events: selectedEvents,
      });
      if (res?.data) {
        setWebhooks(res.data);
        toast.success("Webhook endpoint added successfully!");
        setWebhookUrl("");
        setShowWebhookModal(false);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to add webhook.");
    } finally {
      setAddingWebhook(false);
    }
  };

  const handleTestWebhook = async (id: string) => {
    try {
      setTestingWebhookId(id);
      const res = await settingsApi.testWebhook(id);
      toast.success(res?.message || "Test payload delivered (HTTP 200 OK)!");
    } catch (err: any) {
      toast.error(err.message || "Webhook test failed.");
    } finally {
      setTestingWebhookId(null);
    }
  };

  const handleDeleteWebhook = async (id: string) => {
    try {
      const res = await settingsApi.deleteWebhook(id);
      if (res?.data) {
        setWebhooks(res.data);
      } else {
        setWebhooks((prev) => prev.filter((w) => w._id !== id));
      }
      toast.success("Webhook endpoint removed.");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete webhook.");
    }
  };

  const toggleEventSelection = (eventName: string) => {
    setSelectedEvents((prev) =>
      prev.includes(eventName)
        ? prev.filter((e) => e !== eventName)
        : [...prev, eventName],
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Platform Settings
            </h1>
            <p
              className={`text-xs mt-1 ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Configure AI model parameters, API keys, team permissions,
              webhooks, and security.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save Configuration"}</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          className={`flex items-center gap-2 border-b pb-2 overflow-x-auto ${
            darkMode ? "border-slate-800" : "border-slate-200"
          }`}
        >
          {[
            { id: "ai", name: "AI Model Config", icon: Cpu },
            { id: "keys", name: "API Keys", icon: Key },
            { id: "team", name: "Team Members", icon: Users },
            { id: "webhooks", name: "Webhooks", icon: Webhook },
            { id: "security", name: "Security & SSO", icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : darkMode
                      ? "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                      : "bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: AI MODEL CONFIG */}
        {activeTab === "ai" && (
          <div
            className={`p-6 rounded-2xl border space-y-6 max-w-3xl ${
              darkMode
                ? "bg-slate-900/90 border-slate-800"
                : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <h3
              className={`text-base font-bold ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Select LLM Inference Engine
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  id: "gpt-4o",
                  name: "OpenAI GPT-4o",
                  badge: "Recommended",
                  desc: "Best for complex multi-turn reasoning.",
                },
                {
                  id: "claude-3.5",
                  name: "Claude 3.5 Sonnet",
                  badge: "Fastest RAG",
                  desc: "Superior technical doc synthesis.",
                },
                {
                  id: "gemini-1.5-flash",
                  name: "Gemini 1.5 Flash",
                  badge: "Default Engine",
                  desc: "Ultra-fast response & low latency.",
                },
              ].map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedModel(m.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedModel === m.id
                      ? "bg-indigo-600/20 border-indigo-500 text-indigo-500 font-bold"
                      : darkMode
                        ? "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold">{m.name}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-500 font-bold">
                      {m.badge}
                    </span>
                  </div>
                  <p
                    className={`text-[11px] ${
                      darkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {m.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Temperature Slider */}
            <div
              className={`space-y-3 pt-4 border-t ${
                darkMode ? "border-slate-800" : "border-slate-200"
              }`}
            >
              <div className="flex justify-between text-xs font-bold">
                <span className={darkMode ? "text-white" : "text-slate-900"}>
                  Temperature (Creativity vs Determinism)
                </span>
                <span className="text-indigo-500 font-mono">{temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0.0 (Strict Knowledge Retrieval)</span>
                <span>1.0 (Creative Response)</span>
              </div>
            </div>

            {/* System Prompt Persona */}
            <div
              className={`space-y-2 pt-4 border-t ${
                darkMode ? "border-slate-800" : "border-slate-200"
              }`}
            >
              <label
                className={`text-xs font-bold block ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                Custom System Prompt Persona
              </label>
              <textarea
                rows={4}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className={`w-full border rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                  darkMode
                    ? "bg-slate-950 border-slate-800 text-slate-200"
                    : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              />
            </div>
          </div>
        )}

        {/* TAB 2: API KEYS */}
        {activeTab === "keys" && (
          <div
            className={`p-6 rounded-2xl border space-y-6 max-w-3xl ${
              darkMode
                ? "bg-slate-900/90 border-slate-800"
                : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3
                  className={`text-base font-bold ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  Secret API Tokens
                </h3>
                <p
                  className={`text-xs ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Use this token to authenticate programmatic REST API requests.
                </p>
              </div>

              <button
                onClick={handleRotateKey}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Rotate API Key
              </button>
            </div>

            <div
              className={`p-4 rounded-xl border space-y-3 ${
                darkMode
                  ? "bg-slate-950 border-slate-800"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span
                  className={`font-bold ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  Live Production Secret Key
                </span>
                <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Active Status
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type={showKey ? "text" : "password"}
                  readOnly
                  value={apiKey}
                  className={`flex-1 border rounded-xl px-3.5 py-2 text-xs font-mono ${
                    darkMode
                      ? "bg-slate-900 border-slate-800 text-indigo-300"
                      : "bg-white border-slate-300 text-indigo-600"
                  }`}
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className={`p-2 rounded-xl border ${
                    darkMode
                      ? "bg-slate-800 border-slate-700 text-slate-300"
                      : "bg-white border-slate-200 text-slate-700 shadow-sm"
                  }`}
                  title={showKey ? "Hide key" : "Show key"}
                >
                  {showKey ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={handleCopyKey}
                  className={`p-2 rounded-xl border flex items-center gap-1 text-xs font-semibold ${
                    copiedKey
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : darkMode
                        ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                        : "bg-white border-slate-200 text-slate-700 shadow-sm hover:bg-slate-100"
                  }`}
                  title="Copy API key"
                >
                  {copiedKey ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Rate Limit Summary */}
            <div
              className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
                darkMode
                  ? "bg-slate-900 border-slate-800"
                  : "bg-slate-100/60 border-slate-200"
              }`}
            >
              <div>
                <span className="font-semibold block">Rate Limit Quota</span>
                <span
                  className={darkMode ? "text-slate-400" : "text-slate-500"}
                >
                  1,000 requests per minute allowed on current plan
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-500 font-bold text-[10px]">
                Tier: Enterprise
              </span>
            </div>
          </div>
        )}

        {/* TAB 3: TEAM MEMBERS */}
        {activeTab === "team" && (
          <div
            className={`p-6 rounded-2xl border space-y-6 max-w-3xl ${
              darkMode
                ? "bg-slate-900/90 border-slate-800"
                : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3
                  className={`text-base font-bold ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  Workspace Team Members
                </h3>
                <p
                  className={`text-xs ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Manage active support agents, workspace admins, and invitation
                  links.
                </p>
              </div>

              <button
                onClick={() => setShowInviteModal(true)}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
              >
                <UserPlus className="w-3.5 h-3.5" /> Invite Member
              </button>
            </div>

            {/* Team Members List */}
            {loading ? (
              <CardListSkeleton count={3} />
            ) : (
              <div className="space-y-3">
                {teamMembers.map((m) => (
                <div
                  key={m._id}
                  className={`p-4 rounded-xl border flex items-center justify-between ${
                    darkMode
                      ? "bg-slate-950 border-slate-800"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {m.avatar ? (
                      <img
                        src={m.avatar}
                        alt={m.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-700"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center text-white font-bold text-sm">
                        {m.name ? m.name.substring(0, 2).toUpperCase() : "CD"}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold ${
                            darkMode ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {m.name}
                        </span>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            m.role === "owner"
                              ? "bg-indigo-500/20 text-indigo-500"
                              : m.role === "admin"
                                ? "bg-emerald-500/20 text-emerald-500"
                                : "bg-slate-500/20 text-slate-400"
                          }`}
                        >
                          {m.role}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] block ${
                          darkMode ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        {m.email}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-semibold flex items-center gap-1 ${
                        m.status === "online"
                          ? "text-emerald-500"
                          : "text-slate-400"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          m.status === "online"
                            ? "bg-emerald-500"
                            : "bg-slate-500"
                        }`}
                      />
                      {m.status || "offline"}
                    </span>

                    {m.role !== "owner" && (
                      <button
                        onClick={() => handleRemoveMember(m._id, m.name)}
                        className={`p-2 rounded-lg border text-rose-500 transition-colors ${
                          darkMode
                            ? "bg-slate-900 border-slate-800 hover:bg-rose-900/30"
                            : "bg-white border-slate-200 hover:bg-rose-50 shadow-sm"
                        }`}
                        title="Remove member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            )}

            {/* Invite Modal */}
            {showInviteModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
                <div
                  className={`w-full max-w-md p-6 rounded-2xl border space-y-4 shadow-xl ${
                    darkMode
                      ? "bg-slate-900 border-slate-800 text-white"
                      : "bg-white border-slate-200 text-slate-900"
                  }`}
                >
                  <h3 className="text-base font-bold">
                    Invite New Team Member
                  </h3>
                  <form onSubmit={handleInviteSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold block mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Marcus Vance"
                        value={inviteName}
                        onChange={(e) => setInviteName(e.target.value)}
                        className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                          darkMode
                            ? "bg-slate-950 border-slate-800 text-slate-200"
                            : "bg-slate-50 border-slate-300 text-slate-900"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="agent@company.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                          darkMode
                            ? "bg-slate-950 border-slate-800 text-slate-200"
                            : "bg-slate-50 border-slate-300 text-slate-900"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold block mb-1">
                        Assigned Role
                      </label>
                      <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value as any)}
                        className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                          darkMode
                            ? "bg-slate-950 border-slate-800 text-slate-200"
                            : "bg-slate-50 border-slate-300 text-slate-900"
                        }`}
                      >
                        <option value="agent">
                          Support Agent (Respond & Manage Chats)
                        </option>
                        <option value="admin">
                          Workspace Admin (Full System Access)
                        </option>
                      </select>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowInviteModal(false)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold border ${
                          darkMode
                            ? "bg-slate-800 border-slate-700 text-slate-300"
                            : "bg-slate-100 border-slate-200 text-slate-700"
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={inviting}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 disabled:opacity-50"
                      >
                        {inviting ? "Sending Invite..." : "Send Invitation"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: WEBHOOKS */}
        {activeTab === "webhooks" && (
          <div
            className={`p-6 rounded-2xl border space-y-6 max-w-3xl ${
              darkMode
                ? "bg-slate-900/90 border-slate-800"
                : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3
                  className={`text-base font-bold ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  Webhook Endpoints
                </h3>
                <p
                  className={`text-xs ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Receive real-time HTTP POST notifications when system events
                  occur.
                </p>
              </div>

              <button
                onClick={() => setShowWebhookModal(true)}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
              >
                <Plus className="w-3.5 h-3.5" /> Add Webhook Endpoint
              </button>
            </div>

            {/* Webhooks List */}
            {webhooks.length === 0 ? (
              <div
                className={`p-8 text-center rounded-xl border border-dashed text-xs ${
                  darkMode
                    ? "border-slate-800 text-slate-500"
                    : "border-slate-300 text-slate-400"
                }`}
              >
                No webhook endpoints configured yet. Click above to register
                your first endpoint.
              </div>
            ) : (
              <div className="space-y-4">
                {webhooks.map((w) => (
                  <div
                    key={w._id || w.url}
                    className={`p-4 rounded-xl border space-y-3 ${
                      darkMode
                        ? "bg-slate-950 border-slate-800"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-500">
                          {w.url}
                        </span>
                        <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-500 font-bold uppercase">
                          {w.status || "active"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => w._id && handleTestWebhook(w._id)}
                          disabled={testingWebhookId === w._id}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-500 hover:bg-indigo-600/30 text-[11px] font-bold flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          {testingWebhookId === w._id
                            ? "Testing..."
                            : "Test Ping"}
                        </button>
                        <button
                          onClick={() => w._id && handleDeleteWebhook(w._id)}
                          className="p-1.5 rounded-lg border text-rose-500 border-slate-700/40 hover:bg-rose-900/30"
                          title="Delete webhook"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      <span className="text-slate-500 font-medium">
                        Events:
                      </span>
                      {w.events?.map((ev) => (
                        <span
                          key={ev}
                          className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono"
                        >
                          {ev}
                        </span>
                      ))}
                    </div>

                    <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between pt-1">
                      <span>Signing Secret: {w.secret || "whsec_..."}</span>
                      <span>
                        Created:{" "}
                        {w.createdAt
                          ? new Date(w.createdAt).toLocaleDateString()
                          : "Today"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Webhook Modal */}
            {showWebhookModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
                <div
                  className={`w-full max-w-md p-6 rounded-2xl border space-y-4 shadow-xl ${
                    darkMode
                      ? "bg-slate-900 border-slate-800 text-white"
                      : "bg-white border-slate-200 text-slate-900"
                  }`}
                >
                  <h3 className="text-base font-bold">Add Webhook Endpoint</h3>
                  <form onSubmit={handleAddWebhookSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold block mb-1">
                        Payload URL *
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="https://api.yourcompany.com/webhooks/chatdesk"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                          darkMode
                            ? "bg-slate-950 border-slate-800 text-slate-200"
                            : "bg-slate-50 border-slate-300 text-slate-900"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold block mb-2">
                        Subscribed Events
                      </label>
                      <div className="space-y-2 text-xs">
                        {[
                          "conversation.created",
                          "ticket.resolved",
                          "bot.escalated",
                          "user.signedup",
                        ].map((ev) => (
                          <label
                            key={ev}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedEvents.includes(ev)}
                              onChange={() => toggleEventSelection(ev)}
                              className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="font-mono text-xs">{ev}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowWebhookModal(false)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold border ${
                          darkMode
                            ? "bg-slate-800 border-slate-700 text-slate-300"
                            : "bg-slate-100 border-slate-200 text-slate-700"
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={addingWebhook}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 disabled:opacity-50"
                      >
                        {addingWebhook
                          ? "Adding Endpoint..."
                          : "Register Webhook"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: SECURITY & SSO */}
        {activeTab === "security" && (
          <div
            className={`p-6 rounded-2xl border space-y-6 max-w-3xl ${
              darkMode
                ? "bg-slate-900/90 border-slate-800"
                : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div>
              <h3
                className={`text-base font-bold ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                Security, Authentication & SSO
              </h3>
              <p
                className={`text-xs ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Enforce corporate access policies, two-factor authentication,
                and Single Sign-On.
              </p>
            </div>

            {/* SSO Toggle */}
            <div
              className={`p-4 rounded-xl border flex items-center justify-between ${
                darkMode
                  ? "bg-slate-950 border-slate-800"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div>
                <span className="text-xs font-bold block">
                  Enforce SAML 2.0 Single Sign-On
                </span>
                <span
                  className={`text-[11px] ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                >
                  Require team members to authenticate through enterprise
                  identity provider.
                </span>
              </div>
              <input
                type="checkbox"
                checked={security.enforceSso}
                onChange={(e) =>
                  setSecurity({ ...security, enforceSso: e.target.checked })
                }
                className="w-5 h-5 accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Provider Selector */}
            {security.enforceSso && (
              <div className="space-y-2">
                <label className="text-xs font-bold block">
                  Identity Provider (IdP)
                </label>
                <select
                  value={security.ssoProvider}
                  onChange={(e) =>
                    setSecurity({ ...security, ssoProvider: e.target.value })
                  }
                  className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                    darkMode
                      ? "bg-slate-950 border-slate-800 text-slate-200"
                      : "bg-slate-50 border-slate-300 text-slate-900"
                  }`}
                >
                  <option value="Google SAML 2.0">
                    Google Workspace SAML 2.0
                  </option>
                  <option value="Okta SSO">Okta Single Sign-On</option>
                  <option value="Azure AD">
                    Microsoft Azure Active Directory (Entra ID)
                  </option>
                </select>
              </div>
            )}

            {/* 2FA Enforcement */}
            <div
              className={`p-4 rounded-xl border flex items-center justify-between ${
                darkMode
                  ? "bg-slate-950 border-slate-800"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div>
                <span className="text-xs font-bold block">
                  Enforce Two-Factor Authentication (2FA)
                </span>
                <span
                  className={`text-[11px] ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                >
                  Mandate TOTP authenticator app verification for all workspace
                  agents.
                </span>
              </div>
              <input
                type="checkbox"
                checked={security.enforce2FA}
                onChange={(e) =>
                  setSecurity({ ...security, enforce2FA: e.target.checked })
                }
                className="w-5 h-5 accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Session Timeout */}
            <div className="space-y-2">
              <label className="text-xs font-bold block">
                Idle Session Timeout
              </label>
              <select
                value={security.sessionTimeoutHours}
                onChange={(e) =>
                  setSecurity({
                    ...security,
                    sessionTimeoutHours: Number(e.target.value),
                  })
                }
                className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                  darkMode
                    ? "bg-slate-950 border-slate-800 text-slate-200"
                    : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              >
                <option value={1}>1 Hour</option>
                <option value={8}>8 Hours (Standard Workday)</option>
                <option value={24}>24 Hours (Default)</option>
                <option value={168}>7 Days</option>
              </select>
            </div>

            {/* IP Whitelist */}
            <div className="space-y-2">
              <label className="text-xs font-bold block">
                Corporate IP Whitelist (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Comma separated CIDRs e.g. 192.168.1.0/24, 10.0.0.1"
                value={security.ipWhitelist}
                onChange={(e) =>
                  setSecurity({ ...security, ipWhitelist: e.target.value })
                }
                className={`w-full border rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                  darkMode
                    ? "bg-slate-950 border-slate-800 text-slate-200"
                    : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              />
            </div>

            {/* Security Audit Status Banner */}
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>
                  SOC-2 Type II Compliance Status:{" "}
                  <strong>Verified Compliant</strong>
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold">
                2026 Audit Active
              </span>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
