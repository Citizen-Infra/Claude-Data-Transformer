import { useState, useEffect, useRef, useCallback } from "react";
import { parseClaudeExport } from "../lib/parseClaudeExport";
import { buildHeuristicProfile, matchSkillsHeuristic } from "../lib/heuristicAnalysis";
import { SKILLS_CATALOG } from "../data/skillsCatalog";
import type { ClaudeConversation, ParsedConversation, UserProfile, EnrichedRecommendation } from "../lib/types";

/* ── Color tokens (aligned with mockup) ── */
const C = {
  greenDeep: "#1a2f26",
  green: "#2D4A3E",
  cream: "#FDF6EC",
  sageBright: "#6DBF73",
  sage: "#8BA898",
};

const mono = "'DM Mono', monospace";
const sans = "'DM Sans', sans-serif";

const VISIBLE_ROWS = 3;

interface UploadStats {
  conversations: number;
  messages: number;
  withArtifacts: number;
}

export interface NarrationResults {
  conversations: ParsedConversation[];
  stats: UploadStats;
  userProfile: UserProfile;
  recommendations: EnrichedRecommendation[];
}

interface ParsingNarrationProps {
  rawJson: ClaudeConversation[];
  dataSource: "file" | "persona";
  personaName?: string;
  personaEmoji?: string;
  onComplete: (results: NarrationResults) => void;
  onReset: () => void;
}

interface NarrationStep {
  label: string;
}

/** Simple artifact heuristic */
function countArtifacts(conversations: ParsedConversation[]): number {
  return conversations.filter((c) =>
    c.messages.some(
      (m) =>
        m.sender === "assistant" &&
        (m.text.includes("```") ||
          m.text.includes("Here is the code") ||
          m.text.includes("Here is the implementation"))
    )
  ).length;
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

export default function ParsingNarration({
  rawJson,
  dataSource,
  personaName,
  personaEmoji,
  onComplete,
  onReset,
}: ParsingNarrationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<NarrationStep[]>([]);
  const [progress, setProgress] = useState(0);
  const [showTrust, setShowTrust] = useState(false);
  const [done, setDone] = useState(false);
  const [modalView, setModalView] = useState<"steps" | "table">("steps");
  const [tableExpanded, setTableExpanded] = useState(false);
  const [matchSummary, setMatchSummary] = useState<{
    total: number;
    high: number;
    medium: number;
    lower: number;
  } | null>(null);
  const hasRun = useRef(false);
  const resultsRef = useRef<NarrationResults | null>(null);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const buildSteps = useCallback((): NarrationStep[] => {
    // Phase 1: Parse conversations
    const parsed = parseClaudeExport(rawJson);
    const totalMessages = parsed.reduce((s, c) => s + c.message_count, 0);
    const artifacts = countArtifacts(parsed);

    // Phase 2: Build profile + match skills
    const userProfile = buildHeuristicProfile(parsed);
    const recommendations = matchSkillsHeuristic(userProfile, SKILLS_CATALOG);
    const enriched = recommendations
      .map((rec) => ({
        ...rec,
        skill: SKILLS_CATALOG.find((s) => s.skill_id === rec.skill_id),
      }))
      .filter((r) => r.skill);

    // Store all results
    resultsRef.current = {
      conversations: parsed,
      stats: { conversations: parsed.length, messages: totalMessages, withArtifacts: artifacts },
      userProfile,
      recommendations: enriched,
    };

    // Build match summary counts
    const high = enriched.filter((r) => r.relevance_score >= 0.7).length;
    const medium = enriched.filter((r) => r.relevance_score >= 0.4 && r.relevance_score < 0.7).length;
    const lower = enriched.filter((r) => r.relevance_score > 0 && r.relevance_score < 0.4).length;

    setTimeout(() => setMatchSummary({ total: enriched.length, high, medium, lower }), 0);

    // Build step sequence
    const parseSteps: NarrationStep[] = dataSource === "persona"
      ? [
          { label: `Loading ${personaName}'s conversations` },
          { label: "Counting messages" },
          { label: "Reading conversation titles" },
          { label: "Building local summary" },
        ]
      : [
          { label: "Reading file structure" },
          { label: "Finding conversations" },
          { label: "Counting messages" },
          { label: "Reading conversation titles" },
          { label: "Building local summary" },
        ];

    // Analysis steps
    const analysisSteps: NarrationStep[] = [
      { label: "Building usage profile" },
      { label: "Matching against skills catalog" },
    ];

    return [...parseSteps, ...analysisSteps];
  }, [rawJson, dataSource, personaName]);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const builtSteps = buildSteps();
    setSteps(builtSteps);

    const totalSteps = builtSteps.length;
    const STEP_DELAY = dataSource === "persona" ? 550 : 600;

    builtSteps.forEach((_, i) => {
      setTimeout(() => {
        setCurrentStep(i + 1);
        setProgress(Math.round(((i + 1) / totalSteps) * 100));
        if (i >= 2) setShowTrust(true);
      }, (i + 1) * STEP_DELAY);
    });

    setTimeout(() => {
      setDone(true);
    }, (totalSteps + 1) * STEP_DELAY);
  }, [buildSteps, dataSource]);

  const handleViewConversations = () => {
    setModalView("table");
  };

  const handleBack = () => {
    setModalView("steps");
  };

  const handleProceed = () => {
    if (resultsRef.current) {
      onCompleteRef.current(resultsRef.current);
    }
  };

  const isSample = dataSource === "persona";

  const title =
    dataSource === "persona" && personaName
      ? `${personaEmoji || ""} Exploring ${personaName}'s history\u2026`
      : "Parsing your data\u2026";

  /* ── Build the match summary sentence ── */
  const renderMatchSentence = () => {
    if (!matchSummary || matchSummary.total === 0) return null;

    const segments: React.ReactNode[] = [];

    if (matchSummary.high > 0) {
      segments.push(
        <span key="strong">
          <span style={{ color: C.sageBright, fontWeight: 600 }}>
            {matchSummary.high} strong
          </span>
          {" (70%+)"}
        </span>
      );
    }

    if (matchSummary.medium > 0) {
      segments.push(
        <span key="partial">{matchSummary.medium} partial (40\u201369%)</span>
      );
    }

    if (matchSummary.lower > 0) {
      segments.push(
        <span key="exploratory">{matchSummary.lower} exploratory</span>
      );
    }

    const joined: React.ReactNode[] = [];
    segments.forEach((seg, i) => {
      if (i > 0) {
        joined.push(i === segments.length - 1 ? " and " : ", ");
      }
      joined.push(seg);
    });

    return (
      <div
        style={{
          fontSize: "15px",
          color: "#c8d8cf",
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: C.cream, fontWeight: 600 }}>
          {matchSummary.total} skills
        </strong>
        {" matched your usage \u2014 "}
        {joined}
      </div>
    );
  };

  /* ── Conversations table data ── */
  const conversations = resultsRef.current?.conversations ?? [];
  const hasMore = conversations.length > VISIBLE_ROWS;
  const visibleConvs = tableExpanded ? conversations : conversations.slice(0, VISIBLE_ROWS);

  /* ── Render View 1: Parsing steps ── */
  const renderStepsView = () => (
    <div key="steps" style={{ animation: "viewFadeIn 0.25s ease" }}>
      {/* Modal body */}
      <div style={{ padding: "36px 32px 32px" }}>
        {/* Title */}
        <div
          style={{
            fontFamily: sans,
            fontSize: "20px",
            fontWeight: 600,
            color: C.cream,
            textAlign: "center",
            marginBottom: "28px",
          }}
        >
          {title}
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
          {steps.map((step, i) => {
            const isComplete = i < currentStep;
            const isCurrent = i === currentStep - 1 && currentStep <= steps.length;

            return (
              <div
                key={i}
                className="reveal-up narration-step"
                style={{
                  display: i < currentStep ? "flex" : "none",
                  alignItems: "center",
                  gap: "10px",
                  fontFamily: sans,
                  fontSize: "14px",
                  color: "#d4e4d9",
                  animationDelay: `${i * 50}ms`,
                }}
              >
                {isComplete && !isCurrent ? (
                  <span style={{ color: C.sageBright, fontSize: "14px", flexShrink: 0, width: "16px", textAlign: "center" as const }}>{"\u2713"}</span>
                ) : (
                  <span
                    style={{
                      width: "7px",
                      height: "7px",
                      background: C.sageBright,
                      borderRadius: "50%",
                      flexShrink: 0,
                      margin: "0 4.5px",
                    }}
                  />
                )}
                <span>{step.label}{isComplete && !isCurrent ? "" : "..."}</span>
              </div>
            );
          })}

          {/* Blinking cursor while in progress */}
          {!done && currentStep > 0 && (
            <div style={{ color: "rgba(255,255,255,0.3)", paddingLeft: "26px" }}>
              <span className="blink">{"\u2588"}</span>
            </div>
          )}
        </div>

        {/* ── Match summary sentence (shown when done) ── */}
        {done && matchSummary && matchSummary.total > 0 && (
          <div
            className="reveal-up"
            style={{
              borderTop: "1px solid rgba(253,246,236,0.08)",
              paddingTop: "20px",
              marginBottom: "4px",
            }}
          >
            <div
              style={{
                fontFamily: mono,
                fontSize: "10px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: C.sage,
                marginBottom: "10px",
              }}
            >
              Skill Matches Found
            </div>
            {renderMatchSentence()}
          </div>
        )}

        {/* Trust line (shown during parsing, hidden when done) */}
        {showTrust && !done && (
          <div
            className="reveal-up"
            style={{
              paddingTop: "12px",
              borderTop: "1px solid rgba(253,246,236,0.08)",
              fontFamily: sans,
              fontSize: "12px",
              color: "rgba(255,255,255,0.5)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            {dataSource === "persona"
              ? "Sample data loaded locally. No network requests."
              : "All parsing happens in your browser. No network requests."}
          </div>
        )}
      </div>

      {/* Modal footer — View conversations button */}
      <div style={{ padding: "0 32px 32px" }}>
        <button
          onClick={handleViewConversations}
          disabled={!done}
          style={{
            display: "block",
            width: "100%",
            padding: "14px 0",
            background: done ? C.green : "rgba(255,255,255,0.06)",
            color: done ? C.cream : "rgba(253,246,236,0.3)",
            border: done
              ? "1px solid rgba(253,246,236,0.1)"
              : "1px solid rgba(255,255,255,0.06)",
            borderRadius: "10px",
            fontFamily: sans,
            fontSize: "15px",
            fontWeight: 600,
            textAlign: "center" as const,
            cursor: done ? "pointer" : "default",
            transition: "all 0.3s ease",
            opacity: done ? 1 : 0.6,
          }}
        >
          {done ? "View conversations \u2192" : "Processing\u2026"}
        </button>
      </div>
    </div>
  );

  /* ── Render View 2: Conversations table ── */
  const renderTableView = () => (
    <div key="table" style={{ animation: "viewFadeIn 0.25s ease" }}>
      <div style={{ padding: "28px 32px 0" }}>
        {/* Back button */}
        <button
          onClick={handleBack}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: sans,
            fontSize: "13px",
            color: C.sage,
            padding: "0",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.sage} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to summary
        </button>

        {/* Title */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "20px" }}>
          <div
            style={{
              fontFamily: sans,
              fontSize: "20px",
              fontWeight: 600,
              color: C.cream,
            }}
          >
            Conversations Analyzed
          </div>
          <span style={{ fontFamily: mono, fontSize: "11px", color: C.sage }}>
            {conversations.length} total
          </span>
        </div>

        {/* Sample badge */}
        {isSample && personaName && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "3px 10px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(253,246,236,0.1)",
              borderRadius: "100px",
              fontFamily: mono,
              fontSize: "10px",
              fontWeight: 500,
              color: C.sage,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "16px",
            }}
          >
            {personaName} · sample
          </span>
        )}
      </div>

      {/* Table */}
      <div style={{ padding: "0 32px" }}>
        <div
          style={{
            border: "1px solid rgba(253,246,236,0.1)",
            borderRadius: "10px",
            overflow: "hidden",
            marginBottom: "24px",
          }}
        >
          {/* Column headers */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 60px 70px",
              gap: "8px",
              padding: "10px 16px",
              borderBottom: "1px solid rgba(253,246,236,0.08)",
              fontFamily: mono,
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: C.sage,
            }}
          >
            <span>Title</span>
            <span style={{ textAlign: "center" }}>Msgs</span>
            <span style={{ textAlign: "right" }}>Date</span>
          </div>

          {/* Rows */}
          <div className={tableExpanded ? "conversation-list" : undefined}>
            {visibleConvs.map((conv, i) => (
              <div
                key={conv.id}
                className="reveal-up"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 60px 70px",
                  gap: "8px",
                  padding: "10px 16px",
                  borderBottom:
                    i < visibleConvs.length - 1
                      ? "1px solid rgba(253,246,236,0.06)"
                      : "none",
                  animationDelay: `${Math.min(i * 30, 600)}ms`,
                }}
              >
                <span
                  style={{
                    fontFamily: sans,
                    fontSize: "13px",
                    color: C.cream,
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
                    color: C.sage,
                    textAlign: "center",
                  }}
                >
                  {conv.message_count}
                </span>
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: "11px",
                    color: C.sage,
                    textAlign: "right",
                  }}
                >
                  {formatRelativeDate(conv.created_at)}
                </span>
              </div>
            ))}
          </div>

          {/* Show all / Show less */}
          {hasMore && (
            <button
              onClick={() => setTableExpanded(!tableExpanded)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                padding: "10px 16px",
                background: "rgba(255,255,255,0.04)",
                border: "none",
                borderTop: "1px solid rgba(253,246,236,0.06)",
                cursor: "pointer",
                fontFamily: sans,
                fontSize: "12px",
                fontWeight: 500,
                color: C.sageBright,
                transition: "background 0.15s",
              }}
            >
              {tableExpanded
                ? "Show less"
                : `Show all ${conversations.length} conversations`}
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke={C.sageBright}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: tableExpanded ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s",
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Footer — action buttons */}
      <div
        className="preview-actions"
        style={{
          padding: "0 32px 32px",
          display: "flex",
          gap: "12px",
          alignItems: "center",
        }}
      >
        <button
          onClick={onReset}
          style={{
            padding: "12px 16px",
            background: "none",
            color: C.sage,
            border: `1px solid rgba(253,246,236,0.12)`,
            borderRadius: "10px",
            fontFamily: sans,
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "border-color 0.15s",
            whiteSpace: "nowrap",
          }}
        >
          {isSample ? "\u2190 Different persona" : "Remove file"}
        </button>

        <button
          onClick={handleProceed}
          style={{
            flex: 1,
            padding: "14px 24px",
            background: `linear-gradient(135deg, ${C.green}, #3d7a56)`,
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
            ? `See ${personaName}'s suggested skills \u2192`
            : "See suggested skills \u2192"}
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="narration-modal-backdrop"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        animation: "fadeIn 0.25s ease",
      }}
    >
      {/* Frosted backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(45,74,62,0.65)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      />

      {/* Modal — scrollable container */}
      <div
        className="narration-modal"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "460px",
          maxHeight: modalView === "table" ? "600px" : "520px",
          overflowY: "auto",
          background: C.greenDeep,
          borderRadius: "16px",
          boxShadow: "0 24px 48px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          animation: "modalSlideUp 0.3s ease",
          transition: "max-height 0.3s ease",
        }}
      >
        {/* Progress bar */}
        <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", flexShrink: 0 }}>
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${C.sage}, ${C.sageBright})`,
              transition: "width 0.5s ease",
            }}
          />
        </div>

        {/* View content */}
        {modalView === "steps" ? renderStepsView() : renderTableView()}
      </div>
    </div>
  );
}
