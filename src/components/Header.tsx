import { useState, useEffect, useRef } from "react";
import type { AppView } from "../lib/types";
import logoLight from "../assets/logo-light.svg";
import logoDark from "../assets/logo-dark.svg";

interface HeaderProps {
  view: AppView;
  onLogoClick: () => void;
}

const NAV_SECTIONS = [
  { id: "results-overview", label: "Overview" },
  { id: "results-usage", label: "Usage" },
  { id: "results-skills", label: "Skills" },
  { id: "results-build", label: "Build" },
  { id: "results-install", label: "Install" },
];

export default function Header({ view, onLogoClick }: HeaderProps) {
  const isDark = view === "results";
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Close menu on view change
  useEffect(() => {
    setMenuOpen(false);
  }, [view]);

  useEffect(() => {
    if (view !== "results") {
      setActiveSection("");
      return;
    }

    const handleScroll = () => {
      const offsets = NAV_SECTIONS.map(({ id }) => {
        const el = document.getElementById(id);
        if (!el) return { id, top: Infinity };
        return { id, top: el.getBoundingClientRect().top };
      });

      // Find the section closest to the top (within 200px of viewport top)
      let current = "";
      for (const { id, top } of offsets) {
        if (top <= 200) current = id;
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [view]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const hamburgerColor = isDark ? "#fff" : "#1a3a2a";

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: isDark ? "#1a3a2a" : "#fff",
        borderBottom: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e0e0e0",
      }}
    >
      {/* ── Main bar ── */}
      <div
        style={{
          padding: "0 24px",
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={onLogoClick}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            padding: 0,
            flexShrink: 0,
          }}
        >
          <img
            src={isDark ? logoDark : logoLight}
            alt="claude.pdt — personal data transformer"
            className="header-logo"
          />
        </button>

        {/* ── Desktop nav (landing) ── */}
        {view === "landing" && (
          <nav className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <a
              href="#how-it-works"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                color: "#555",
                textDecoration: "none",
                transition: "color 0.2s",
                padding: "8px 12px",
              }}
            >
              How it works
            </a>
            <a
              href="#privacy"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                color: "#555",
                textDecoration: "none",
                transition: "color 0.2s",
                padding: "8px 12px",
              }}
            >
              Privacy
            </a>
            <a
              href="#upload"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "10px 20px",
                background: "#1a3a2a",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                textDecoration: "none",
                transition: "background 0.2s",
                cursor: "pointer",
                marginLeft: "8px",
              }}
            >
              Get started
            </a>
          </nav>
        )}

        {/* ── Results nav (horizontal scroll on mobile) ── */}
        {view === "results" && (
          <nav
            className="nav-results-scroll"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
              flexShrink: 1,
              minWidth: 0,
            }}
          >
            {NAV_SECTIONS.map(({ id, label }) => {
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "13px",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "#fff" : "rgba(255,255,255,0.5)",
                    padding: "8px 14px",
                    borderRadius: "6px",
                    position: "relative",
                    transition: "color 0.2s ease",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {label}
                  <span
                    style={{
                      position: "absolute",
                      bottom: "2px",
                      left: "14px",
                      right: "14px",
                      height: "2px",
                      borderRadius: "1px",
                      background: "#52b788",
                      opacity: isActive ? 1 : 0,
                      transition: "opacity 0.2s ease",
                    }}
                  />
                </button>
              );
            })}
          </nav>
        )}

        {/* ── Hamburger button (landing mobile only) ── */}
        {view === "landing" && (
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{
              display: "none", // shown via CSS on mobile
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              flexShrink: 0,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              {menuOpen ? (
                <path d="M6 6L18 18M6 18L18 6" stroke={hamburgerColor} strokeWidth="2" strokeLinecap="round" />
              ) : (
                <>
                  <path d="M4 7h16" stroke={hamburgerColor} strokeWidth="2" strokeLinecap="round" />
                  <path d="M4 12h16" stroke={hamburgerColor} strokeWidth="2" strokeLinecap="round" />
                  <path d="M4 17h16" stroke={hamburgerColor} strokeWidth="2" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        )}
      </div>

      {/* ── Mobile dropdown (landing) ── */}
      {view === "landing" && menuOpen && (
        <div
          ref={menuRef}
          className="nav-mobile-dropdown"
          style={{
            padding: "8px 24px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e0e0e0"}`,
            background: isDark ? "#1a3a2a" : "#fff",
          }}
        >
          <a
            href="#how-it-works"
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "15px",
              fontWeight: 500,
              color: isDark ? "rgba(255,255,255,0.8)" : "#555",
              textDecoration: "none",
              padding: "10px 0",
            }}
          >
            How it works
          </a>
          <a
            href="#privacy"
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "15px",
              fontWeight: 500,
              color: isDark ? "rgba(255,255,255,0.8)" : "#555",
              textDecoration: "none",
              padding: "10px 0",
            }}
          >
            Privacy
          </a>
          <a
            href="#upload"
            onClick={() => setMenuOpen(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px 20px",
              marginTop: "4px",
              background: isDark ? "#fff" : "#1a3a2a",
              color: isDark ? "#1a3a2a" : "#fff",
              border: "none",
              borderRadius: "8px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "15px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Get started
          </a>
        </div>
      )}
    </header>
  );
}
