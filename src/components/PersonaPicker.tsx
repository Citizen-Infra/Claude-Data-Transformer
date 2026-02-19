import { useState } from "react";
import { PERSONAS } from "../data/samplePersonas";

const C = {
  mid: "#2d5a3f",
  accent: "#3d7a56",
  surface: "#fff",
  cardBg: "#e8f0eb",
  border: "#e0e0e0",
  ink: "#1a1a1a",
  body: "#555",
  subtle: "#888",
};

interface PersonaPickerProps {
  onTryDemo: (personaId: string) => void;
  onDownload: (personaId: string) => void;
}

export default function PersonaPicker({
  onTryDemo,
  onDownload,
}: PersonaPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ marginTop: "20px" }}>
      {/* Toggle link */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          width: "100%",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "12px 0",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "13px",
          color: C.body,
          textAlign: "left",
        }}
      >
        <span style={{ color: C.mid, fontWeight: 600 }}>
          {open ? "Hide sample personas" : "Hesitant? Try with sample data"}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke={C.mid}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              color: C.body,
              lineHeight: 1.6,
              marginBottom: "16px",
            }}
          >
            Pick a famous persona and see the full experience with fictional
            conversations.
          </p>

          {/* Persona grid */}
          <div
            className="persona-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "12px",
            }}
          >
            {PERSONAS.map((persona) => (
              <div
                key={persona.id}
                className="persona-card"
                style={{
                  padding: "20px 16px",
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  transition: "box-shadow 0.2s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 4px 20px rgba(0,0,0,0.06)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "none";
                }}
              >
                {/* Persona info */}
                <div>
                  <div style={{ fontSize: "24px", marginBottom: "6px" }}>
                    {persona.emoji}
                  </div>
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: C.ink,
                      marginBottom: "2px",
                    }}
                  >
                    {persona.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "12px",
                      color: C.subtle,
                      lineHeight: 1.4,
                    }}
                  >
                    {persona.tagline}
                  </div>
                </div>

                {/* Actions */}
                <div
                  className="persona-card-actions"
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginTop: "auto",
                  }}
                >
                  <button
                    onClick={() => onTryDemo(persona.id)}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      background: C.mid,
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                  >
                    Try demo
                  </button>
                  <button
                    onClick={() => onDownload(persona.id)}
                    style={{
                      padding: "8px 12px",
                      background: "none",
                      color: C.mid,
                      border: `1px solid ${C.border}`,
                      borderRadius: "6px",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "11px",
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "border-color 0.15s",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ↓ .json
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
