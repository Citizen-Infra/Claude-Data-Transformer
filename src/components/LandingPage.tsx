import { useState, useRef, useCallback } from "react";
import { getDateRange } from "../lib/parseClaudeExport";
import { getPersonaById } from "../data/samplePersonas";
import { downloadPersonaExport } from "../lib/generatePersonaExport";
import ParsingNarration from "./ParsingNarration";
import type { NarrationResults } from "./ParsingNarration";
import PersonaPicker from "./PersonaPicker";
import DevToolsPrompt from "./DevToolsPrompt";
import SkillBuilderCard from "./SkillBuilderCard";
import type { ClaudeConversation, AnalysisResults, AppView } from "../lib/types";

interface LandingPageProps {
  onDataReady: (results: AnalysisResults) => void;
  onNavigate: (view: AppView) => void;
}

/* ── Design tokens ── */
const C = {
  green: "#1a3a2a",
  greenMuted: "#2d5a3f",
  accent: "#3d7a56",
  greenLight: "#c8ddd0",
  greenPale: "#e8f0eb",
  cream: "#f5f0e8",
  creamDark: "#ebe5d9",
  surface: "#fff",
  cardBg: "#e8f0eb",
  border: "#d8d2c6",
  borderLight: "#e8e2d6",
  cardBorder: "#d8d8d8",
  ink: "#1a1a18",
  text: "#1a1a18",
  textMuted: "#4d4943",
  body: "#555",
  warmGray: "#5e594f",
  warmGrayLight: "#76716a",
  subtle: "#888",
  white: "#ffffff",
};

const mono = "'DM Mono', 'IBM Plex Mono', monospace";
const sans = "'DM Sans', 'Helvetica Neue', sans-serif";

const sectionLabel: React.CSSProperties = {
  fontFamily: mono,
  fontSize: "10.5px",
  fontWeight: 500,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: C.warmGray,
  marginBottom: "12px",
};

const headline: React.CSSProperties = {
  fontFamily: "'DM Serif Display', Georgia, serif",
  fontWeight: 400,
  color: C.ink,
  lineHeight: 1.15,
  margin: "0 0 16px 0",
};

const bodyText: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "16px",
  lineHeight: 1.7,
  color: C.body,
  maxWidth: "560px",
};

/* ── Phase types ── */
type UploadPhase = "upload" | "narrating";
type DataSource = "file" | "persona" | null;

/* ── Main LandingPage ── */
export default function LandingPage({ onDataReady, onNavigate }: LandingPageProps) {
  // Phase state machine
  const [phase, setPhase] = useState<UploadPhase>("upload");
  const [dataSource, setDataSource] = useState<DataSource>(null);
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);

  // Upload state
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [hoverPrivacyLink, setHoverPrivacyLink] = useState(false);

  // Raw JSON (passed to narration modal)
  const [rawJson, setRawJson] = useState<ClaudeConversation[] | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  // ── Handle real file upload ──
  const handleFile = useCallback(async (file: File) => {
    setUploadError(null);
    if (file.name.endsWith(".zip")) {
      setUploadError(
        "Please extract the ZIP first and upload the conversations.json file inside it."
      );
      return;
    }
    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);
      const arr: ClaudeConversation[] = Array.isArray(jsonData) ? jsonData : [jsonData];
      setRawJson(arr);
      setDataSource("file");
      setSelectedPersona(null);
      setPhase("narrating");
    } catch {
      setUploadError(
        "Couldn't parse that file. Make sure it's the conversations.json from your Claude export."
      );
    }
  }, []);

  // ── Handle persona "Try demo" ──
  const handleTryDemo = useCallback((personaId: string) => {
    const persona = getPersonaById(personaId);
    if (!persona) return;
    setRawJson(persona.conversations);
    setDataSource("persona");
    setSelectedPersona(personaId);
    setPhase("narrating");
    setUploadError(null);
  }, []);

  // ── Handle persona "Download .json" ──
  const handleDownload = useCallback((personaId: string) => {
    const persona = getPersonaById(personaId);
    if (!persona) return;
    downloadPersonaExport(
      persona.conversations,
      `conversations-${personaId}-sample.json`
    );
  }, []);

  // ── Handle narration completion (proceed straight to results) ──
  const handleNarrationComplete = useCallback(
    (results: NarrationResults) => {
      const dr = getDateRange(results.conversations);
      onDataReady({
        userProfile: results.userProfile,
        recommendations: results.recommendations,
        dateRange: dr,
        totalConversations: results.conversations.length,
        totalMessages: results.conversations.reduce((s, c) => s + c.message_count, 0),
      });
    },
    [onDataReady]
  );

  // ── Reset to upload phase ──
  const handleReset = useCallback(() => {
    setPhase("upload");
    setDataSource(null);
    setSelectedPersona(null);
    setRawJson(null);
    setUploadError(null);
  }, []);

  // Persona info for display
  const persona = selectedPersona ? getPersonaById(selectedPersona) : null;

  return (
    <div>
      {/* ─── Hero ─── */}
      <section
        style={{
          background: C.green,
          padding: "100px 32px 80px",
          textAlign: "center",
        }}
      >
        {/* Eyebrow */}
        <div style={{
          fontFamily: mono,
          fontSize: "11px",
          color: "#7dba96",
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          marginBottom: "20px",
        }}>
          Improve how you work
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 700,
            color: C.cream,
            lineHeight: 1.12,
            letterSpacing: "-0.01em",
            maxWidth: "700px",
            margin: "0 auto 24px",
          }}
        >
          Find the Claude Skills you didn't know you needed.
        </h1>

        {/* Subhead */}
        <p
          style={{
            fontFamily: sans,
            fontSize: "17px",
            color: "#b8cfc0",
            lineHeight: 1.65,
            maxWidth: "540px",
            margin: "0 auto",
          }}
        >
          Upload your Claude history. We'll analyze your patterns and
          recommend Skills that make Claude work harder for you.
        </p>

        {/* Privacy pill link */}
        <a
          href="#how-we-keep-it-private"
          onMouseEnter={() => setHoverPrivacyLink(true)}
          onMouseLeave={() => setHoverPrivacyLink(false)}
          className="privacy-pill"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap" as const,
            gap: "6px 10px",
            marginTop: "20px",
            padding: "12px 22px",
            background: hoverPrivacyLink
              ? "rgba(125, 186, 150, 0.2)"
              : "rgba(125, 186, 150, 0.12)",
            border: hoverPrivacyLink
              ? "1px solid rgba(125, 186, 150, 0.4)"
              : "1px solid rgba(125, 186, 150, 0.25)",
            borderRadius: "10px",
            textDecoration: "none",
            cursor: "pointer",
            transition: "all 0.2s ease",
            maxWidth: "420px",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
            <path d="M8 1L2 4.5V8c0 3.5 2.5 6.5 6 7.5 3.5-1 6-4 6-7.5V4.5L8 1z" stroke="#7dba96" strokeWidth="1.3" fill="none"/>
            <path d="M5.5 8L7 9.5L10.5 6" stroke="#7dba96" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{
            fontFamily: sans,
            fontSize: "14px",
            fontWeight: 500,
            color: C.cream,
            lineHeight: 1.4,
          }}>
            Your data never leaves your device — no server, no account needed.
          </span>
          <span style={{
            fontFamily: sans,
            fontSize: "13px",
            color: "#9dcbad",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            textDecorationColor: "rgba(125, 186, 150, 0.4)",
            whiteSpace: "nowrap" as const,
          }}>
            See how ↓
          </span>
        </a>

        {/* CTA button */}
        <div style={{ marginTop: "32px" }}>
          <a
            href="#upload"
            style={{
              display: "inline-block",
              padding: "14px 36px",
              background: C.cream,
              color: C.green,
              border: "none",
              borderRadius: "8px",
              fontFamily: sans,
              fontSize: "15px",
              fontWeight: 600,
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            Get started
          </a>
        </div>
      </section>

      {/* ─── Why Skills matter ─── */}
      <section
        style={{
          padding: "72px 24px",
          maxWidth: "780px",
          margin: "0 auto",
        }}
      >
        <div style={{
          fontFamily: mono,
          fontSize: "10px",
          letterSpacing: "0.14em",
          textTransform: "uppercase" as const,
          color: "#9C9C8A",
          marginBottom: "12px",
        }}>
          Why Skills matter
        </div>
        <h2 style={{
          fontFamily: sans,
          fontSize: "26px",
          fontWeight: 700,
          lineHeight: 1.3,
          color: "#2D4A3E",
          marginBottom: "14px",
          maxWidth: "540px",
        }}>
          Claude has built-in Skills, but they only cover the basics.
        </h2>
        <p style={{
          fontFamily: sans,
          fontSize: "15px",
          color: "#7A7A6C",
          lineHeight: 1.7,
          maxWidth: "540px",
          marginBottom: "32px",
        }}>
          The real power comes from <strong style={{ color: "#2D4A3E", fontWeight: 600 }}>community-published Skills</strong> — purpose-built
          instructions that teach Claude how to handle specific workflows, domains, and tools.
          This site analyzes your Claude history and <strong style={{ color: "#2D4A3E", fontWeight: 600 }}>recommends the Skills
          that match how you actually work</strong>.
        </p>

        {/* CTA buttons */}
        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "12px" }}>
          <a
            href="#upload"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "12px 24px",
              background: "#2D4A3E",
              color: "#FDF6EC",
              borderRadius: "8px",
              fontFamily: sans,
              fontSize: "14px",
              fontWeight: 600,
              textDecoration: "none",
              transition: "opacity 0.15s ease",
            }}
          >
            Find your Skills
            <span style={{ fontSize: "15px" }}>→</span>
          </a>
          <a
            href="#how-it-works"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "12px 24px",
              background: "transparent",
              color: "#2D4A3E",
              border: "1px solid #E8DCCA",
              borderRadius: "8px",
              fontFamily: sans,
              fontSize: "14px",
              fontWeight: 600,
              textDecoration: "none",
              transition: "border-color 0.15s ease",
            }}
          >
            See use cases
            <span style={{ fontSize: "15px" }}>↓</span>
          </a>
        </div>
      </section>

      {/* ─── Why upload your data ─── */}
      <section
        id="how-it-works"
        style={{ padding: "0 24px 72px", maxWidth: "780px", margin: "0 auto", scrollMarginTop: "120px" }}
      >
        <div style={{
          fontFamily: mono,
          fontSize: "10px",
          letterSpacing: "0.14em",
          textTransform: "uppercase" as const,
          color: "#9C9C8A",
          marginBottom: "12px",
        }}>
          Why upload your data
        </div>
        <h2 style={{
          fontFamily: sans,
          fontSize: "26px",
          fontWeight: 700,
          lineHeight: 1.3,
          color: "#2D4A3E",
          marginBottom: "14px",
          maxWidth: "540px",
        }}>
          Your conversation history is the best guide to what you actually need.
        </h2>
        <p style={{
          fontFamily: sans,
          fontSize: "15px",
          color: "#7A7A6C",
          lineHeight: 1.7,
          maxWidth: "540px",
          marginBottom: "32px",
        }}>
          You've had hundreds of conversations with Claude. Those patterns — the
          tasks you repeat, the topics you revisit, the workflows you reach for —
          tell us exactly which Skills will save you the most time.{" "}
          <strong style={{ color: "#2D4A3E", fontWeight: 600 }}>
            Instead of browsing a catalog and guessing, we match Skills to how you already work.
          </strong>
        </p>

        {/* Export steps box */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8DCCA",
            borderRadius: "10px",
            padding: "24px 28px",
            marginBottom: "20px",
          }}
        >
          <div style={{
            fontFamily: mono,
            fontSize: "10px",
            letterSpacing: "0.1em",
            textTransform: "uppercase" as const,
            color: "#9C9C8A",
            marginBottom: "16px",
          }}>
            Step 1: download your Claude data
          </div>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "16px" }}>
            {[
              { num: "1", title: "Settings", desc: "Click your initials on claude.ai" },
              { num: "2", title: "Privacy", desc: "Navigate to the Privacy tab" },
              { num: "3", title: "Export", desc: 'Click "Export data" — you\'ll get an email' },
              { num: "4", title: "Upload", desc: "Unzip and drop conversations.json here" },
            ].map((step) => (
              <div
                key={step.num}
                style={{
                  flex: "1 1 160px",
                  minWidth: "160px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    background: "#2D4A3E",
                    color: "#FDF6EC",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {step.num}
                </div>
                <div style={{ fontSize: "13px", color: "#7A7A6C", lineHeight: 1.5 }}>
                  <strong style={{ color: "#2D4A3E", fontWeight: 600, display: "block" }}>
                    {step.title}
                  </strong>
                  {step.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings link */}
        <a
          href="https://claude.ai/settings"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: sans,
            fontSize: "14px",
            fontWeight: 500,
            color: "#2D4A3E",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
          }}
        >
          Open Claude Settings ↗
        </a>
      </section>

      {/* ─── Upload section (phase-driven) ─── */}
      <section
        id="upload"
        style={{
          padding: "64px 24px",
          background: "#FDF6EC",
          borderTop: "1px solid #E8DCCA",
          borderBottom: "1px solid #E8DCCA",
          scrollMarginTop: "120px",
        }}
      >
        <div style={{ maxWidth: "780px", margin: "0 auto" }}>

          {/* ── Phase 1: Upload zone ── */}
          {phase === "upload" && (
            <div
              style={{
                background: "#FFFFFF",
                border: `1px dashed ${dragOver ? "#2D4A3E" : "#E8DCCA"}`,
                borderRadius: "12px",
                padding: "24px 28px",
                transition: "border-color 0.2s ease",
              }}
            >
              {/* Eyebrow */}
              <div style={{
                fontFamily: mono,
                fontSize: "10px",
                letterSpacing: "0.14em",
                textTransform: "uppercase" as const,
                color: "#9C9C8A",
                marginBottom: "14px",
              }}>
                Step 2: Upload your data
              </div>

              {/* Hint */}
              <div style={{
                fontFamily: sans,
                fontSize: "14px",
                color: "#7A7A6C",
                marginBottom: "18px",
              }}>
                Drop your{" "}
                <code style={{
                  fontFamily: mono,
                  fontSize: "12px",
                  background: "#FDF6EC",
                  border: "1px solid #E8DCCA",
                  padding: "2px 8px",
                  borderRadius: "4px",
                }}>
                  conversations.json
                </code>{" "}
                file from your Claude data export.
              </div>

              {/* Drop zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  if (e.dataTransfer.files[0])
                    handleFile(e.dataTransfer.files[0]);
                }}
                onClick={() => fileRef.current?.click()}
                style={{
                  border: "1px dashed #E8DCCA",
                  borderRadius: "10px",
                  background: dragOver ? "#e8f0eb" : "#F5EBDA",
                  padding: "24px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column" as const,
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                  transition: "background 0.2s ease",
                }}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".json"
                  onChange={(e) =>
                    e.target.files?.[0] && handleFile(e.target.files[0])
                  }
                  style={{ display: "none" }}
                />
                <div style={{ fontFamily: sans, fontSize: "14px", color: "#7A7A6C" }}>
                  Drop your file here, or
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
                  style={{
                    display: "inline-block",
                    background: "#2D4A3E",
                    color: "#FDF6EC",
                    fontFamily: sans,
                    fontSize: "14px",
                    fontWeight: 600,
                    padding: "10px 28px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Choose file
                </button>
                <div style={{
                  fontFamily: mono,
                  fontSize: "11px",
                  color: "#9C9C8A",
                }}>
                  Accepts conversations.json
                </div>
              </div>

              {uploadError && (
                <div
                  style={{
                    marginTop: "12px",
                    padding: "10px 14px",
                    fontSize: "13px",
                    background: "#fef2f2",
                    color: "#991b1b",
                    border: "1px solid #fecaca",
                    borderRadius: "8px",
                  }}
                >
                  {uploadError}
                </div>
              )}

              {/* Privacy link */}
              <a
                href="#how-we-keep-it-private"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  marginTop: "18px",
                  textDecoration: "none",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    background: "#2D4A3E",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1L2 4v4c0 3.5 2.5 6.5 6 7.5 3.5-1 6-4 6-7.5V4L8 1z" stroke="#FDF6EC" strokeWidth="1.5" />
                    <path d="M5.5 8L7 9.5 10.5 6" stroke="#FDF6EC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span style={{
                  fontFamily: sans,
                  fontSize: "14px",
                  color: "#2D4A3E",
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                }}>
                  Worried about your privacy? See how we protect your data ↓
                </span>
              </a>

              {/* ── Or divider ── */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                margin: "28px 0 24px",
              }}>
                <div style={{ flex: 1, height: "1px", background: "#E8DCCA" }} />
                <span style={{
                  fontFamily: mono,
                  fontSize: "11px",
                  color: "#9C9C8A",
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.08em",
                }}>or</span>
                <div style={{ flex: 1, height: "1px", background: "#E8DCCA" }} />
              </div>

              {/* ── Persona picker ── */}
              <PersonaPicker
                onTryDemo={handleTryDemo}
                onDownload={handleDownload}
              />
            </div>
          )}

          {/* ── Phase 2: Narrated parsing ── */}
          {phase === "narrating" && rawJson && (
            <ParsingNarration
              rawJson={rawJson}
              dataSource={dataSource || "file"}
              personaName={persona?.name}
              personaEmoji={persona?.emoji}
              onComplete={handleNarrationComplete}
              onReset={handleReset}
            />
          )}


        </div>
      </section>

      {/* ─── Privacy section ─── */}
      <section
        id="how-we-keep-it-private"
        style={{ padding: "72px 24px", maxWidth: "800px", margin: "0 auto", scrollMarginTop: "120px" }}
      >
        <div style={sectionLabel}>How privacy works here</div>
        <h2 style={{ ...headline, fontSize: "32px", marginBottom: "12px" }}>
          Built for you to own your data, not for us to see it.
        </h2>
        <p style={{ ...bodyText, marginBottom: "40px" }}>
          We designed this tool so your data never touches our hands. Everything
          runs client-side, directly in your browser.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {[
            {
              icon: "🔒",
              title: "Nothing leaves your browser",
              desc: "Your file is parsed and analyzed entirely using client-side JavaScript. There is no server, no upload, no account.",
            },
            {
              icon: "🛡️",
              title: "No network requests",
              desc: "Zero outgoing API calls. Your data is processed locally with pattern-matching heuristics — nothing is sent anywhere.",
            },
            {
              icon: "🗑️",
              title: "Nothing is stored",
              desc: "There is no database, no cookies, no local storage. Close the tab and everything is gone. We never see your data.",
            },
            {
              icon: "📊",
              title: "Privacy-preserving analytics only",
              desc: "We use fence analytics for simple page-view counts. No cookies, no fingerprinting, no behavioral tracking.",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                padding: "24px",
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: "12px",
                transition: "box-shadow 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "none";
              }}
            >
              <div style={{ fontSize: "24px", marginBottom: "12px" }}>
                {item.icon}
              </div>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: C.ink,
                  marginBottom: "8px",
                }}
              >
                {item.title}
              </div>
              <div
                style={{ fontSize: "14px", lineHeight: 1.65, color: C.body }}
              >
                {item.desc}
              </div>
            </div>
          ))}
        </div>

        {/* ── GitHub repo preview ── */}
        <a
          href="https://github.com/Citizen-Infra/Claude-Data-Transformer"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginTop: "28px",
            padding: "20px 24px",
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: "12px",
            textDecoration: "none",
            transition: "box-shadow 0.2s, transform 0.2s, border-color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)";
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.borderColor = C.cardBorder;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.borderColor = C.border;
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill={C.ink}
            style={{ flexShrink: 0 }}
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "15px",
                fontWeight: 600,
                color: C.ink,
                marginBottom: "2px",
              }}
            >
              Don't trust us — read the code.
            </div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "12px",
                color: C.subtle,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              github.com/Citizen-Infra/Claude-Data-Transformer
            </div>
          </div>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={C.subtle}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0, marginLeft: "auto" }}
          >
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </a>

        {/* ── Dev tools prompt ── */}
        <div style={{ marginTop: "28px" }}>
          <DevToolsPrompt />
        </div>
      </section>

      {/* ─── Skills Commons / Build a Skill ─── */}
      <section
        style={{
          padding: "0 24px 72px",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <SkillBuilderCard variant="homepage" onSecondaryClick={() => onNavigate("commons")} />
      </section>

      {/* ─── CTA ─── */}
      <section
        style={{
          padding: "64px 24px",
          background: `linear-gradient(135deg, ${C.green} 0%, ${C.greenMuted} 100%)`,
          textAlign: "center",
        }}
      >
        <h2
          style={{ ...headline, fontSize: "28px", color: "#fff", marginBottom: "8px" }}
        >
          Ready to find your skills?
        </h2>
        <p
          style={{
            fontSize: "16px",
            color: "rgba(255,255,255,0.8)",
            marginBottom: "28px",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Upload your Claude export and get personalized recommendations in
          minutes.
        </p>
        <a
          href="#upload"
          style={{
            display: "inline-block",
            padding: "14px 32px",
            background: "#fff",
            color: C.green,
            borderRadius: "8px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "15px",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Get started
        </a>
      </section>

      {/* ─── Who We Are / Citizen Infra ─── */}
      <section
        id="about-the-builders"
        style={{
          padding: "72px 24px",
          maxWidth: "800px",
          margin: "0 auto",
          scrollMarginTop: "120px",
        }}
      >
        <div style={sectionLabel}>Who We Are</div>
        <h2 style={{ ...headline, fontSize: "32px", marginBottom: "20px" }}>
          Citizen Infrastructure Builders
        </h2>
        <div
          style={{
            borderLeft: `3px solid ${C.greenMuted}`,
            paddingLeft: "20px",
            marginBottom: "28px",
          }}
        >
          <p
            style={{ ...bodyText, fontStyle: "italic", marginBottom: "6px", lineHeight: 1.7 }}
          >
            "If you want to teach people a new way of thinking, don't bother
            trying to teach them. Instead, give them a tool, the use of which
            will lead to new ways of thinking."
          </p>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              color: C.subtle,
            }}
          >
            — Buckminster Fuller
          </span>
        </div>
        <p style={{ ...bodyText, marginBottom: "16px" }}>
          We build digital pitchforks — citizen infrastructure that teaches
          collective action, solidarity, and shared stewardship through use. Not
          apps or platforms in the traditional sense, but tools crafted to
          reshape how people relate to each other and to their communities.
        </p>
        <p style={{ ...bodyText, marginBottom: "40px" }}>
          In an age of techno-feudalism, where digital platforms have replaced
          markets with fiefdoms and users have become digital serfs, the
          antidote is not better regulation of feudal tools — it's building
          tools that nurture citizen empowerment and the people's capacity to
          act together.
        </p>

        <div style={{ ...sectionLabel, marginBottom: "16px" }}>Principles</div>
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "48px" }}
        >
          {[
            "Pedagogical by design",
            "Ownership-enabling",
            "Solidarity-building",
            "Sovereignty-preserving",
            "Interoperable",
            "Antifragile",
          ].map((label) => (
            <span
              key={label}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "12px",
                fontWeight: 500,
                letterSpacing: "0.5px",
                padding: "6px 14px",
                borderRadius: "6px",
                background: C.cardBg,
                color: C.greenMuted,
                border: `1px solid ${C.border}`,
              }}
            >
              {label}
            </span>
          ))}
        </div>

        <div style={{ ...sectionLabel, marginBottom: "20px" }}>Projects</div>
        <div
          className="projects-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {/* ChatGPT Data Transformer */}
          <a
            href="https://chatgpt-data-transformer.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "28px 24px",
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: "12px",
              textDecoration: "none",
              transition: "box-shadow 0.2s, transform 0.2s",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "none";
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: C.subtle,
              }}
            >
              ChatGPT
            </div>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "17px",
                fontWeight: 600,
                color: C.ink,
              }}
            >
              ChatGPT Data Transformer
            </div>
            <div style={{ fontSize: "14px", lineHeight: 1.65, color: C.body }}>
              Analyze your ChatGPT export — see your usage signature, topics,
              and conversation patterns. Same privacy-first approach, built for
              OpenAI's format.
            </div>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                color: C.greenMuted,
                marginTop: "auto",
              }}
            >
              Visit tool →
            </div>
          </a>

          {/* Claude PDT */}
          <div
            style={{
              padding: "28px 24px",
              background: C.cardBg,
              border: `1px solid ${C.greenMuted}`,
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              position: "relative",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "11px",
                  fontWeight: 500,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: C.subtle,
                }}
              >
                Claude
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px",
                  fontWeight: 500,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  background: C.greenMuted,
                  color: "#fff",
                }}
              >
                You are here
              </div>
            </div>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "17px",
                fontWeight: 600,
                color: C.ink,
              }}
            >
              Claude Personal Data Transformer
            </div>
            <div style={{ fontSize: "14px", lineHeight: 1.65, color: C.body }}>
              Analyze your Claude export — discover your usage patterns and get
              matched with Skills that make your workflows more efficient.
            </div>
            <a
              href="#upload"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                color: C.greenMuted,
                textDecoration: "none",
                marginTop: "auto",
              }}
            >
              Get started →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
