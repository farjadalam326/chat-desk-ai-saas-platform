/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";
import { widgetApi } from "../../api/widgetApi";
import { SkeletonBox } from "../../components/Common/Skeleton";
import {
  Palette,
  Bot,
  MessageSquare,
  Check,
  Code,
  Copy,
  Send,
  Minimize2,
  X,
  Save,
} from "lucide-react";

export const WidgetCustomizerPage: React.FC = () => {
  const { darkMode } = useTheme();
  const toast = useToast();
  const [primaryColor, setPrimaryColor] = useState("#6366f1");
  const [botName, setBotName] = useState("ChatDesk Assistant");
  const [greeting, setGreeting] = useState(
    "Hi there! 👋 How can I help your team today?",
  );
  const [position, setPosition] = useState<"right" | "left">("right");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const colors = [
    { name: "Indigo", hex: "#6366f1" },
    { name: "Emerald", hex: "#10b981" },
    { name: "Purple", hex: "#8b5cf6" },
    { name: "Rose", hex: "#f43f5e" },
    { name: "Amber", hex: "#f59e0b" },
    { name: "Cyan", hex: "#06b6d4" },
  ];

  useEffect(() => {
    let ignore = false;
    const loadConfig = async () => {
      try {
        setLoading(true);
        const res = await widgetApi.getConfig();
        if (!ignore && res?.data) {
          if (res.data.primaryColor) setPrimaryColor(res.data.primaryColor);
          if (res.data.botName) setBotName(res.data.botName);
          if (res.data.greeting) setGreeting(res.data.greeting);
          if (res.data.position) setPosition(res.data.position);
        }
      } catch (err: any) {
        if (!ignore) console.warn("Using default widget config fallback", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    loadConfig();
    return () => {
      ignore = true;
    };
  }, []);

  const handleSaveConfig = async () => {
    try {
      setSaving(true);
      await widgetApi.updateConfig({
        primaryColor,
        botName,
        greeting,
        position,
      });
      toast.success("Widget customization saved successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save widget configuration.");
    } finally {
      setSaving(false);
    }
  };

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:5173";
  const embedScript = `<script src="${baseUrl}/embed.js" data-workspace-id="default-workspace" data-color="${primaryColor}" data-position="${position}"></script>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedScript);
    setCopied(true);
    toast.success("Embed script tag copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Widget Studio & Customization
            </h1>
            <p
              className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
            >
              Customize your customer-facing AI widget colors, greeting
              messaging, avatars, and layout.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveConfig}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-md disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving..." : "Save Customization"}</span>
            </button>
            <button
              onClick={copyEmbedCode}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/20"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Code className="w-4 h-4" />
              )}
              <span>{copied ? "Script Copied!" : "Copy Embed Script"}</span>
            </button>
          </div>
        </div>

        {/* Split-screen Studio Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Visual Customizer Controls */}
          <div
            className={`lg:col-span-6 rounded-2xl border p-6 space-y-6 ${
              darkMode
                ? "bg-slate-900/90 border-slate-800"
                : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            {/* Color Theme Selector */}
            <div className="space-y-3">
              <label
                className={`text-xs font-bold flex items-center gap-2 ${darkMode ? "text-white" : "text-slate-900"}`}
              >
                <Palette className="w-4 h-4 text-indigo-500" /> Primary Accent
                Brand Color
              </label>
              <div className="flex flex-wrap items-center gap-3">
                {colors.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setPrimaryColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform ${
                      primaryColor === c.hex
                        ? "ring-2 ring-white scale-110 shadow-lg"
                        : "hover:scale-105"
                    }`}
                  >
                    {primaryColor === c.hex && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Bot Name & Avatar */}
            <div className="space-y-2">
              <label
                className={`text-xs font-bold block ${darkMode ? "text-white" : "text-slate-900"}`}
              >
                Bot Name / Headline
              </label>
              <input
                type="text"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                className={`w-full border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                  darkMode
                    ? "bg-slate-950 border-slate-800 text-slate-200"
                    : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              />
            </div>

            {/* Welcome Greeting */}
            <div className="space-y-2">
              <label
                className={`text-xs font-bold block ${darkMode ? "text-white" : "text-slate-900"}`}
              >
                Initial Welcome Message
              </label>
              <textarea
                rows={3}
                value={greeting}
                onChange={(e) => setGreeting(e.target.value)}
                className={`w-full border rounded-xl p-3.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                  darkMode
                    ? "bg-slate-950 border-slate-800 text-slate-200"
                    : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              />
            </div>

            {/* Position Toggle */}
            <div className="space-y-2">
              <label
                className={`text-xs font-bold block ${darkMode ? "text-white" : "text-slate-900"}`}
              >
                Launcher Position
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPosition("right")}
                  className={`py-2.5 rounded-xl border text-xs font-semibold ${
                    position === "right"
                      ? "bg-indigo-600/20 border-indigo-500 text-indigo-500"
                      : darkMode
                        ? "bg-slate-950 border-slate-800 text-slate-400"
                        : "bg-slate-50 border-slate-200 text-slate-600"
                  }`}
                >
                  Bottom Right (Default)
                </button>
                <button
                  onClick={() => setPosition("left")}
                  className={`py-2.5 rounded-xl border text-xs font-semibold ${
                    position === "left"
                      ? "bg-indigo-600/20 border-indigo-500 text-indigo-500"
                      : darkMode
                        ? "bg-slate-950 border-slate-800 text-slate-400"
                        : "bg-slate-50 border-slate-200 text-slate-600"
                  }`}
                >
                  Bottom Left
                </button>
              </div>
            </div>

            {/* Embed Snippet Code Preview */}
            <div
              className={`space-y-2 pt-4 border-t ${darkMode ? "border-slate-800" : "border-slate-200"}`}
            >
              <div className="flex items-center justify-between text-xs">
                <span
                  className={`font-bold ${darkMode ? "text-white" : "text-slate-900"}`}
                >
                  Embed Script Tag
                </span>
                <button
                  onClick={copyEmbedCode}
                  className="text-indigo-500 hover:underline flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Code
                </button>
              </div>
              <pre
                className={`p-3 rounded-xl border font-mono text-[10px] overflow-x-auto ${
                  darkMode
                    ? "bg-slate-950 border-slate-800 text-emerald-400"
                    : "bg-slate-900 border-slate-800 text-emerald-400"
                }`}
              >
                {embedScript}
              </pre>
            </div>
          </div>

          {/* Right Column: Interactive Live Sandbox Preview */}
          <div
            className={`lg:col-span-6 rounded-2xl border p-8 flex flex-col justify-end items-end relative min-h-[500px] ${
              darkMode
                ? "bg-slate-900/40 border-slate-800"
                : "bg-slate-100 border-slate-200"
            }`}
          >
            <div
              className={`absolute top-4 left-4 text-xs font-semibold flex items-center gap-2 ${darkMode ? "text-slate-400" : "text-slate-600"}`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sandbox Simulator
            </div>

            {/* Simulated Live Chat Widget Popover */}
            {loading ? (
              <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4">
                <SkeletonBox width="w-full" height="h-10" rounded="rounded-xl" />
                <SkeletonBox width="w-3/4" height="h-16" rounded="rounded-xl" />
                <SkeletonBox width="w-1/2" height="h-10" rounded="rounded-xl" />
              </div>
            ) : (
              <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden text-xs">
              {/* Custom Header */}
              <div
                style={{ backgroundColor: primaryColor }}
                className="p-4 text-white flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{botName}</h4>
                    <span className="text-[10px] opacity-90 block">
                      Online • Typically replies instantly
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Minimize2 className="w-4 h-4 cursor-pointer opacity-80 hover:opacity-100" />
                  <X className="w-4 h-4 cursor-pointer opacity-80 hover:opacity-100" />
                </div>
              </div>

              {/* Chat Body */}
              <div className="p-4 space-y-3 bg-slate-950/80 min-h-[220px]">
                <div className="flex items-start gap-2">
                  <div
                    style={{ backgroundColor: primaryColor }}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0"
                  >
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none p-3 text-slate-200 max-w-[85%] leading-relaxed">
                    {greeting}
                  </div>
                </div>
              </div>

              {/* Input Footer */}
              <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask a question..."
                  readOnly
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400"
                />
                <button
                  style={{ backgroundColor: primaryColor }}
                  className="p-2 rounded-xl text-white"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

            {/* Widget Launcher Floating Button */}
            <div className="mt-4 flex items-center gap-3">
              <button
                style={{ backgroundColor: primaryColor }}
                className="w-14 h-14 rounded-full text-white flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
              >
                <MessageSquare className="w-7 h-7" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WidgetCustomizerPage;
