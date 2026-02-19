import { useState } from "react";
import type { ParsedConversation, UserProfile, EnrichedRecommendation } from "../lib/types";

const C = {
  green: "#1a3a2a",
  greenMuted: "#2d5a3f",
  accent: "#3d7a56",
  cream: "#f5f0e8",
  creamDark: "#ebe5d9",
  surface: "#fff",
  cardBg: "#e8f0eb",
  border: "#d8d2c6",
  borderLight: "#e8e2d6",
  text: "#1a1a18",
  textMuted: "#4d4943",
  warmGray: "#5e594f",
  warmGrayLight: "#76716a",
  white: "#ffffff",
};

const mono = "'DM Mono', 'IBM Plex Mono', monospace";
const sans = "'DM Sans', 'Helvetica Neue', sans-serif";

const VISIBLE_ROWS = 5;

interface ParsedPreviewProps {
  conversations: ParsedConversation[];
  stats: { conversations: number; messages: number; withArtifacts: number };
  dateRange: { earliest: string; latest: string };
  dataSource: "file" | "persona";
  personaName?: string;
  personaEmoji?: string;
  userProfile?: UserProfile | null;
  recommendations?: EnrichedRecommendation[] | null;
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
  userProfile,
  recommendations,
  onAnalyze,
  onReset,
}: ParsedPreviewProps) {
  const [expanded, setExpanded] = useState(false);
  const isSample = dataSource === "persona";
  const hasMore = conversations.length > VISIBLE_ROWS;
  const visibleConvs = expanded ? conversations : conversations.slice(0, VISIBLE_ROWS);

  const skillCount = recommendations?.length ?? 0;
  const gaps = userProfile?.skill_gaps ?? [];

  return (
    <div
      className="reveal-up"
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: "14px",
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
            fontFamily: sans,
            fontSize: "13px",
            fontWeight: 600,
            color: C.greenMuted,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke={C.greenMuted}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {stats.conversations} conversations parsed locally · {skillCount} skills matched
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
              fontFamily: mono,
              fontSize: "10px",
              fontWeight: 500,
              color: C.warmGray,
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
            { value: skillCount.toString(), label: "Skills matched" },
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
                  color: C.green,
                  marginBottom: "4px",
                  lineHeight: 1.2,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: "10px",
                  fontWeight: 500,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: C.warmGray,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Gaps we identified ── */}
        {gaps.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                fontFamily: mono,
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: C.warmGray,
                marginBottom: "10px",
              }}
            >
              Gaps we identified
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "8px",
              }}
            >
              {gaps.map((gap, i) => (
                <div
                  key={i}
                  style={{
                    padding: "12px 16px",
                    background: C.cream,
                    border: `1px solid ${C.borderLight}`,
                    borderRadius: "8px",
                    fontFamily: sans,
                    fontSize: "13px",
                    lineHeight: 1.55,
                    color: C.textMuted,
                  }}
                >
                  {gap}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Conversation list ── */}
        <div
          style={{
            border: `1px solid ${C.border}`,
            borderRadius: "10px",
            marginBottom: "24px",
            overflow: "hidden",
          }}
        >
          {/* Label above table */}
          <div
            style={{
              padding: "10px 16px",
              background: C.creamDark,
              borderBottom: `1px solid ${C.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontFamily: mono,
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: C.warmGray,
              }}
            >
              Conversations analyzed
            </span>
            <span
              style={{
                fontFamily: mono,
                fontSize: "10px",
                color: C.warmGrayLight,
              }}
            >
              {conversations.length} total
            </span>
          </div>

          {/* Column headers */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 60px 70px",
              gap: "8px",
              padding: "8px 16px",
              borderBottom: `1px solid ${C.borderLight}`,
              fontFamily: mono,
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: C.warmGrayLight,
            }}
          >
            <span>Title</span>
            <span style={{ textAlign: "center" }}>Msgs</span>
            <span style={{ textAlign: "right" }}>Date</span>
          </div>

          {/* Rows */}
          <div className={expanded ? "conversation-list" : undefined}>
            {visibleConvs.map((conv, i) => (
              <div
                key={conv.id}
                className="reveal-up"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 60px 70px",
                  gap: "8px",
                  padding: "8px 16px",
                  borderBottom:
                    i < visibleConvs.length - 1
                      ? `1px solid ${C.borderLight}`
                      : "none",
                  animationDelay: `${Math.min(i * 30, 600)}ms`,
                }}
              >
                <span
                  style={{
                    fontFamily: sans,
                    fontSize: "13px",
                    color: C.text,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {conv.title}
                </span>
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: "12px",
                    color: C.warmGray,
                    textAlign: "center",
                  }}
                >
                  {conv.message_count}
                </span>
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: "11px",
                    color: C.warmGray,
                    textAlign: "right",
                  }}
                >
                  {formatRelativeDate(conv.created_at)}
                </span>
              </div>
            ))}
          </div>

          {/* Show all / Show less button */}
          {hasMore && (
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                padding: "10px 16px",
                background: C.cream,
                border: "none",
                borderTop: `1px solid ${C.borderLight}`,
                cursor: "pointer",
                fontFamily: sans,
                fontSize: "12px",
                fontWeight: 500,
                color: C.greenMuted,
                transition: "background 0.15s",
              }}
            >
              {expanded
                ? "Show less"
                : `Show all ${conversations.length} conversations`}
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke={C.greenMuted}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: expanded ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s",
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          )}
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
              color: C.textMuted,
              border: `1px solid ${C.border}`,
              borderRadius: "10px",
              fontFamily: sans,
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
              background: `linear-gradient(135deg, ${C.greenMuted}, ${C.accent})`,
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontFamily: sans,
              fontSize: "15px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "opacity 0.15s",
              letterSpacing: "-0.2px",
            }}
          >
            {isSample
              ? `See ${personaName}'s suggested skills →`
              : "See suggested skills →"}
          </button>
        </div>
      </div>
    </div>
  );
}
