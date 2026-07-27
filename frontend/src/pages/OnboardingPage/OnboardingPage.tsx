/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";
import { knowledgeApi, type DocumentItem } from "../../api/knowledgeApi";
import { settingsApi } from "../../api/settingsApi";
import {
  UploadCloud,
  CheckCircle2,
  ArrowRight,
  Bot,
  Sun,
  Moon,
  FileText,
  Globe,
  Plus,
  Trash2,
  Loader2,
  Sparkles,
} from "lucide-react";

export const OnboardingPage: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();

  // Stepper State
  const [step, setStep] = useState(1);

  // Step 1 State: Workspace Setup
  const [workspaceName, setWorkspaceName] = useState("Acme Support Desk");
  const [savingStep1, setSavingStep1] = useState(false);

  // Step 2 State: Onboarding Knowledge Sync
  const [docTab, setDocTab] = useState<"text" | "url" | "file">("text");
  const [docTitle, setDocTitle] = useState("");
  const [docContent, setDocContent] = useState("");
  const [url, setUrl] = useState("https://docs.acme.com/faq");
  const [fileInputName, setFileInputName] = useState("");
  const [indexing, setIndexing] = useState(false);
  const [indexedDocs, setIndexedDocs] = useState<DocumentItem[]>([]);

  // Step 3 State: Bot Persona & Tone
  const [persona, setPersona] = useState<"Professional" | "Friendly" | "Concise" | "Technical">("Professional");
  const [savingStep3, setSavingStep3] = useState(false);

  // Step 4 State: Final Stats
  const [totalStats, setTotalStats] = useState({
    docsCount: 0,
    charCount: 0,
    vectorCount: 0,
  });

  // Initial load of existing docs if returning to onboarding
  useEffect(() => {
    let isMounted = true;
    const fetchExistingDocs = async () => {
      try {
        const res = await knowledgeApi.getDocuments();
        if (isMounted && res?.data) {
          setIndexedDocs(res.data);
        }
      } catch (err: any) {
        console.warn("Could not fetch existing docs during onboarding", err);
      }
    };
    fetchExistingDocs();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch final stats when step 4 opens
  useEffect(() => {
    if (step === 4) {
      let isMounted = true;
      const calculateStats = async () => {
        try {
          const res = await knowledgeApi.getDocuments();
          if (isMounted && res?.data) {
            const docs = res.data;
            const totalChars = docs.reduce((sum, d) => sum + (d.charCount || 0), 0);
            setTotalStats({
              docsCount: docs.length,
              charCount: totalChars,
              vectorCount: Math.ceil(totalChars / 40) || 120,
            });
          }
        } catch (err: any) {
          console.warn("Failed to load final stats", err);
        }
      };
      calculateStats();
      return () => {
        isMounted = false;
      };
    }
  }, [step]);

  // Step 1 Handler: Save Workspace Name
  const handleStep1Continue = async () => {
    if (!workspaceName.trim()) {
      toast.warning("Please enter a workspace name.");
      return;
    }
    try {
      setSavingStep1(true);
      await settingsApi.updateSettings({ workspaceName: workspaceName.trim() });
      toast.success("Workspace setup saved!");
      setStep(2);
    } catch (err: any) {
      toast.error(err.message || "Failed to save workspace setup.");
    } finally {
      setSavingStep1(false);
    }
  };

  // Step 2 Handler: Add Text Document
  const handleAddTextDoc = async () => {
    if (!docTitle.trim() || !docContent.trim()) {
      toast.warning("Please enter both a document title and content.");
      return;
    }
    try {
      setIndexing(true);
      const res = await knowledgeApi.createTextDoc({
        title: docTitle.trim(),
        content: docContent.trim(),
        sourceType: "text",
      });
      if (res?.data) {
        toast.success(`Document "${docTitle}" indexed successfully!`);
        setIndexedDocs((prev) => [res.data, ...prev]);
        setDocTitle("");
        setDocContent("");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to index document.");
    } finally {
      setIndexing(false);
    }
  };

  // Step 2 Handler: Crawl URL
  const handleCrawlUrl = async () => {
    if (!url.trim()) {
      toast.warning("Please enter a documentation URL to crawl.");
      return;
    }
    try {
      setIndexing(true);
      const res = await knowledgeApi.crawlUrl(url.trim());
      if (res?.data) {
        toast.success(`Scraped and indexed content from ${url}!`);
        setIndexedDocs((prev) => [res.data, ...prev]);
        setUrl("");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to crawl URL.");
    } finally {
      setIndexing(false);
    }
  };

  // Step 2 Handler: Process Local File
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileInputName(file.name);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      if (!text || text.length < 5) {
        toast.warning("File is empty or contains insufficient text.");
        return;
      }
      try {
        setIndexing(true);
        const res = await knowledgeApi.createTextDoc({
          title: file.name,
          content: text,
          sourceType: "file",
        });
        if (res?.data) {
          toast.success(`File "${file.name}" indexed successfully!`);
          setIndexedDocs((prev) => [res.data, ...prev]);
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to index uploaded file.");
      } finally {
        setIndexing(false);
      }
    };
    reader.readAsText(file);
  };

  // Step 2 Delete Document
  const handleDeleteDoc = async (id: string) => {
    try {
      await knowledgeApi.deleteDocument(id);
      setIndexedDocs((prev) => prev.filter((d) => d._id !== id));
      toast.success("Document removed.");
    } catch (err: any) {
      toast.error(err.message || "Failed to remove document.");
    }
  };

  // Step 3 Handler: Save Persona
  const handleStep3Continue = async () => {
    let systemPrompt = "You are a professional and helpful customer support AI assistant.";
    let temperature = 0.3;

    if (persona === "Friendly") {
      systemPrompt = "You are a friendly, warm, and approachable AI support agent. Be empathetic and clear.";
      temperature = 0.5;
    } else if (persona === "Concise") {
      systemPrompt = "You are a concise, direct, and efficient AI support assistant. Provide brief and accurate answers.";
      temperature = 0.2;
    } else if (persona === "Technical") {
      systemPrompt = "You are an expert technical support engineer. Provide detailed, step-by-step diagnostic guidance.";
      temperature = 0.3;
    }

    try {
      setSavingStep3(true);
      await settingsApi.updateSettings({
        systemPrompt,
        temperature,
      });
      toast.success("Bot persona configured successfully!");
      setStep(4);
    } catch (err: any) {
      toast.error(err.message || "Failed to save bot persona.");
    } finally {
      setSavingStep3(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between p-4 sm:p-8 transition-colors duration-200 ${
        darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Top Wizard Navigation */}
      <div className="max-w-4xl mx-auto w-full pt-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-400 flex items-center justify-center text-white font-bold shadow-lg">
              <Bot className="w-6 h-6" />
            </div>
            <span className={`text-xl font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
              ChatDesk.AI
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-xl border transition-colors ${
                darkMode ? "bg-slate-900 border-slate-800 text-amber-400" : "bg-white border-slate-200 text-indigo-600 shadow-sm"
              }`}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <span className={`text-xs font-semibold ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Step {step} of 4
            </span>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="grid grid-cols-4 gap-2 mb-10">
          {[
            { num: 1, label: "Workspace Setup" },
            { num: 2, label: "Knowledge Sync" },
            { num: 3, label: "Bot Personality" },
            { num: 4, label: "Live Deployment" },
          ].map((s) => (
            <div key={s.num} className="space-y-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  step >= s.num
                    ? "bg-gradient-to-r from-indigo-500 to-emerald-400"
                    : darkMode
                    ? "bg-slate-800"
                    : "bg-slate-200"
                }`}
              ></div>
              <span
                className={`text-[11px] font-semibold block text-center ${
                  step === s.num
                    ? darkMode
                      ? "text-white"
                      : "text-slate-900"
                    : darkMode
                    ? "text-slate-500"
                    : "text-slate-400"
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Container Card */}
      <div
        className={`max-w-xl mx-auto w-full border rounded-3xl p-8 shadow-2xl space-y-6 transition-colors ${
          darkMode ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200"
        }`}
      >
        {/* Step 1: Workspace Name */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className={`text-2xl font-extrabold ${darkMode ? "text-white" : "text-slate-900"}`}>
                Create Your Support Workspace
              </h2>
              <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                Give your AI desk workspace a name to get started.
              </p>
            </div>

            <div className="space-y-2">
              <label className={`text-xs font-semibold block ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                Workspace Name
              </label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="e.g. Acme Corp Support"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  darkMode ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              />
            </div>

            <button
              onClick={handleStep1Continue}
              disabled={savingStep1}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 hover:opacity-95 disabled:opacity-50"
            >
              {savingStep1 ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Workspace...</span>
                </>
              ) : (
                <>
                  <span>Continue to Document Upload</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Step 2: Document Upload & Scraper */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className={`text-2xl font-extrabold ${darkMode ? "text-white" : "text-slate-900"}`}>
                Upload Onboarding Documents
              </h2>
              <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                Index support manuals, FAQs, or web docs directly into your vector database.
              </p>
            </div>

            {/* Document Source Tabs */}
            <div className="flex border-b border-slate-700/40 gap-2">
              <button
                onClick={() => setDocTab("text")}
                className={`pb-2 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
                  docTab === "text"
                    ? "border-indigo-500 text-indigo-500"
                    : darkMode
                    ? "border-transparent text-slate-400 hover:text-slate-200"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Text Manual
              </button>
              <button
                onClick={() => setDocTab("url")}
                className={`pb-2 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
                  docTab === "url"
                    ? "border-indigo-500 text-indigo-500"
                    : darkMode
                    ? "border-transparent text-slate-400 hover:text-slate-200"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                Web Scraper
              </button>
              <button
                onClick={() => setDocTab("file")}
                className={`pb-2 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
                  docTab === "file"
                    ? "border-indigo-500 text-indigo-500"
                    : darkMode
                    ? "border-transparent text-slate-400 hover:text-slate-200"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                File Upload
              </button>
            </div>

            {/* Tab 1: Text Manual Entry */}
            {docTab === "text" && (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Document Title (e.g. Return & Refund Policy)"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    darkMode ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-300 text-slate-900"
                  }`}
                />
                <textarea
                  rows={4}
                  placeholder="Paste support manual, troubleshooting guidelines, or product instructions..."
                  value={docContent}
                  onChange={(e) => setDocContent(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    darkMode ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-300 text-slate-900"
                  }`}
                />
                <button
                  onClick={handleAddTextDoc}
                  disabled={indexing}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow"
                >
                  {indexing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Indexing Document...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Index Document</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Tab 2: URL Scraper */}
            {docTab === "url" && (
              <div className="space-y-3">
                <label className={`text-xs font-semibold block ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                  Documentation Website URL
                </label>
                <input
                  type="url"
                  placeholder="https://docs.yourcompany.com/faq"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    darkMode ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-300 text-slate-900"
                  }`}
                />
                <button
                  onClick={handleCrawlUrl}
                  disabled={indexing}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow"
                >
                  {indexing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Crawling Web Page...</span>
                    </>
                  ) : (
                    <>
                      <Globe className="w-3.5 h-3.5" />
                      <span>Crawl & Index Page</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Tab 3: File Upload */}
            {docTab === "file" && (
              <div className="space-y-3">
                <div
                  className={`border-2 border-dashed rounded-2xl p-6 text-center space-y-3 hover:border-indigo-500 relative ${
                    darkMode ? "bg-slate-950/60 border-slate-700" : "bg-slate-50 border-slate-300"
                  }`}
                >
                  <UploadCloud className="w-8 h-8 text-indigo-500 mx-auto" />
                  <div>
                    <p className={`text-xs font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                      {fileInputName ? fileInputName : "Click to choose TXT or MD document file"}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">Supports plain text, markdown, and documentation exports</p>
                  </div>
                  <input
                    type="file"
                    accept=".txt,.md,.json,.csv"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* List of Indexed Onboarding Docs */}
            {indexedDocs.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className={`text-xs font-bold block ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                  Indexed Onboarding Docs ({indexedDocs.length})
                </span>
                <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
                  {indexedDocs.map((doc) => (
                    <div
                      key={doc._id}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${
                        darkMode ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        {doc.sourceType === "url" ? (
                          <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                        )}
                        <span className="font-semibold truncate">{doc.title}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                          Indexed
                        </span>
                        <button
                          onClick={() => handleDeleteDoc(doc._id)}
                          className="p-1 text-rose-400 hover:bg-rose-500/10 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className={`flex-1 py-3.5 rounded-xl font-semibold text-sm ${
                  darkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-700"
                }`}
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
              >
                <span>Continue to Bot Persona</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Bot Persona */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className={`text-2xl font-extrabold ${darkMode ? "text-white" : "text-slate-900"}`}>
                Bot Persona & Tone
              </h2>
              <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                Set how your AI agent talks to your customers.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "Professional", desc: "Polite, helpful, and formal tone." },
                { name: "Friendly", desc: "Warm, empathetic, and engaging tone." },
                { name: "Concise", desc: "Direct, short, and to-the-point answers." },
                { name: "Technical", desc: "Detailed step-by-step diagnostic guidance." },
              ].map((t) => (
                <button
                  key={t.name}
                  onClick={() => setPersona(t.name as any)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    persona === t.name
                      ? "bg-indigo-600/20 border-indigo-500 ring-2 ring-indigo-500/30"
                      : darkMode
                      ? "bg-slate-950 border-slate-800 hover:border-slate-700"
                      : "bg-slate-50 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-indigo-400">{t.name}</span>
                    {persona === t.name && <Sparkles className="w-3.5 h-3.5 text-indigo-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400">{t.desc}</p>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className={`flex-1 py-3.5 rounded-xl font-semibold text-sm ${
                  darkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-700"
                }`}
              >
                Back
              </button>
              <button
                onClick={handleStep3Continue}
                disabled={savingStep3}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
              >
                {savingStep3 ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Configuring Persona...</span>
                  </>
                ) : (
                  <>
                    <span>Finalize Setup</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Finish */}
        {step === 4 && (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto ring-4 ring-emerald-500/10">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className={`text-2xl font-extrabold ${darkMode ? "text-white" : "text-slate-900"}`}>
                Your AI Support Agent is Live!
              </h2>
              <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                Workspace &quot;{workspaceName}&quot; is fully configured and operational.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/40 border border-slate-800 text-center">
              <div>
                <span className="text-xl font-black text-indigo-400 block">{totalStats.docsCount}</span>
                <span className="text-[10px] text-slate-400 font-medium">Docs Indexed</span>
              </div>
              <div>
                <span className="text-xl font-black text-emerald-400 block">{totalStats.vectorCount}</span>
                <span className="text-[10px] text-slate-400 font-medium">Vector Chunks</span>
              </div>
              <div>
                <span className="text-xl font-black text-amber-400 block">{totalStats.charCount}</span>
                <span className="text-[10px] text-slate-400 font-medium">Total Chars</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:opacity-95"
            >
              Go To Main Dashboard
            </button>
          </div>
        )}
      </div>

      <div className={`text-center text-xs pb-4 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
        Need help? Check out our{" "}
        <a href="#" className="text-indigo-500 underline">
          Documentation
        </a>
      </div>
    </div>
  );
};

export default OnboardingPage;
