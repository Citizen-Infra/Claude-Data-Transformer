import type { AppView } from "../lib/types";

interface HeaderProps {
  view: AppView;
  onLogoClick: () => void;
}

export default function Header({ view, onLogoClick }: HeaderProps) {
  const isDark = view === "results";

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
          alignItems: "baseline",
          gap: "4px",
          padding: 0,
        }}
      >
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "1.5rem",
            fontWeight: 800,
            letterSpacing: "-0.5px",
            color: isDark ? "#fff" : "#1a1a1a",
          }}
        >
          claude<span style={{ color: "#2d5a3f" }}>.</span>pdt
        </span>
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.85rem",
            fontWeight: 400,
            letterSpacing: "0.5px",
            color: isDark ? "rgba(255,255,255,0.5)" : "#888",
            marginLeft: "6px",
          }}
        >
          personal data transformer
        </span>
      </button>

      <nav style={{ display: "flex", alignItems: "center", gap: "28px" }}>
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
              }}
            >
              Get started
            </a>
          </>
        )}
      </nav>
    </header>
  );
}
