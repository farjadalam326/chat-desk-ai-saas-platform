/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";
import { authApi } from "../../api/authApi";
import {
  Bot,
  Lock,
  Mail,
  User,
  Building2,
  ArrowRight,
  CheckCircle2,
  Sun,
  Moon,
} from "lucide-react";

export const SignUpPage: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const toast = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleResponse = async (response: any) => {
    if (!response?.credential) return;
    try {
      setLoading(true);
      await authApi.googleAuth(response.credential);
      toast.success("Signed up & authenticated with Google successfully!");
      navigate("/onboarding");
    } catch (err: any) {
      toast.error(err.message || "Google Sign-Up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '719064177864-19ct5oi8eoh5riombodk6k7nhqpihngq.apps.googleusercontent.com';
    if (!googleClientId) return;

    const initGoogle = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleResponse,
        });

        const btnContainer = document.getElementById("google-signup-btn");
        if (btnContainer) {
          btnContainer.innerHTML = "";
          window.google.accounts.id.renderButton(btnContainer, {
            theme: darkMode ? "filled_black" : "outline",
            size: "large",
            width: "100%",
            shape: "pill",
            text: "signup_with",
          });
        }
      }
    };

    if (window.google?.accounts?.id) {
      initGoogle();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.body.appendChild(script);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [darkMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await authApi.signup({
        name,
        email,
        password,
        companyName,
        workspaceName: companyName,
      });
      toast.success("Account & Workspace created successfully!");
      navigate("/onboarding");
    } catch (err: any) {
      toast.error(
        err.message || "Failed to create account. Please check inputs.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-200 ${
        darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Absolute top right theme toggle */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleDarkMode}
          className={`p-2.5 rounded-xl border transition-colors ${
            darkMode
              ? "bg-slate-900 border-slate-800 text-amber-400"
              : "bg-white border-slate-200 text-indigo-600 shadow-sm"
          }`}
        >
          {darkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
      </div>

      <div
        className={`max-w-4xl w-full rounded-3xl border shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 ${
          darkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-slate-200"
        }`}
      >
        {/* Left Side: Graphic */}
        <div
          className={`p-8 sm:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r relative overflow-hidden ${
            darkMode
              ? "bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 border-slate-800"
              : "bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 border-slate-200 text-white"
          }`}
        >
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-indigo-600 flex items-center justify-center font-bold shadow-lg">
                <Bot className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                ChatDesk.AI
              </span>
            </Link>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Start 14-Day Free Trial
            </h2>
            <p className="text-xs text-indigo-100 dark:text-slate-300 leading-relaxed">
              No credit card required. Train your first AI support bot in 60
              seconds.
            </p>
          </div>

          <div className="space-y-2 pt-6 text-xs text-indigo-100 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Includes 1,000 free AI messages</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full RAG document indexing</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center space-y-5">
          <div>
            <h3
              className={`text-2xl font-bold mb-1 ${darkMode ? "text-white" : "text-slate-900"}`}
            >
              Create Free Account
            </h3>
            <p
              className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}
            >
              Get instant access to ChatDesk AI
            </p>
          </div>

          <div
            id="google-signup-btn"
            className="w-full flex justify-center min-h-[44px]"
          ></div>

          <div className="flex items-center gap-3">
            <div
              className={`h-px flex-1 ${darkMode ? "bg-slate-800" : "bg-slate-200"}`}
            ></div>
            <span className="text-[10px] text-slate-500 uppercase font-semibold">
              Or Sign Up With Email
            </span>
            <div
              className={`h-px flex-1 ${darkMode ? "bg-slate-800" : "bg-slate-200"}`}
            ></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label
                className={`text-xs font-semibold block ${darkMode ? "text-slate-300" : "text-slate-700"}`}
              >
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full border rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                    darkMode
                      ? "bg-slate-950 border-slate-800 text-slate-200"
                      : "bg-slate-50 border-slate-300 text-slate-900"
                  }`}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                className={`text-xs font-semibold block ${darkMode ? "text-slate-300" : "text-slate-700"}`}
              >
                Company / Workspace Name
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className={`w-full border rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                    darkMode
                      ? "bg-slate-950 border-slate-800 text-slate-200"
                      : "bg-slate-50 border-slate-300 text-slate-900"
                  }`}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                className={`text-xs font-semibold block ${darkMode ? "text-slate-300" : "text-slate-700"}`}
              >
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full border rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                    darkMode
                      ? "bg-slate-950 border-slate-800 text-slate-200"
                      : "bg-slate-50 border-slate-300 text-slate-900"
                  }`}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                className={`text-xs font-semibold block ${darkMode ? "text-slate-300" : "text-slate-700"}`}
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full border rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                    darkMode
                      ? "bg-slate-950 border-slate-800 text-slate-200"
                      : "bg-slate-50 border-slate-300 text-slate-900"
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              <span>
                {loading ? "Creating Account..." : "Create Workspace"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p
            className={`text-xs text-center ${darkMode ? "text-slate-400" : "text-slate-600"}`}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-500 font-bold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
