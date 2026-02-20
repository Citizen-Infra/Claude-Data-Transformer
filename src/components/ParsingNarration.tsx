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
  creamMuted: "rgba(253,246,236,0.7)",
  creamDim: "rgba(253,246,236,0.35)",
  sageBright: "#6DBF73",
  sage: "#8BA898",
};

const mono = "'DM Mono', monospace";
const sans = "'DM Sans', sans-serif";

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
}

interface NarrationStep {
  label: string;
  detail: string;
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

export default function ParsingNarration({
  rawJson,
  dataSource,
  personaName,
  personaEmoji,
  onComplete,
}: ParsingNarrationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<NarrationStep[]>([]);
  const [progress, setProgress] = useState(0);
  const [showTrust, setShowTrust] = useState(false);
  const [done, setDone] = useState(false);
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
          { label: `Loading ${personaName}'s conversations`, detail: `${parsed.length} fictional conversations` },
          { label: "Counting messages", detail: `${totalMessages} messages total` },
          { label: "Reading conversation titles", detail: "Extracting metadata only" },
          { label: "Building local summary", detail: "Nothing has left your browser" },
        ]
      : [
          { label: "Reading file structure", detail: "Validating JSON format" },
          { label: "Finding conversations", detail: `${parsed.length} found` },
          { label: "Counting messages", detail: `${totalMessages} messages across all conversations` },
          { label: "Reading conversation titles", detail: "Extracting metadata only — not message content" },
          { label: "Building local summary", detail: "Nothing has left your browser" },
        ];

    // Analysis steps
    const analysisSteps: NarrationStep[] = [
      { label: "Building usage profile", detail: `${userProfile.primary_domains.length} domains, ${userProfile.work_patterns.length} patterns` },
      { label: "Matching against skills catalog", detail: `${enriched.length} skills matched` },
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

  const handleGotIt = () => {
    if (resultsRef.current) {
      onCompleteRef.current(resultsRef.current);
    }
  };

  const title =
    dataSource === "persona" && personaName
      ? `${personaEmoji || ""} Exploring ${personaName}'s history…`
      : "Parsing your data…";

  /* ── Build the match summary sentence ── */
  const renderMatchSentence = () => {
    if (!matchSummary || matchSummary.total === 0) return null;

    // Always show both strong and partial buckets
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
        <span key="partial">{matchSummary.medium} partial (40–69%)</span>
      );
    }

    if (matchSummary.lower > 0) {
      segments.push(
        <span key="exploratory">{matchSummary.lower} exploratory</span>
      );
    }

    // Join with " and " between last two, ", " between others
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
          color: "rgba(253,246,236,0.55)",
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: C.cream, fontWeight: 600 }}>
          {matchSummary.total} skills
        </strong>
        {" matched your usage — "}
        {joined}
      </div>
    );
  };

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

      {/* Modal */}
      <div
        className="narration-modal"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "480px",
          background: C.greenDeep,
          borderRadius: "16px",
          boxShadow: "0 24px 48px rgba(0,0,0,0.3)",
          overflow: "hidden",
          animation: "modalSlideUp 0.3s ease",
        }}
      >
        {/* Progress bar */}
        <div style={{ height: "3px", background: "rgba(255,255,255,0.06)" }}>
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${C.sage}, ${C.sageBright})`,
              transition: "width 0.5s ease",
            }}
          />
        </div>

        <div style={{ padding: "32px 32px 28px" }}>
          {/* Title */}
          <div
            style={{
              fontFamily: sans,
              fontSize: "20px",
              fontWeight: 600,
              color: C.cream,
              textAlign: "center",
              marginBottom: "24px",
            }}
          >
            {title}
          </div>

          {/* Steps */}
          <div style={{ fontFamily: sans, fontSize: "14px" }}>
            {steps.map((step, i) => {
              const isComplete = i < currentStep;
              const isCurrent = i === currentStep - 1 && currentStep <= steps.length;

              return (
                <div
                  key={i}
                  className="reveal-up narration-step"
                  style={{
                    display: i < currentStep ? "flex" : "none",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    gap: "8px",
                    padding: "6px 0",
                    animationDelay: `${i * 50}ms`,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "8px",
                      color: C.creamMuted,
                      minWidth: 0,
                    }}
                  >
                    <span style={{ flexShrink: 0 }}>
                      {isComplete && !isCurrent ? (
                        <span style={{ color: C.sageBright }}>✓</span>
                      ) : (
                        <span
                          style={{
                            display: "inline-block",
                            width: "6px",
                            height: "6px",
                            background: C.sageBright,
                            borderRadius: "50%",
                            position: "relative",
                            top: "-1px",
                          }}
                        />
                      )}
                    </span>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                      {step.label}{isComplete && !isCurrent ? "" : "…"}
                    </span>
                  </span>
                  <span
                    className="narration-step-detail"
                    style={{
                      fontFamily: mono,
                      fontSize: "12px",
                      color: C.creamDim,
                      textAlign: "right",
                      flexShrink: 0,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {step.detail}
                  </span>
                </div>
              );
            })}

            {/* Blinking cursor while in progress */}
            {!done && currentStep > 0 && (
              <div style={{ color: "rgba(255,255,255,0.3)", padding: "2px 0" }}>
                <span className="blink">▊</span>
              </div>
            )}
          </div>

          {/* ── Match summary sentence (shown when done) ── */}
          {done && matchSummary && matchSummary.total > 0 && (
            <div
              className="reveal-up"
              style={{
                marginTop: "20px",
                paddingTop: "16px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                style={{
                  fontFamily: mono,
                  fontSize: "10px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(253,246,236,0.3)",
                  marginBottom: "12px",
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
                marginTop: "16px",
                paddingTop: "12px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
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

          {/* "Got it" button */}
          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <button
              onClick={handleGotIt}
              disabled={!done}
              style={{
                width: "200px",
                padding: "12px 0",
                background: done ? C.green : "rgba(255,255,255,0.06)",
                color: done ? C.cream : "rgba(253,246,236,0.3)",
                border: done
                  ? "1px solid rgba(255,255,255,0.1)"
                  : "1px solid rgba(255,255,255,0.06)",
                borderRadius: "10px",
                fontFamily: sans,
                fontSize: "15px",
                fontWeight: 600,
                cursor: done ? "pointer" : "default",
                transition: "all 0.3s ease",
                opacity: done ? 1 : 0.6,
              }}
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
