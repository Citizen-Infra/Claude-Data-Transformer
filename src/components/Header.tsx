import { useState, useEffect, useRef } from "react";
import type { AppView } from "../lib/types";
import logoLight from "../assets/logo-light.svg";

interface HeaderProps {
  view: AppView;
  hasResults: boolean;
  onLogoClick: () => void;
  onNavigate?: (view: AppView) => void;
}

/* ── Section scroll nav arrays per view ── */
const LANDING_NAV = [
  { id: "how-it-works", label: "How it works" },
  { id: "upload", label: "Upload your data" },
  { id: "how-we-keep-it-private", label: "Protecting your Privacy" },
  { id: "about-the-builders", label: "About the builders" },
];

const RESULTS_NAV = [
  { id: "results-overview", label: "Overview" },
  { id: "results-usage", label: "Usage" },
  { id: "results-skills", label: "Skills" },
  { id: "results-build", label: "Build" },
  { id: "results-install", label: "Install" },
];

const COMMONS_NAV = [
  { id: "commons-how", label: "How it works" },
  { id: "browse", label: "Browse" },
  { id: "contribute", label: "Contribute" },
];

/* ── Color tokens ── */
const COLORS = {
  green: "#2D4A3E",
  greenDeep: "#1a2f26",
  greenMid: "#3a5a4a",
  cream: "#FDF6EC",
  creamDeep: "#F5EBDA",
  creamBorder: "#E8DCCA",
  text: "#2D4A3E",
  textMuted: "#7A7A6C",
  white: "#FFFFFF",
  sage: "#8BA898",
  sageLight: "#c8d8cf",
};

export default function Header({ view, hasResults, onLogoClick, onNavigate }: HeaderProps) {
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

  // Scroll-based section highlighting
  useEffect(() => {
    const sections =
      view === "results"
        ? RESULTS_NAV
        : view === "commons"
        ? COMMONS_NAV
        : view === "landing"
        ? LANDING_NAV
        : [];
    if (sections.length === 0) {
      setActiveSection("");
      return;
    }

    const handleScroll = () => {
      const offsets = sections.map(({ id }) => {
        const el = document.getElementById(id);
        if (!el) return { id, top: Infinity };
        return { id, top: el.getBoundingClientRect().top };
      });

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
      const y = el.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  /* ── Section scroll items for current view ── */
  const currentSections =
    view === "results"
      ? RESULTS_NAV
      : view === "commons"
      ? COMMONS_NAV
      : view === "landing"
      ? LANDING_NAV
      : [];

  const showSubNav = currentSections.length > 0;

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* ══════════════════════════════════════════════
          PRIMARY NAV — white bar, logo + page tabs
          ══════════════════════════════════════════════ */}
      <div
        className="primary-nav"
        style={{
          background: COLORS.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          height: "56px",
          borderBottom: `1px solid ${COLORS.creamBorder}`,
        }}
      >
        {/* Logo */}
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
            src={logoLight}
            alt="claude.pdt — personal data transformer"
            className="header-logo"
          />
        </button>

        {/* ── Desktop page-level tabs ── */}
        <nav
          className="nav-desktop"
          style={{
            display: "flex",
            alignItems: "stretch",
            gap: 0,
            height: "56px",
          }}
        >
          {/* About — shown when not on landing (navigates back to landing) */}
          {view !== "landing" && (
            <button
              onClick={() => onNavigate?.("landing")}
              style={{
                background: "none",
                border: "none",
                borderLeft: "1px solid transparent",
                borderRight: "1px solid transparent",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                fontWeight: 500,
                color: COLORS.text,
                textDecoration: "none",
                padding: "0 20px",
                display: "flex",
                alignItems: "center",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = COLORS.cream;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none";
              }}
            >
              About
            </button>
          )}

          {/* Skills Commons */}
          <button
            onClick={() => onNavigate?.("commons")}
            style={{
              background: view === "commons" ? COLORS.sageLight : "none",
              border: "none",
              borderLeft: view === "commons" ? `1px solid ${COLORS.creamBorder}` : "1px solid transparent",
              borderRight: view === "commons" ? `1px solid ${COLORS.creamBorder}` : "1px solid transparent",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              fontWeight: 500,
              color: view === "commons" ? COLORS.greenDeep : COLORS.text,
              textDecoration: "none",
              padding: "0 20px",
              display: "flex",
              alignItems: "center",
              transition: "all 0.15s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              if (view !== "commons") e.currentTarget.style.background = COLORS.cream;
            }}
            onMouseLeave={(e) => {
              if (view !== "commons") e.currentTarget.style.background = "none";
            }}
          >
            Skills Commons
          </button>

          {/* Your Skill Suggestions — shown after data upload */}
          {hasResults && (
            <button
              onClick={() => onNavigate?.("results")}
              style={{
                background: view === "results" ? COLORS.sageLight : "none",
                border: "none",
                borderLeft: view === "results" ? `1px solid ${COLORS.creamBorder}` : "1px solid transparent",
                borderRight: view === "results" ? `1px solid ${COLORS.creamBorder}` : "1px solid transparent",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                fontWeight: 500,
                color: view === "results" ? COLORS.greenDeep : COLORS.text,
                textDecoration: "none",
                padding: "0 20px",
                display: "flex",
                alignItems: "center",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                if (view !== "results") e.currentTarget.style.background = COLORS.cream;
              }}
              onMouseLeave={(e) => {
                if (view !== "results") e.currentTarget.style.background = "none";
              }}
            >
              Your Skill Suggestions
            </button>
          )}
        </nav>

        {/* ── Hamburger (mobile) ── */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            flexShrink: 0,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.text} strokeWidth="2">
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* ══════════════════════════════════════════════
          MOBILE DROPDOWN
          ══════════════════════════════════════════════ */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="nav-mobile-dropdown"
          style={{
            background: COLORS.greenDeep,
            padding: "8px 0",
          }}
        >
          {/* Home / About — links back to landing */}
          <button
            onClick={() => { setMenuOpen(false); onNavigate?.("landing"); }}
            style={{
              display: "block",
              width: "100%",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              color: view === "landing" ? COLORS.cream : `rgba(253,246,236,0.6)`,
              background: "none",
              border: "none",
              textAlign: "left",
              padding: "12px 20px",
              cursor: "pointer",
            }}
          >
            Home
          </button>

          {/* Section scroll sub-items (nested under Home) */}
          {currentSections.length > 0 && (
            <div style={{
              padding: "0 0 8px 0",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
              {currentSections.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => { setMenuOpen(false); scrollTo(id); }}
                  style={{
                    display: "block",
                    width: "100%",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "12px",
                    fontWeight: 400,
                    color: activeSection === id
                      ? "rgba(253,246,236,0.6)"
                      : "rgba(253,246,236,0.35)",
                    background: "none",
                    border: "none",
                    textAlign: "left",
                    padding: "7px 20px 7px 36px",
                    cursor: "pointer",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Skills Commons */}
          <button
            onClick={() => { setMenuOpen(false); onNavigate?.("commons"); }}
            style={{
              display: "block",
              width: "100%",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              color: view === "commons" ? COLORS.cream : "rgba(253,246,236,0.6)",
              background: "none",
              border: "none",
              textAlign: "left",
              padding: "12px 20px",
              cursor: "pointer",
            }}
          >
            Skills Commons
          </button>

          {/* Divider */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", margin: "4px 0" }} />

          {/* Your Skill Suggestions — disabled when no results */}
          {hasResults ? (
            <button
              onClick={() => { setMenuOpen(false); onNavigate?.("results"); }}
              style={{
                display: "block",
                width: "100%",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                color: view === "results" ? COLORS.cream : "rgba(253,246,236,0.6)",
                background: "none",
                border: "none",
                textAlign: "left",
                padding: "12px 20px",
                cursor: "pointer",
              }}
            >
              Your Skill Suggestions
            </button>
          ) : (
            <span
              style={{
                display: "block",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                color: "rgba(253,246,236,0.2)",
                padding: "12px 20px",
              }}
            >
              Your Skill Suggestions
            </span>
          )}

          {/* About — shown post-analysis when not on landing */}
          {hasResults && view !== "landing" && (
            <button
              onClick={() => { setMenuOpen(false); onNavigate?.("landing"); }}
              style={{
                display: "block",
                width: "100%",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                color: "rgba(253,246,236,0.6)",
                background: "none",
                border: "none",
                textAlign: "left",
                padding: "12px 20px",
                cursor: "pointer",
              }}
            >
              About
            </button>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════
          SECONDARY NAV — dark green bar, section scroll
          ══════════════════════════════════════════════ */}
      {showSubNav && (
        <div
          className="header-subnav"
          style={{
            background: COLORS.green,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "42px",
            position: "relative",
          }}
        >
          {/* Bottom accent line */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: COLORS.greenMid,
          }} />

          <nav
            className="nav-results-scroll"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 0,
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {currentSections.map(({ id, label }) => {
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "12px",
                    fontWeight: isActive ? 500 : 400,
                    color: isActive ? COLORS.cream : "rgba(253, 246, 236, 0.6)",
                    textDecoration: "none",
                    padding: "10px 20px",
                    transition: "all 0.15s ease",
                    whiteSpace: "nowrap",
                    position: "relative",
                    zIndex: 1,
                    flexShrink: 0,
                  }}
                >
                  {label}
                  {/* Active underline */}
                  {isActive && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: "16px",
                        right: "16px",
                        height: "3px",
                        background: COLORS.sage,
                        borderRadius: "2px 2px 0 0",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
