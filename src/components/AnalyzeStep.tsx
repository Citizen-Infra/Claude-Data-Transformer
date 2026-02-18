import { useState, useEffect, useRef, useCallback } from "react";
import { buildUserProfile, matchSkills } from "../lib/anthropicApi";
import { buildAnalysisPrompt, buildMatchingPrompt } from "../lib/prompts";
import { buildHeuristicProfile, matchSkillsHeuristic } from "../lib/heuristicAnalysis";
import { getDateRange } from "../lib/parseClaudeExport";
import { SKILLS_CATALOG } from "../data/skillsCatalog";
import TerminalLog from "./TerminalLog";
import type {
  ParsedConversation,
  AnalysisResults,
  UserProfile,
  SkillRecommendation,
  LogEntry,
} from "../lib/types";

interface AnalyzeStepProps {
  conversations: ParsedConversation[];
  apiKey: string;
  useAI: boolean;
  onComplete: (results: AnalysisResults) => void;
}

type Status = "starting" | "profiling" | "matching" | "done" | "error";

const C = {
  dark: "#1a3a2a",
  mid: "#2d5a3f",
  accent: "#3d7a56",
  cream: "#f7f5f0",
  ink: "#1a1a1a",
  body: "#555",
  subtle: "#888",
  border: "#e0e0e0",
};

export default function AnalyzeStep({
  conversations,
  apiKey,
  useAI,
  onComplete,
}: AnalyzeStepProps) {
  const [status, setStatus] = useState<Status>("starting");
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState<LogEntry[]>([]);
  const hasRun = useRef(false);

  const addLog = useCallback(
    (msg: string) =>
      setLog((prev) => [
        ...prev,
        { time: new Date().toLocaleTimeString(), msg },
      ]),
    []
  );

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const runHeuristic = async () => {
      try {
        addLog(`Found ${conversations.length} conversations to analyze`);
        setProgress(15);

        addLog("Running local pattern analysis...");
        setStatus("profiling");
        setProgress(30);

        // Small delay so the user sees the progress
        await new Promise((r) => setTimeout(r, 600));

        const userProfile = buildHeuristicProfile(conversations);

        addLog(
          `Profile: ${userProfile.primary_domains?.length || 0} domains, ${
            userProfile.work_patterns?.length || 0
          } patterns`
        );
        setProgress(60);

        addLog("Matching against skills commons...");
        setStatus("matching");
        setProgress(75);

        await new Promise((r) => setTimeout(r, 400));

        const recommendations = matchSkillsHeuristic(userProfile, SKILLS_CATALOG);

        const enriched = recommendations
          .map((rec) => ({
            ...rec,
            skill: SKILLS_CATALOG.find((s) => s.skill_id === rec.skill_id),
          }))
          .filter((r) => r.skill);

        addLog(`Matched ${enriched.length} skills`);
        setProgress(100);
        setStatus("done");
        addLog("Analysis complete (local heuristics)");

        setTimeout(
          () =>
            onComplete({
              userProfile,
              recommendations: enriched,
              dateRange: getDateRange(conversations),
              totalConversations: conversations.length,
              totalMessages: conversations.reduce(
                (s, c) => s + c.message_count,
                0
              ),
            }),
          500
        );
      } catch (e) {
        addLog(`Error: ${e instanceof Error ? e.message : "Unknown error"}`);
        setStatus("error");
      }
    };

    const runAI = async () => {
      try {
        addLog(`Found ${conversations.length} conversations to analyze`);
        setProgress(10);

        addLog("Sampling conversations and building analysis prompt...");
        setStatus("profiling");
        setProgress(20);

        const profilePrompt = buildAnalysisPrompt(conversations);
        const userProfile = await buildUserProfile<UserProfile>(
          apiKey,
          profilePrompt
        );

        addLog(
          `Profile: ${userProfile.primary_domains?.length || 0} domains, ${
            userProfile.work_patterns?.length || 0
          } patterns`
        );
        setProgress(55);

        addLog("Matching against skills commons...");
        setStatus("matching");
        setProgress(65);

        const matchPrompt = buildMatchingPrompt(userProfile, SKILLS_CATALOG);
        const recommendations = await matchSkills<SkillRecommendation[]>(
          apiKey,
          matchPrompt
        );

        addLog(`Matched ${recommendations.length} skills`);
        setProgress(95);

        const enriched = recommendations
          .map((rec) => ({
            ...rec,
            skill: SKILLS_CATALOG.find((s) => s.skill_id === rec.skill_id),
          }))
          .filter((r) => r.skill);

        setProgress(100);
        setStatus("done");
        addLog("Analysis complete (AI-powered)");

        setTimeout(
          () =>
            onComplete({
              userProfile,
              recommendations: enriched,
              dateRange: getDateRange(conversations),
              totalConversations: conversations.length,
              totalMessages: conversations.reduce(
                (s, c) => s + c.message_count,
                0
              ),
            }),
          500
        );
      } catch (e) {
        addLog(`Error: ${e instanceof Error ? e.message : "Unknown error"}`);
        setStatus("error");
      }
    };

    if (useAI) {
      addLog("Mode: AI-powered analysis (Anthropic API)");
      runAI();
    } else {
      addLog("Mode: Local heuristic analysis");
      runHeuristic();
    }
  }, [conversations, apiKey, useAI, onComplete, addLog]);

  const statusLabel =
    status === "profiling"
      ? "Building profile"
      : status === "matching"
      ? "Matching skills"
      : status === "done"
      ? "Complete"
      : status === "error"
      ? "Error"
      : "Starting";

  return (
    <div
      style={{
        padding: "64px 24px",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "11px",
          fontWeight: 500,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          color: C.mid,
          marginBottom: "12px",
        }}
      >
        Analyzing
      </div>
      <h2
        style={{
          fontFamily: "'DM Serif Display', Georgia, serif",
          fontWeight: 400,
          color: C.ink,
          lineHeight: 1.15,
          margin: "0 0 16px 0",
          fontSize: "32px",
        }}
      >
        {status === "error"
          ? "Something went wrong."
          : status === "done"
          ? "Analysis complete."
          : "Analyzing your conversations."}
      </h2>
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "16px",
          lineHeight: 1.7,
          color: C.body,
          maxWidth: "560px",
          marginBottom: "32px",
        }}
      >
        {status === "error"
          ? "Check the log below for details. Reload to try again."
          : useAI
          ? "Claude is reading your conversation patterns and matching them against the skills commons. This usually takes 15\u201330 seconds."
          : "Scanning your conversation patterns locally and matching them against the skills commons."}
      </p>

      {/* Progress bar */}
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            height: "6px",
            background: C.cream,
            borderRadius: "100px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background:
                status === "error"
                  ? "#991b1b"
                  : `linear-gradient(90deg, ${C.mid}, ${C.accent})`,
              borderRadius: "100px",
              transition: "width 0.5s ease",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "10px",
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: C.subtle,
            }}
          >
            {statusLabel}
          </span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px",
              color: C.subtle,
            }}
          >
            {progress}%
          </span>
        </div>
      </div>

      {/* Terminal */}
      <TerminalLog
        log={log}
        showCursor={status !== "done" && status !== "error"}
      />
    </div>
  );
}
