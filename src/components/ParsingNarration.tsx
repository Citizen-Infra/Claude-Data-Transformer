import { useState, useEffect, useRef, useCallback } from "react";
import { parseClaudeExport } from "../lib/parseClaudeExport";
import type { ClaudeConversation, ParsedConversation } from "../lib/types";

const C = {
  dark: "#1a3a2a",
  mid: "#2d5a3f",
  accent: "#3d7a56",
  cream: "#f7f5f0",
  subtle: "#888",
};

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
  const hasRun = useRef(false);
  const parsedRef = useRef<ParsedConversation[] | null>(null);
  const statsRef = useRef<UploadStats | null>(null);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const buildSteps = useCallback((): NarrationStep[] => {
    // Parse immediately so we have real counts
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
    const STEP_DELAY = dataSource === "persona" ? 380 : 400;

    // Animate steps one by one
    builtSteps.forEach((_, i) => {
      setTimeout(() => {
        setCurrentStep(i + 1);
        setProgress(Math.round(((i + 1) / totalSteps) * 100));

        // Show trust line at step 3+
        if (i >= 2) {
          setShowTrust(true);
        }
      }, (i + 1) * STEP_DELAY);
    });

    // Complete after all steps + a brief pause
    setTimeout(() => {
      if (parsedRef.current && statsRef.current) {
        onCompleteRef.current(parsedRef.current, statsRef.current);
      }
    }, (totalSteps + 1) * STEP_DELAY + 200);
  }, [buildSteps, dataSource]);

  return (
    <div
      style={{
        background: C.dark,
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
      {/* Progress bar */}
      <div
        style={{
          height: "3px",
          background: "rgba(255,255,255,0.1)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${C.mid}, ${C.accent})`,
            transition: "width 0.4s ease",
          }}
        />
      </div>

      <div style={{ padding: "28px 24px" }}>
        {/* Persona header (sample mode only) */}
        {dataSource === "persona" && personaName && (
          <div
            style={{
              textAlign: "center",
              marginBottom: "20px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            <span style={{ fontSize: "24px", display: "block", marginBottom: "6px" }}>
              {personaEmoji}
            </span>
            Exploring {personaName}'s Claude history…
          </div>
        )}

        {/* Steps */}
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
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
          {currentStep <= steps.length && currentStep > 0 && (
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
              fontFamily: "'DM Sans', sans-serif",
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
    </div>
  );
}
