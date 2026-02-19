import { useState } from "react";
import { PERSONAS } from "../data/samplePersonas";

const C = {
  green: "#1a3a2a",
  greenMuted: "#2d5a3f",
  cream: "#f5f0e8",
  text: "#1a1a18",
  textMuted: "#4d4943",
  borderLight: "#e8e2d6",
  white: "#ffffff",
};

const mono = "'DM Mono', 'IBM Plex Mono', monospace";
const sans = "'DM Sans', 'Helvetica Neue', sans-serif";

interface PersonaPickerProps {
  onTryDemo: (personaId: string) => void;
  onDownload: (personaId: string) => void;
  heading?: string;
  subheading?: string;
}

function PersonaCard({
  persona,
  onTryDemo,
  onDownload,
}: {
  persona: (typeof PERSONAS)[number];
  onTryDemo: () => void;
  onDownload: () => void;
}) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="persona-card"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: "20px 12px 16px",
        background: hover ? C.cream : C.white,
        border: `1.5px solid ${hover ? C.greenMuted : C.borderLight}`,
        borderRadius: "10px",
        textAlign: "center",
        cursor: "default",
        transition: "all 0.2s ease",
        transform: hover ? "translateY(-3px)" : "none",
        boxShadow: hover
          ? "0 6px 16px rgba(0,0,0,0.07)"
          : "0 1px 3px rgba(0,0,0,0.03)",
      }}
    >
      <div style={{ fontSize: "30px", marginBottom: "10px", lineHeight: 1 }}>
        {persona.emoji}
      </div>
      <div
        style={{
          fontFamily: sans,
          fontSize: "13px",
          fontWeight: 600,
          color: C.text,
          marginBottom: "4px",
          lineHeight: 1.3,
        }}
      >
        {persona.name}
      </div>
      <div
        style={{
          fontFamily: sans,
          fontSize: "11px",
          color: C.textMuted,
          lineHeight: 1.5,
          marginBottom: "16px",
          minHeight: "34px",
        }}
      >
        {persona.tagline}
      </div>
      <button
        onClick={onTryDemo}
        style={{
          display: "inline-block",
          padding: "7px 16px",
          background: C.green,
          color: C.cream,
          borderRadius: "6px",
          fontFamily: sans,
          fontSize: "11.5px",
          fontWeight: 500,
          border: "none",
          cursor: "pointer",
          marginBottom: "8px",
        }}
      >
        Try demo
      </button>
      <div
        onClick={(e) => {
          e.stopPropagation();
          onDownload();
        }}
        style={{
          fontFamily: mono,
          fontSize: "10px",
          color: C.greenMuted,
          cursor: "pointer",
          textDecoration: hover ? "underline" : "none",
          textUnderlineOffset: "2px",
        }}
      >
        ↓ Download .json
      </div>
    </div>
  );
}

export default function PersonaPicker({
  onTryDemo,
  onDownload,
  heading,
  subheading,
}: PersonaPickerProps) {
  return (
    <div style={{ padding: "0 28px 32px" }}>
      <div style={{ textAlign: "center", marginBottom: "22px" }}>
        <div
          style={{
            fontFamily: sans,
            fontSize: "18px",
            fontWeight: 600,
            color: C.text,
            marginBottom: "5px",
          }}
        >
          {heading || "Not ready to upload your own data?"}
        </div>
        <div style={{ fontFamily: sans, fontSize: "14px", color: C.textMuted }}>
          {subheading || "See how it works with a famous persona."}
        </div>
      </div>

      {/* Responsive grid — wraps at ~135px per card */}
      <div
        className="persona-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(135px, 1fr))",
          gap: "12px",
        }}
      >
        {PERSONAS.map((persona) => (
          <PersonaCard
            key={persona.id}
            persona={persona}
            onTryDemo={() => onTryDemo(persona.id)}
            onDownload={() => onDownload(persona.id)}
          />
        ))}
      </div>
    </div>
  );
}
