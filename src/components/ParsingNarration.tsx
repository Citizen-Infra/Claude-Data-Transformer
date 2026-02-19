import { useState, useEffect, useRef, useCallback } from "react";
import { parseClaudeExport } from "../lib/parseClaudeExport";
import { buildHeuristicProfile, matchSkillsHeuristic } from "../lib/heuristicAnalysis";
import { SKILLS_CATALOG } from "../data/skillsCatalog";
import type { ClaudeConversation, ParsedConversation, UserProfile, EnrichedRecommendation } from "../lib/types";

const C = {
  green: "#1a3a2a",
  greenMuted: "#2d5a3f",
  accent: "#3d7a56",
  cream: "#f5f0e8",
  warmGray: "#5e594f",
};

const mono = "'DM Mono', 'IBM Plex Mono', monospace";
const sans = "'DM Sans', 'Helvetica Neue', sans-serif";

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
  const [matchSummary, setMatchSummary] = useState<{ total: number; buckets: { label: string; count: number }[] } | null>(null);
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

    // Build match summary buckets for display
    const high = enriched.filter((r) => r.relevance_score >= 0.7).length;
    const medium = enriched.filter((r) => r.relevance_score >= 0.4 && r.relevance_score < 0.7).length;
    const lower = enriched.filter((r) => r.relevance_score > 0 && r.relevance_score < 0.4).length;

    const buckets: { label: string; count: number }[] = [];
    if (high > 0) buckets.push({ label: "70%+ match", count: high });
    if (medium > 0) buckets.push({ label: "40–69%", count: medium });
    if (lower > 0) buckets.push({ label: "under 40%", count: lower });

    // Stash for later reveal
    setTimeout(() => setMatchSummary({ total: enriched.length, buckets }), 0);

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
        background: "rgba(0, 0, 0, 0.5)",
        padding: "24px",
        animation: "fadeIn 0.25s ease",
      }}
    >
      <div
        className="narration-modal"
        style={{
          width: "100%",
          maxWidth: "540px",
          background: C.green,
          borderRadius: "16px",
          overflow: "hidden",
          animation: "modalSlideUp 0.3s ease",
        }}
      >
        {/* Progress bar */}
        <div style={{ height: "3px", background: "rgba(255,255,255,0.1)" }}>
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${C.greenMuted}, ${C.accent})`,
              transition: "width 0.5s ease",
            }}
          />
        </div>

        <div style={{ padding: "28px 28px 24px" }}>
          {/* Title */}
          <div
            style={{
              fontFamily: sans,
              fontSize: "17px",
              fontWeight: 600,
              color: "rgba(255,255,255,0.9)",
              textAlign: "center",
              marginBottom: "24px",
            }}
          >
            {title}
          </div>

          {/* Steps */}
          <div style={{ fontFamily: mono, fontSize: "12px", lineHeight: 2 }}>
            {steps.map((step, i) => {
              const isComplete = i < currentStep;
              const isCurrent = i === currentStep - 1 && currentStep <= steps.length;

              return (
                <div
                  key={i}
                  className="reveal-up"
                  style={{
                    display: i < currentStep ? "flex" : "none",
                    justifyContent: "space-between",
                    gap: "16px",
                    animationDelay: `${i * 50}ms`,
                  }}
                >
                  <span
                    style={{
                      color: isComplete ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)",
                    }}
                  >
                    <span
                      style={{
                        color: isComplete && !isCurrent ? "#52b788" : "#88E7BB",
                        marginRight: "8px",
                      }}
                    >
                      {isComplete && !isCurrent ? "✓" : "●"}
                    </span>
                    {step.label}…
                  </span>
                  <span
                    style={{
                      color: "rgba(255,255,255,0.4)",
                      textAlign: "right",
                      flexShrink: 0,
                    }}
                  >
                    {step.detail}
                  </span>
                </div>
              );
            })}

            {/* Blinking cursor while in progress */}
            {!done && currentStep > 0 && (
              <div style={{ color: "rgba(255,255,255,0.3)" }}>
                <span className="blink">▊</span>
              </div>
            )}
          </div>

          {/* Match summary (shown when done) */}
          {done && matchSummary && matchSummary.total > 0 && (
            <div
              className="reveal-up"
              style={{
                marginTop: "16px",
                padding: "14px 16px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
              }}
            >
              <div
                style={{
                  fontFamily: mono,
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.5)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "10px",
                }}
              >
                Skill matches found
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {matchSummary.buckets.map((bucket, i) => (
                  <span
                    key={i}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "4px 12px",
                      background: i === 0 ? "rgba(82,183,136,0.2)" : "rgba(255,255,255,0.08)",
                      border: `1px solid ${i === 0 ? "rgba(82,183,136,0.3)" : "rgba(255,255,255,0.1)"}`,
                      borderRadius: "6px",
                      fontFamily: mono,
                      fontSize: "11px",
                      color: i === 0 ? "#88E7BB" : "rgba(255,255,255,0.6)",
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: "13px" }}>{bucket.count}</span>
                    {bucket.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Trust line (shown during parsing, hidden when done to make room for match summary) */}
          {showTrust && !done && (
            <div
              className="reveal-up"
              style={{
                marginTop: "16px",
                paddingTop: "12px",
                borderTop: "1px solid rgba(255,255,255,0.1)",
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
                padding: "12px 40px",
                background: done ? C.greenMuted : "rgba(255,255,255,0.08)",
                color: done ? C.cream : "rgba(255,255,255,0.3)",
                border: done
                  ? `1px solid ${C.accent}`
                  : "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                fontFamily: sans,
                fontSize: "14px",
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
