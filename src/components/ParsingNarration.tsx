import { useState, useEffect, useRef, useCallback } from "react";
import { parseClaudeExport } from "../lib/parseClaudeExport";
import type { ClaudeConversation, ParsedConversation } from "../lib/types";

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

interface ParsingNarrationProps {
  rawJson: ClaudeConversation[];
  dataSource: "file" | "persona";
  personaName?: string;
  personaEmoji?: string;
  onComplete: (conversations: ParsedConversation[], stats: UploadStats) => void;
}

interface NarrationStep {
  label: string;
  detail: string;
}

/** Simple artifact heuristic — checks for code blocks in assistant messages */
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
  const hasRun = useRef(false);
  const parsedRef = useRef<ParsedConversation[] | null>(null);
  const statsRef = useRef<UploadStats | null>(null);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const buildSteps = useCallback((): NarrationStep[] => {
    const parsed = parseClaudeExport(rawJson);
    const totalMessages = parsed.reduce((s, c) => s + c.message_count, 0);
    const artifacts = countArtifacts(parsed);

    parsedRef.current = parsed;
    statsRef.current = {
      conversations: parsed.length,
      messages: totalMessages,
      withArtifacts: artifacts,
    };

    if (dataSource === "persona") {
      return [
        {
          label: `Loading ${personaName}'s conversations`,
          detail: `${parsed.length} fictional conversations`,
        },
        {
          label: "Counting messages",
          detail: `${totalMessages} messages total`,
        },
        {
          label: "Reading conversation titles",
          detail: "Extracting metadata only",
        },
        {
          label: "Building local summary",
          detail: "Nothing has left your browser",
        },
      ];
    }

    return [
      {
        label: "Reading file structure",
        detail: "Validating JSON format",
      },
      {
        label: "Finding conversations",
        detail: `${parsed.length} found`,
      },
      {
        label: "Counting messages",
        detail: `${totalMessages} messages across all conversations`,
      },
      {
        label: "Reading conversation titles",
        detail: "Extracting metadata only — not message content",
      },
      {
        label: "Building local summary",
        detail: "Nothing has left your browser",
      },
    ];
  }, [rawJson, dataSource, personaName]);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const builtSteps = buildSteps();
    setSteps(builtSteps);

    const totalSteps = builtSteps.length;
    const STEP_DELAY = dataSource === "persona" ? 600 : 650;

    builtSteps.forEach((_, i) => {
      setTimeout(() => {
        setCurrentStep(i + 1);
        setProgress(Math.round(((i + 1) / totalSteps) * 100));

        if (i >= 2) {
          setShowTrust(true);
        }
      }, (i + 1) * STEP_DELAY);
    });

    // Mark as done after all steps (no auto-complete — user must click "Got it")
    setTimeout(() => {
      setDone(true);
    }, (totalSteps + 1) * STEP_DELAY);
  }, [buildSteps, dataSource]);

  const handleGotIt = () => {
    if (parsedRef.current && statsRef.current) {
      onCompleteRef.current(parsedRef.current, statsRef.current);
    }
  };

  // Title text
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
          maxWidth: "520px",
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
          <div
            style={{
              fontFamily: mono,
              fontSize: "12px",
              lineHeight: 2,
            }}
          >
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
                      color: isComplete
                        ? "rgba(255,255,255,0.8)"
                        : "rgba(255,255,255,0.4)",
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

          {/* Trust line */}
          {showTrust && (
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
