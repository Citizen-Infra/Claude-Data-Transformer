import { useState } from "react";
import type { ParsedConversation } from "../lib/types";

const C = {
  dark: "#1a3a2a",
  mid: "#2d5a3f",
  accent: "#3d7a56",
  cream: "#f7f5f0",
  surface: "#fff",
  cardBg: "#e8f0eb",
  border: "#e0e0e0",
  ink: "#1a1a1a",
  body: "#555",
  subtle: "#888",
};

interface ParsedPreviewProps {
  conversations: ParsedConversation[];
  stats: { conversations: number; messages: number; withArtifacts: number };
  dateRange: { earliest: string; latest: string };
  dataSource: "file" | "persona";
  personaName?: string;
  personaEmoji?: string;
  onAnalyze: () => void;
  onReset: () => void;
}

function formatRelativeDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays < 1) return "Today";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  } catch {
    return "";
  }
}

export default function ParsedPreview({
  conversations,
  stats,
  dateRange,
  dataSource,
  personaName,
  personaEmoji,
  onAnalyze,
  onReset,
}: ParsedPreviewProps) {
  const [listOpen, setListOpen] = useState(false);
  const isSample = dataSource === "persona";

  return (
    <div
      className="reveal-up"
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
      {/* ── Trust proof banner ── */}
      <div
        style={{
          padding: "14px 20px",
          background: C.cardBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "8px",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            fontWeight: 600,
            color: C.mid,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke={C.mid}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {stats.conversations} conversations parsed locally · 0 data sent
          anywhere
        </div>

        {/* Sample badge */}
        {isSample && personaName && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "3px 10px",
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: "100px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              fontWeight: 500,
              color: C.subtle,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {personaEmoji} {personaName} · sample
          </span>
        )}
      </div>

      <div style={{ padding: "24px 20px" }}>
        {/* ── Stats row ── */}
        <div
          className="preview-stats"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {[
            { value: stats.conversations.toString(), label: "Conversations" },
            { value: stats.messages.toLocaleString(), label: "Messages" },
            { value: stats.withArtifacts.toString(), label: "With artifacts" },
            {
              value: `${dateRange.earliest} — ${dateRange.latest}`,
              label: "Date range",
            },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  fontSize: i === 3 ? "14px" : "24px",
                  fontWeight: 400,
                  color: C.dark,
                  marginBottom: "4px",
                  lineHeight: 1.2,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px",
                  fontWeight: 500,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: C.subtle,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Expandable conversation list ── */}
        <div
          style={{
            border: `1px solid ${C.border}`,
            borderRadius: "10px",
            marginBottom: "24px",
            overflow: "hidden",
          }}
        >
          <button
            onClick={() => setListOpen(!listOpen)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              background: listOpen ? C.cream : "transparent",
              border: "none",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              color: C.body,
              textAlign: "left",
              transition: "background 0.15s",
            }}
          >
            <span>
              See all conversation titles — this is everything the tool can see
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke={C.subtle}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                flexShrink: 0,
                marginLeft: "8px",
                transform: listOpen ? "rotate(180deg)" : "none",
                transition: "transform 0.2s",
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {listOpen && (
            <div className="conversation-list">
              {/* Column headers */}
              <div
                style={{
                  position: "sticky",
                  top: 0,
                  display: "grid",
                  gridTemplateColumns: "1fr 60px 70px",
                  gap: "8px",
                  padding: "8px 16px",
                  background: C.cream,
                  borderBottom: `1px solid ${C.border}`,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px",
                  fontWeight: 500,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: C.subtle,
                }}
              >
                <span>Title</span>
                <span style={{ textAlign: "center" }}>Msgs</span>
                <span style={{ textAlign: "right" }}>Date</span>
              </div>

              {/* Rows */}
              {conversations.map((conv, i) => (
                <div
                  key={conv.id}
                  className="reveal-up"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 60px 70px",
                    gap: "8px",
                    padding: "8px 16px",
                    borderBottom:
                      i < conversations.length - 1
                        ? `1px solid ${C.border}`
                        : "none",
                    animationDelay: `${Math.min(i * 30, 600)}ms`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "13px",
                      color: C.ink,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {conv.title}
                  </span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "12px",
                      color: C.subtle,
                      textAlign: "center",
                    }}
                  >
                    {conv.message_count}
                  </span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "11px",
                      color: C.subtle,
                      textAlign: "right",
                    }}
                  >
                    {formatRelativeDate(conv.created_at)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Info panels ── */}
        <div
          className="preview-info-panels"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              padding: "16px",
              background: C.cream,
              borderRadius: "10px",
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: C.subtle,
                marginBottom: "8px",
              }}
            >
              What just happened
            </div>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                lineHeight: 1.6,
                color: C.body,
                margin: 0,
              }}
            >
              {isSample
                ? `We loaded ${personaName}'s fictional conversations entirely in your browser. This is the same view you'd get with your own data.`
                : "Your file was read entirely inside your browser. We extracted titles, message counts, and dates — nothing else. No message content was read yet."}
            </p>
          </div>

          <div
            style={{
              padding: "16px",
              background: C.cream,
              borderRadius: "10px",
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: C.subtle,
                marginBottom: "8px",
              }}
            >
              What happens next
            </div>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                lineHeight: 1.6,
                color: C.body,
                margin: 0,
              }}
            >
              {isSample
                ? `Click below to run the full analysis on this sample. You'll see the complete experience — then decide about your own data.`
                : "We analyze your patterns locally using pattern-matching heuristics — still no network requests. Everything stays in your browser."}
            </p>
          </div>
        </div>

        {/* ── Action buttons ── */}
        <div
          className="preview-actions"
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <button
            onClick={onReset}
            style={{
              padding: "12px 20px",
              background: "none",
              color: C.body,
              border: `1px solid ${C.border}`,
              borderRadius: "10px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "border-color 0.15s",
              whiteSpace: "nowrap",
            }}
          >
            {isSample ? "← Pick a different persona" : "Remove file"}
          </button>

          <button
            onClick={onAnalyze}
            className="analyze-btn-pulse"
            style={{
              flex: 1,
              padding: "14px 24px",
              background: `linear-gradient(135deg, ${C.mid}, ${C.accent})`,
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "15px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "opacity 0.15s",
              letterSpacing: "-0.2px",
            }}
          >
            {isSample
              ? `Analyze ${personaName}'s data →`
              : "Continue to analysis →"}
          </button>
        </div>
      </div>
    </div>
  );
}
