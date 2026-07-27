import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { Bot, Menu, X, ArrowRight, Sun, Moon } from "lucide-react";

export const Header: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Smooth-scroll to a section id. If not on home page, navigate first then scroll.
  const handleNavClick = (e: React.MouseEvent, path: string) => {
    const hashIndex = path.indexOf("#");
    if (hashIndex === -1) return; // normal link, let router handle it
    e.preventDefault();
    const sectionId = path.slice(hashIndex + 1);
    const scrollToSection = () => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    if (location.pathname === "/") {
      scrollToSection();
    } else {
      navigate("/");
      // Wait for the home page to render, then scroll
      setTimeout(scrollToSection, 300);
    }
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: "Features", path: "/#features" },
    { name: "Pricing", path: "/#pricing" },
    { name: "Reviews", path: "/#reviews" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-200 border-b ${
        darkMode
          ? "bg-slate-900/80 border-slate-800 text-white"
          : "bg-white/90 border-slate-200 text-slate-900"
      } backdrop-blur-md`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span
                className={`text-xl font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}
              >
                ChatDesk<span className="text-indigo-500">.AI</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                AI Support Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className={`hidden md:flex items-center gap-1 p-1.5 rounded-full border ${
              darkMode
                ? "bg-slate-800/40 border-slate-700/50"
                : "bg-slate-100 border-slate-200"
            }`}
          >
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={(e) => handleNavClick(e, link.path)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  darkMode
                    ? "text-slate-300 hover:text-white hover:bg-slate-800"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                }`}
              >
                {link.name}
              </button>
            ))}
          </nav>

          {/* Right Action CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Day and Night Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2.5 rounded-xl border transition-colors ${
                darkMode
                  ? "bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700"
                  : "bg-slate-100 border-slate-200 text-indigo-600 hover:bg-slate-200"
              }`}
              title="Toggle Day & Night Mode"
            >
              {darkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            <Link
              to="/login"
              className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                darkMode
                  ? "text-slate-300 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sign In
            </Link>

            <Link
              to="/onboarding"
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-xl group bg-gradient-to-br from-indigo-500 via-indigo-600 to-emerald-400 group-hover:from-indigo-500 group-hover:to-emerald-400 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 active:scale-95"
            >
              <span
                className={`relative px-5 py-2 transition-all ease-in duration-75 rounded-[10px] ${
                  darkMode ? "bg-slate-900/10" : "bg-white/10"
                } flex items-center gap-2 font-semibold`}
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className={`p-2.5 rounded-xl border transition-colors ${
                darkMode
                  ? "bg-slate-800 border-slate-700 text-amber-400"
                  : "bg-slate-100 border-slate-200 text-indigo-600"
              }`}
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2.5 rounded-xl border ${
                darkMode
                  ? "bg-slate-800 border-slate-700 text-slate-300"
                  : "bg-slate-100 border-slate-200 text-slate-700"
              }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden border-b px-4 pt-2 pb-6 space-y-3 ${
            darkMode
              ? "bg-slate-900 border-slate-800 text-slate-100"
              : "bg-white border-slate-200 text-slate-900"
          }`}
        >
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={(e) => handleNavClick(e, link.path)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-base font-medium ${
                  darkMode
                    ? "text-slate-300 hover:text-white hover:bg-slate-800"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-inherit flex flex-col gap-2">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className={`w-full text-center py-2.5 font-medium rounded-xl ${
                darkMode
                  ? "bg-slate-800 text-slate-300"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              Sign In
            </Link>
            <Link
              to="/onboarding"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-white font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-500 shadow-md"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
