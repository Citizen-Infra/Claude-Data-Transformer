import { useState, useEffect } from "react";
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
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        padding: "0 24px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: isDark ? "#1a3a2a" : "#fff",
        borderBottom: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e0e0e0",
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
        }}
      >
        <img
          src={isDark ? logoDark : logoLight}
          alt="claude.pdt — personal data transformer"
          style={{ height: "32px", width: "auto" }}
        />
      </button>

      <nav style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        {view === "landing" && (
          <>
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
          </>
        )}

        {view === "results" &&
          NAV_SECTIONS.map(({ id, label }) => {
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
    </header>
  );
}
