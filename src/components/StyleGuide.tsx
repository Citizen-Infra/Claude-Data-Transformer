import React, { useCallback } from "react";
import logoLight from "../assets/logo-light.svg";
import logoCompact from "../assets/logo-compact.svg";

const mono = "'DM Mono', 'IBM Plex Mono', monospace";
const sans = "'DM Sans', 'Helvetica Neue', sans-serif";
const serif = "'DM Serif Display', Georgia, serif";

/* ── All color tokens used across the codebase ── */
const PALETTE = {
  "Primary Green": {
    green: { hex: "#2D4A3E", usage: "Header, buttons, nav, text primary, step badges" },
    greenDeep: { hex: "#1a2f26", usage: "Modal backdrop, sub-nav bg, dark accents" },
    greenMid: { hex: "#3a5a4a", usage: "Header sub-nav hover, links" },
    greenMuted: { hex: "#2d5a3f", usage: "Logo accent dot, muted green links" },
    accent: { hex: "#3d7a56", usage: "Active/accent states, skill card bar" },
  },
  "Sage & Mint": {
    sage: { hex: "#8BA898", usage: "Header section nav text, inactive items" },
    sageLight: { hex: "#c8d8cf", usage: "Section nav active underline" },
    sageBright: { hex: "#6DBF73", usage: "Modal success indicators, privacy dot" },
    mint: { hex: "#88E7BB", usage: "Dark logo accent (CSS var --color-pdt-mint)" },
  },
  "Cream & Surface": {
    cream: { hex: "#FDF6EC", usage: "Header bg, button text on dark, page cream" },
    creamDeep: { hex: "#F5EBDA", usage: "Drop zone bg, deeper cream" },
    creamBorder: { hex: "#E8DCCA", usage: "Header border, card borders, export box" },
    surface: { hex: "#FFFFFF", usage: "Cards, export box, modal body" },
    bg: { hex: "#FFFFFF", usage: "Page background" },
    cardBg: { hex: "#e8f0eb", usage: "Landing page card backgrounds" },
  },
  "Text & Neutral": {
    ink: { hex: "#1a1a18", usage: "Landing page headings, strong text (legacy)" },
    textPrimary: { hex: "#2D4A3E", usage: "Headings, strong text (mockup palette)" },
    body: { hex: "#7A7A6C", usage: "Body text, step descriptions" },
    warmGray: { hex: "#9C9C8A", usage: "Eyebrow labels, muted mono text" },
    subtle: { hex: "#888888", usage: "Footer links, copyright, meta" },
    textMuted: { hex: "#4d4943", usage: "Secondary body text" },
  },
  "Semantic": {
    errorBg: { hex: "#fef2f2", usage: "Error state backgrounds" },
    errorText: { hex: "#991b1b", usage: "Error state text" },
    errorBorder: { hex: "#fecaca", usage: "Error state borders" },
    successBg: { hex: "#f0fdf4", usage: "Success state backgrounds" },
    successText: { hex: "#166534", usage: "Success state text" },
    successBorder: { hex: "#bbf7d0", usage: "Success state borders" },
  },
};

const TYPOGRAPHY = [
  {
    name: "Page Heading",
    fontFamily: sans,
    fontSize: "36px",
    fontWeight: 700,
    lineHeight: "1.15",
    color: "#2D4A3E",
    sample: "Upload your data.",
  },
  {
    name: "Section Heading",
    fontFamily: sans,
    fontSize: "26px",
    fontWeight: 700,
    lineHeight: "1.3",
    color: "#2D4A3E",
    sample: "Your conversation history is the best guide.",
  },
  {
    name: "Card Title (Serif)",
    fontFamily: serif,
    fontSize: "24px",
    fontWeight: 400,
    lineHeight: "1.2",
    color: "#2D4A3E",
    sample: "Connect to Claude",
  },
  {
    name: "Eyebrow / Section Label",
    fontFamily: mono,
    fontSize: "10px",
    fontWeight: 500,
    lineHeight: "1.4",
    color: "#9C9C8A",
    sample: "WHY SKILLS MATTER",
    extra: { letterSpacing: "0.14em", textTransform: "uppercase" as const },
  },
  {
    name: "Body",
    fontFamily: sans,
    fontSize: "15px",
    fontWeight: 400,
    lineHeight: "1.7",
    color: "#7A7A6C",
    sample: "We analyze your conversation patterns — the topics you revisit, the tasks you repeat.",
  },
  {
    name: "Body (Strong)",
    fontFamily: sans,
    fontSize: "15px",
    fontWeight: 600,
    lineHeight: "1.7",
    color: "#2D4A3E",
    sample: "Instead of browsing a catalog and guessing, we match Skills to how you already work.",
  },
  {
    name: "Step Description",
    fontFamily: sans,
    fontSize: "13px",
    fontWeight: 400,
    lineHeight: "1.5",
    color: "#7A7A6C",
    sample: 'Click "Export data" — you\'ll get an email',
  },
  {
    name: "Nav Link (Sub-nav)",
    fontFamily: mono,
    fontSize: "12px",
    fontWeight: 400,
    lineHeight: "1.4",
    color: "#8BA898",
    sample: "How it works",
    extra: { letterSpacing: "0.02em" },
  },
  {
    name: "Button Label",
    fontFamily: sans,
    fontSize: "14px",
    fontWeight: 600,
    lineHeight: "1.4",
    color: "#FDF6EC",
    sample: "Find your Skills →",
  },
  {
    name: "Badge / Tag",
    fontFamily: sans,
    fontSize: "10px",
    fontWeight: 600,
    lineHeight: "1",
    color: "#8B6914",
    sample: "NEW",
    extra: { letterSpacing: "0.08em", textTransform: "uppercase" as const },
  },
  {
    name: "Footer / Copyright",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "11px",
    fontWeight: 400,
    lineHeight: "1.4",
    color: "#888888",
    sample: "© 2025 Citizen Infrastructure · Your Data, Always",
  },
];

const SPACING = [
  { label: "Section padding", value: "72px 24px", use: "Main content sections" },
  { label: "Max width", value: "780px", use: "Content container" },
  { label: "Card padding", value: "24px 28px", use: "Export steps box, info cards" },
  { label: "Card padding (large)", value: "36px 32px 32px", use: "Action cards (MCP, Networking)" },
  { label: "Card border-radius", value: "10-16px", use: "10px for compact, 12px standard, 16px for action cards" },
  { label: "Gap (cards)", value: "20-24px", use: "Grid gap between cards" },
  { label: "Gap (buttons)", value: "12px", use: "Between CTA buttons" },
  { label: "Eyebrow → heading", value: "12px", use: "Section label to heading" },
  { label: "Heading → body", value: "14px", use: "Heading to body text" },
  { label: "Body → content", value: "32px", use: "Body text to cards/buttons" },
  { label: "Header height (primary)", value: "56px", use: "White top nav bar" },
  { label: "Header height (sub-nav)", value: "44px", use: "Green section nav" },
  { label: "Scroll threshold", value: "80px", use: "When compact header activates" },
];

const COMPONENTS = [
  {
    name: "Primary Button",
    bg: "#2D4A3E",
    color: "#FDF6EC",
    border: "none",
    radius: "8px",
    padding: "12px 24px",
    font: `600 14px ${sans}`,
  },
  {
    name: "Outline Button",
    bg: "transparent",
    color: "#2D4A3E",
    border: "1px solid #E8DCCA",
    radius: "8px",
    padding: "12px 24px",
    font: `600 14px ${sans}`,
  },
  {
    name: "Pill CTA (dark bg)",
    bg: "#FFFFFF",
    color: "#1A2E23",
    border: "none",
    radius: "100px",
    padding: "12px 24px",
    font: `600 14px ${sans}`,
  },
  {
    name: "Pill CTA (light bg)",
    bg: "#1A2E23",
    color: "#FFFFFF",
    border: "none",
    radius: "100px",
    padding: "12px 24px",
    font: `600 14px ${sans}`,
  },
  {
    name: "Step Number Badge",
    bg: "#2D4A3E",
    color: "#FDF6EC",
    border: "none",
    radius: "6px",
    padding: "0 (24×24 centered)",
    font: `600 12px ${sans}`,
  },
  {
    name: "Tag Badge (New)",
    bg: "#FFF8E6",
    color: "#8B6914",
    border: "1px solid #F0E0A8",
    radius: "100px",
    padding: "4px 10px",
    font: `600 10px ${sans}`,
  },
];

/* ── Swatch component ── */
function Swatch({ hex, name, usage }: { hex: string; name: string; usage: string }) {
  const isLight = ["#FDF6EC", "#F5EBDA", "#FFFFFF", "#e8f0eb", "#f0fdf4", "#fef2f2", "#FFF8E6", "#c8d8cf", "#bbf7d0", "#fecaca"].some(
    (l) => l.toLowerCase() === hex.toLowerCase()
  );
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 0" }}>
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "8px",
          background: hex,
          border: isLight ? "1px solid #E8DCCA" : "1px solid transparent",
          flexShrink: 0,
        }}
      />
      <div>
        <div style={{ fontFamily: sans, fontSize: "13px", fontWeight: 600, color: "#2D4A3E" }}>
          {name}{" "}
          <code style={{
            fontFamily: mono,
            fontSize: "11px",
            fontWeight: 400,
            color: "#7A7A6C",
            background: "#f5f5f0",
            padding: "1px 6px",
            borderRadius: "3px",
          }}>
            {hex}
          </code>
        </div>
        <div style={{ fontFamily: sans, fontSize: "12px", color: "#9C9C8A", marginTop: "2px" }}>
          {usage}
        </div>
      </div>
    </div>
  );
}

/* ── Download Header.tsx button ── */
function DownloadHeaderButton() {
  const handleDownload = useCallback(async () => {
    try {
      // Fetch the raw source of Header.tsx at build time via Vite's ?raw import
      const mod = await import("./Header.tsx?raw");
      const source = mod.default;
      const blob = new Blob([source], { type: "text/typescript" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Header.tsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch {
      // Fallback: open the file path hint
      alert("Could not download automatically. The Header component is at src/components/Header.tsx in the project.");
    }
  }, []);

  return (
    <button
      onClick={handleDownload}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "12px 24px",
        background: "#2D4A3E",
        color: "#FDF6EC",
        border: "none",
        borderRadius: "8px",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "14px",
        fontWeight: 600,
        cursor: "pointer",
        transition: "opacity 0.15s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
      onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Download Header.tsx
    </button>
  );
}

export default function StyleGuide() {
  return (
    <div style={{
      maxWidth: "880px",
      margin: "0 auto",
      padding: "56px 32px 80px",
      fontFamily: sans,
      color: "#2D4A3E",
    }}>
      {/* Header */}
      <div style={{ marginBottom: "56px" }}>
        <div style={{
          fontFamily: mono,
          fontSize: "10px",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#9C9C8A",
          marginBottom: "12px",
        }}>
          Design System
        </div>
        <h1 style={{
          fontFamily: sans,
          fontSize: "36px",
          fontWeight: 700,
          color: "#2D4A3E",
          lineHeight: 1.15,
          marginBottom: "12px",
        }}>
          claude.pdt Style Guide
        </h1>
        <p style={{ fontFamily: sans, fontSize: "15px", color: "#7A7A6C", lineHeight: 1.7, maxWidth: "540px" }}>
          All design tokens, typography scales, spacing values, and component patterns used across the claude.pdt website.
        </p>
      </div>

      {/* ── FONTS ── */}
      <Section title="Typefaces">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
          {[
            { name: "DM Sans", family: sans, role: "UI text, headings, body, buttons", weight: "400 / 500 / 600 / 700" },
            { name: "DM Mono", family: mono, role: "Eyebrow labels, sub-nav links, code", weight: "400 / 500" },
            { name: "DM Serif Display", family: serif, role: "Card titles (serif accent)", weight: "400" },
            { name: "JetBrains Mono", family: "'JetBrains Mono', monospace", role: "Footer, legacy code blocks", weight: "400 / 500" },
          ].map((f) => (
            <div key={f.name} style={{
              padding: "20px",
              border: "1px solid #E8DCCA",
              borderRadius: "10px",
              background: "#fff",
            }}>
              <div style={{ fontFamily: f.family, fontSize: "20px", fontWeight: 600, marginBottom: "8px", color: "#2D4A3E" }}>
                {f.name}
              </div>
              <div style={{ fontFamily: f.family, fontSize: "28px", fontWeight: 400, color: "#2D4A3E", marginBottom: "12px", lineHeight: 1.2 }}>
                Aa Bb Cc 123
              </div>
              <div style={{ fontSize: "12px", color: "#9C9C8A", lineHeight: 1.5 }}>
                <strong style={{ color: "#7A7A6C" }}>Role:</strong> {f.role}<br />
                <strong style={{ color: "#7A7A6C" }}>Weights:</strong> {f.weight}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── COLORS ── */}
      <Section title="Color Palette">
        {Object.entries(PALETTE).map(([group, tokens]) => (
          <div key={group} style={{ marginBottom: "28px" }}>
            <h3 style={{ fontFamily: sans, fontSize: "14px", fontWeight: 600, color: "#2D4A3E", marginBottom: "8px" }}>
              {group}
            </h3>
            <div style={{
              background: "#fff",
              border: "1px solid #E8DCCA",
              borderRadius: "10px",
              padding: "12px 20px",
            }}>
              {Object.entries(tokens).map(([name, { hex, usage }]) => (
                <Swatch key={name} hex={hex} name={name} usage={usage} />
              ))}
            </div>
          </div>
        ))}
      </Section>

      {/* ── TYPOGRAPHY SCALE ── */}
      <Section title="Typography Scale">
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {TYPOGRAPHY.map((t) => (
            <div key={t.name} style={{
              padding: "20px 24px",
              border: "1px solid #E8DCCA",
              borderRadius: "10px",
              background: "#fff",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                <span style={{ fontFamily: sans, fontSize: "12px", fontWeight: 600, color: "#2D4A3E" }}>
                  {t.name}
                </span>
                <code style={{
                  fontFamily: mono,
                  fontSize: "10px",
                  color: "#9C9C8A",
                  background: "#f5f5f0",
                  padding: "2px 8px",
                  borderRadius: "3px",
                }}>
                  {t.fontSize} / {t.fontWeight} / {t.lineHeight}
                </code>
              </div>
              <div style={{
                fontFamily: t.fontFamily,
                fontSize: t.fontSize,
                fontWeight: t.fontWeight,
                lineHeight: t.lineHeight,
                color: t.color,
                ...t.extra,
              }}>
                {t.sample}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── SPACING ── */}
      <Section title="Spacing & Layout">
        <div style={{
          background: "#fff",
          border: "1px solid #E8DCCA",
          borderRadius: "10px",
          overflow: "hidden",
        }}>
          {SPACING.map((s, i) => (
            <div key={s.label} style={{
              display: "grid",
              gridTemplateColumns: "160px 120px 1fr",
              gap: "12px",
              padding: "12px 20px",
              borderTop: i > 0 ? "1px solid #f0ede6" : "none",
              alignItems: "center",
            }}>
              <span style={{ fontFamily: sans, fontSize: "13px", fontWeight: 600, color: "#2D4A3E" }}>
                {s.label}
              </span>
              <code style={{
                fontFamily: mono,
                fontSize: "12px",
                color: "#2D4A3E",
                background: "#f5f5f0",
                padding: "2px 8px",
                borderRadius: "3px",
                width: "fit-content",
              }}>
                {s.value}
              </code>
              <span style={{ fontSize: "12px", color: "#9C9C8A" }}>
                {s.use}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── BUTTONS & COMPONENTS ── */}
      <Section title="Buttons & Components">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          {COMPONENTS.map((c) => (
            <div key={c.name} style={{
              padding: "20px",
              border: "1px solid #E8DCCA",
              borderRadius: "10px",
              background: "#fff",
            }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "#2D4A3E", marginBottom: "12px" }}>
                {c.name}
              </div>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: c.bg,
                color: c.color,
                border: c.border,
                borderRadius: c.radius,
                padding: c.padding === "0 (24×24 centered)" ? "0" : c.padding,
                width: c.padding === "0 (24×24 centered)" ? "24px" : undefined,
                height: c.padding === "0 (24×24 centered)" ? "24px" : undefined,
                justifyContent: "center",
                font: c.font,
                marginBottom: "12px",
              }}>
                {c.padding === "0 (24×24 centered)" ? "1" : "Button label"}
              </div>
              <div style={{ fontSize: "11px", color: "#9C9C8A", lineHeight: 1.5 }}>
                bg: <code style={{ fontFamily: mono, fontSize: "10px" }}>{c.bg}</code> ·{" "}
                radius: <code style={{ fontFamily: mono, fontSize: "10px" }}>{c.radius}</code> ·{" "}
                border: <code style={{ fontFamily: mono, fontSize: "10px" }}>{c.border}</code>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── NAV STRUCTURE ── */}
      <Section title="Navigation Bar">
        {/* Live preview */}
        <div style={{
          border: "1px solid #E8DCCA",
          borderRadius: "12px",
          overflow: "hidden",
          marginBottom: "20px",
        }}>
          {/* Preview label */}
          <div style={{
            padding: "8px 16px",
            background: "#f5f5f0",
            borderBottom: "1px solid #E8DCCA",
            fontFamily: mono,
            fontSize: "10px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#9C9C8A",
          }}>
            Live Preview
          </div>

          {/* ── Primary nav preview ── */}
          <div style={{
            background: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 28px",
            height: "56px",
            borderBottom: "1px solid #E8DCCA",
          }}>
            <img src={logoLight} alt="claude.pdt" style={{ height: "28px", width: "auto" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 0, height: "56px" }}>
              {["About", "Skills Commons", "Your Skill Suggestions"].map((label) => (
                <span
                  key={label}
                  style={{
                    fontFamily: sans,
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#2D4A3E",
                    padding: "0 20px",
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* ── Sub-nav preview ── */}
          <div style={{
            background: "#2D4A3E",
            display: "flex",
            alignItems: "center",
            height: "42px",
            position: "relative",
            padding: "0 16px",
          }}>
            {/* Bottom accent line */}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: "#3a5a4a",
            }} />

            {/* Compact logo */}
            <img src={logoCompact} alt="claude.pdt" style={{ height: "22px", width: "auto", marginRight: "12px", flexShrink: 0 }} />

            {/* Section links */}
            <nav style={{ display: "flex", alignItems: "center", gap: 0, flex: 1, justifyContent: "center" }}>
              {["How it works", "Upload your data", "Protecting your Privacy", "About the builders"].map((label, i) => (
                <span
                  key={label}
                  style={{
                    fontFamily: mono,
                    fontSize: "12px",
                    fontWeight: i === 0 ? 500 : 400,
                    color: i === 0 ? "#FDF6EC" : "rgba(253,246,236,0.6)",
                    padding: "10px 20px",
                    whiteSpace: "nowrap",
                    position: "relative",
                  }}
                >
                  {label}
                  {i === 0 && (
                    <span style={{
                      position: "absolute",
                      bottom: 0,
                      left: "16px",
                      right: "16px",
                      height: "3px",
                      background: "#8BA898",
                      borderRadius: "2px 2px 0 0",
                    }} />
                  )}
                </span>
              ))}
            </nav>

            {/* Hamburger icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FDF6EC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7, flexShrink: 0 }}>
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </div>
        </div>

        {/* Specs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px" }}>
          <div style={{ padding: "20px 24px", border: "1px solid #E8DCCA", borderRadius: "10px", background: "#fff" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#2D4A3E", marginBottom: "8px" }}>Primary Nav (white bar, 56px)</div>
            <p style={{ fontSize: "12px", color: "#7A7A6C", lineHeight: 1.6, margin: 0 }}>
              Logo + page tabs (About, Skills Commons, Your Skill Suggestions). Collapses to 0px on scroll past 80px threshold.
              Hamburger in sub-nav toggles it back. On mobile (&le;768px), stays at 56px with hamburger dropdown.
            </p>
          </div>
          <div style={{ padding: "20px 24px", border: "1px solid #E8DCCA", borderRadius: "10px", background: "#2D4A3E", color: "#FDF6EC" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Sub Nav (green bar, 42px)</div>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", lineHeight: 1.6, margin: 0 }}>
              Section scroll links in DM Mono. Compact logo (claude.pdt wordmark) and hamburger menu appear when scrolled.
              100px scroll lag before auto-collapse of manually opened primary nav. 3px accent line at bottom. Hidden on mobile.
            </p>
          </div>
        </div>

        {/* Download button */}
        <DownloadHeaderButton />
      </Section>

      {/* ── BREAKPOINTS ── */}
      <Section title="Responsive Breakpoints">
        <div style={{
          background: "#fff",
          border: "1px solid #E8DCCA",
          borderRadius: "10px",
          overflow: "hidden",
        }}>
          {[
            { bp: "≤ 768px", name: "Tablet / Mobile", notes: "Hamburger nav, subnav hidden, footer stacks, persona grid 2-col" },
            { bp: "≤ 640px", name: "Small Mobile", notes: "Single-col grids, modal full-width, step rows stack vertically" },
            { bp: "> 768px", name: "Desktop", notes: "Full two-tier nav, all grids at designed columns" },
          ].map((b, i) => (
            <div key={b.bp} style={{
              display: "grid",
              gridTemplateColumns: "100px 140px 1fr",
              gap: "12px",
              padding: "14px 20px",
              borderTop: i > 0 ? "1px solid #f0ede6" : "none",
              alignItems: "center",
            }}>
              <code style={{ fontFamily: mono, fontSize: "12px", fontWeight: 500, color: "#2D4A3E" }}>{b.bp}</code>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#2D4A3E" }}>{b.name}</span>
              <span style={{ fontSize: "12px", color: "#9C9C8A" }}>{b.notes}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── FILE MAP ── */}
      <Section title="Key Files">
        <div style={{
          background: "#fff",
          border: "1px solid #E8DCCA",
          borderRadius: "10px",
          padding: "16px 20px",
        }}>
          {[
            { file: "src/components/Header.tsx", desc: "Two-tier nav, scroll collapse, hamburger toggle" },
            { file: "src/components/LandingPage.tsx", desc: "Landing sections, upload, personas, privacy" },
            { file: "src/components/ResultsPage.tsx", desc: "Analysis results, skill cards, charts" },
            { file: "src/components/SkillsCommonsPage.tsx", desc: "Skills commons browsing" },
            { file: "src/components/ParsingNarration.tsx", desc: "Modal with parsing steps + match summary" },
            { file: "src/components/Footer.tsx", desc: "Site footer with links" },
            { file: "src/index.css", desc: "CSS vars, responsive breakpoints, animations" },
            { file: "src/assets/logo-light.svg", desc: "Full logo (white bg context)" },
            { file: "src/assets/logo-compact.svg", desc: "Compact wordmark (dark bg sub-nav)" },
          ].map((f, i) => (
            <div key={f.file} style={{
              display: "flex",
              gap: "12px",
              padding: "8px 0",
              borderTop: i > 0 ? "1px solid #f0ede6" : "none",
              alignItems: "baseline",
            }}>
              <code style={{
                fontFamily: mono,
                fontSize: "11px",
                color: "#2D4A3E",
                background: "#f5f5f0",
                padding: "2px 8px",
                borderRadius: "3px",
                flexShrink: 0,
              }}>
                {f.file}
              </code>
              <span style={{ fontSize: "12px", color: "#9C9C8A" }}>{f.desc}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

/* ── Section wrapper ── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "56px" }}>
      <h2 style={{
        fontFamily: sans,
        fontSize: "20px",
        fontWeight: 700,
        color: "#2D4A3E",
        marginBottom: "20px",
        paddingBottom: "10px",
        borderBottom: "1px solid #E8DCCA",
      }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
