import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";
import { authApi } from "../../api/authApi";
import {
  LayoutDashboard,
  BarChart3,
  MessageSquare,
  BookOpen,
  Sliders,
  CreditCard,
  Settings,
  UploadCloud,
  Bot,
  Sun,
  Moon,
  Search,
  Bell,
  Menu,
  X,
  PlayCircle,
  LogOut,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await authApi.logout();
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch {
      toast.error("Logged out.");
      navigate("/login");
    }
  };

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Chat Logs", href: "/chat-logs", icon: MessageSquare },
    { name: "Knowledge Base", href: "/knowledge-base", icon: BookOpen },
    { name: "Widget Customizer", href: "/widget-customization", icon: Sliders },
    { name: "Billing & Usage", href: "/billing", icon: CreditCard },
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Onboarding Docs", href: "/onboarding", icon: UploadCloud },
    { name: "Interactive Prototype", href: "/prototype", icon: PlayCircle },
  ];

  return (
    /* One root div — h-screen + overflow-hidden pins layout to the viewport */
    <div
      className={`h-screen overflow-hidden flex transition-colors duration-200 ${
        darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* ── LEFT div: Sidebar — h-full so it never scrolls with content ── */}
      <aside
        className={`hidden lg:flex flex-col w-64 h-full shrink-0 border-r ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        }`}
      >
        {/* Sidebar brand header */}
        <div className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-inherit">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center text-white shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              ChatDesk<span className="text-indigo-500">.AI</span>
            </span>
          </Link>
        </div>

        {/* Sidebar nav — only this scrolls if items overflow */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
          <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Main Management
          </div>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : darkMode
                    ? "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Sidebar footer */}
        <div
          className={`p-4 shrink-0 border-t border-inherit flex items-center justify-between ${
            darkMode ? "bg-slate-900/50" : "bg-slate-50"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
              CD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">Workspace</p>
              <p className="text-[10px] text-slate-400 truncate">Support Agent</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className={`p-2 rounded-xl border transition-colors ${
              darkMode
                ? "bg-slate-800 hover:bg-rose-900/40 border-slate-700 text-rose-400 hover:border-rose-800"
                : "bg-white hover:bg-rose-50 border-slate-200 text-rose-600 shadow-sm"
            }`}
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ── RIGHT div: Header + page content — only <main> scrolls ── */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">

        {/* Top Navbar — fixed inside the right column, never scrolls away */}
        <header
          className={`h-16 shrink-0 border-b backdrop-blur-md z-40 px-4 sm:px-6 flex items-center justify-between ${
            darkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"
          }`}
        >
          {/* Mobile menu trigger */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`lg:hidden p-2 rounded-lg ${
              darkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-700"
            }`}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search bar */}
          <div className="hidden sm:flex items-center relative w-72">
            <Search className="w-4 h-4 absolute left-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search tickets, docs, analytics..."
              className={`w-full text-xs rounded-xl pl-9 pr-4 py-2 border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                darkMode
                  ? "bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-500"
                  : "bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400"
              }`}
            />
          </div>

          {/* Right header actions */}
          <div className="flex items-center gap-3">
            {/* Dark / Light toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-xl border transition-all flex items-center gap-2 text-xs font-semibold ${
                darkMode
                  ? "bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700"
                  : "bg-slate-100 border-slate-200 text-indigo-600 hover:bg-slate-200"
              }`}
              title="Toggle Day & Night Mode"
            >
              {darkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden md:inline text-slate-300">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <span className="hidden md:inline text-slate-700">Dark Mode</span>
                </>
              )}
            </button>

            {/* Notifications */}
            <button
              className={`p-2 rounded-xl border relative ${
                darkMode
                  ? "bg-slate-800 border-slate-700 text-slate-300"
                  : "bg-slate-100 border-slate-200 text-slate-600"
              }`}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400"></span>
            </button>

            {/* Live Bot Widget shortcut */}
            <Link
              to="/widget-customization"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Live Bot Widget</span>
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-semibold ${
                darkMode
                  ? "bg-slate-800 border-slate-700 text-rose-400 hover:bg-rose-900/40 hover:border-rose-800"
                  : "bg-slate-100 border-slate-200 text-rose-600 hover:bg-rose-50 hover:border-rose-200"
              }`}
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Log Out</span>
            </button>
          </div>
        </header>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-slate-950/80"
              onClick={() => setSidebarOpen(false)}
            />
            <div
              className={`relative flex flex-col w-64 max-w-xs h-full z-10 p-4 ${
                darkMode ? "bg-slate-900" : "bg-white"
              }`}
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <span className="font-bold text-lg">ChatDesk.AI</span>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-indigo-600 hover:text-white"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Page content: the ONLY element that scrolls ── */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
