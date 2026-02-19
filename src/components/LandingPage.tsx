import { useState, useRef, useCallback } from "react";
import { getDateRange } from "../lib/parseClaudeExport";
import { getPersonaById } from "../data/samplePersonas";
import { downloadPersonaExport } from "../lib/generatePersonaExport";
import ParsingNarration from "./ParsingNarration";
import type { NarrationResults } from "./ParsingNarration";
import ParsedPreview from "./ParsedPreview";
import PersonaPicker from "./PersonaPicker";
import PrivacyMonitor from "./PrivacyMonitor";
import DevToolsPrompt from "./DevToolsPrompt";
import SkillBuilderCard from "./SkillBuilderCard";
import type { ParsedConversation, ClaudeConversation, UserProfile, EnrichedRecommendation, AnalysisResults, AppView } from "../lib/types";

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
type UploadPhase = "upload" | "narrating" | "preview";
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

  // Raw JSON (stored between narrating and preview)
  const [rawJson, setRawJson] = useState<ClaudeConversation[] | null>(null);

  // Parsed results (set after narration completes)
  const [uploadedConvs, setUploadedConvs] = useState<ParsedConversation[] | null>(null);
  const [uploadStats, setUploadStats] = useState<{
    conversations: number;
    messages: number;
    withArtifacts: number;
  } | null>(null);
  const [dateRange, setDateRange] = useState<{ earliest: string; latest: string; years: number } | null>(null);

  // Analysis results (from narration modal)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [recommendations, setRecommendations] = useState<EnrichedRecommendation[] | null>(null);

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

  // ── Handle narration completion ──
  const handleNarrationComplete = useCallback(
    (results: NarrationResults) => {
      setUploadedConvs(results.conversations);
      setUploadStats(results.stats);
      setDateRange(getDateRange(results.conversations));
      setUserProfile(results.userProfile);
      setRecommendations(results.recommendations);
      setPhase("preview");
      // Scroll to center the preview card on screen
      setTimeout(() => {
        document.getElementById("parsed-preview")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 150);
    },
    []
  );

  // ── Handle analyze (proceed straight to results) ──
  const handleAnalyze = useCallback(() => {
    if (uploadedConvs && userProfile && recommendations && dateRange) {
      onDataReady({
        userProfile,
        recommendations,
        dateRange,
        totalConversations: uploadedConvs.length,
        totalMessages: uploadedConvs.reduce((s, c) => s + c.message_count, 0),
      });
    }
  }, [uploadedConvs, userProfile, recommendations, dateRange, onDataReady]);

  // ── Reset to upload phase ──
  const handleReset = useCallback(() => {
    setPhase("upload");
    setDataSource(null);
    setSelectedPersona(null);
    setRawJson(null);
    setUploadedConvs(null);
    setUploadStats(null);
    setDateRange(null);
    setUploadError(null);
    setUserProfile(null);
    setRecommendations(null);
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
          href="#security-details"
          onMouseEnter={() => setHoverPrivacyLink(true)}
          onMouseLeave={() => setHoverPrivacyLink(false)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "20px",
            padding: "10px 20px",
            background: hoverPrivacyLink
              ? "rgba(125, 186, 150, 0.2)"
              : "rgba(125, 186, 150, 0.12)",
            border: hoverPrivacyLink
              ? "1px solid rgba(125, 186, 150, 0.4)"
              : "1px solid rgba(125, 186, 150, 0.25)",
            borderRadius: "8px",
            textDecoration: "none",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
            <path d="M8 1L2 4.5V8c0 3.5 2.5 6.5 6 7.5 3.5-1 6-4 6-7.5V4.5L8 1z" stroke="#7dba96" strokeWidth="1.3" fill="none"/>
            <path d="M5.5 8L7 9.5L10.5 6" stroke="#7dba96" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{
            fontFamily: sans,
            fontSize: "14.5px",
            fontWeight: 500,
            color: C.cream,
          }}>
            Everything runs in your browser.
          </span>
          <span style={{
            fontFamily: sans,
            fontSize: "13px",
            color: "#9dcbad",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            textDecorationColor: "rgba(125, 186, 150, 0.4)",
          }}>
            Learn how ↓
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

      {/* ─── What you'll get ─── */}
      <section
        style={{
          padding: "72px 24px",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <div style={sectionLabel}>What you'll walk away with</div>
        <h2 style={{ ...headline, fontSize: "32px", marginBottom: "12px" }}>
          Your Claude history knows what Skills you need.
        </h2>
        <p style={{ ...bodyText, marginBottom: "40px" }}>
          We analyze your conversation patterns — the topics you revisit, the
          tasks you repeat, the tools you reach for — and match them to Skills
          that make those workflows more efficient.
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
              icon: "🧩",
              title: "Skill recommendations",
              desc: "Ranked by how well each Skill fits the work you actually do with Claude. Every recommendation links to the file for you to upload to Claude.",
            },
            {
              icon: "📊",
              title: "Usage signature",
              desc: "A breakdown of how you use Claude — across code, writing, strategy, research — with percentages and trends. See where your attention goes and what that means for how you work.",
            },
            {
              icon: "🔍",
              title: "Gaps worth building",
              desc: "We flag repeated workflows where a Skill could help but doesn't exist yet. So you know exactly what to build.",
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
                style={{
                  fontSize: "14px",
                  lineHeight: 1.65,
                  color: C.body,
                }}
              >
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Before you upload (export steps) ─── */}
      <section
        id="how-it-works"
        style={{ padding: "0 24px 72px", maxWidth: "800px", margin: "0 auto", scrollMarginTop: "120px" }}
      >
        <div style={sectionLabel}>Before you upload</div>
        <h2 style={{ ...headline, fontSize: "32px", marginBottom: "12px" }}>
          First, download your data from Claude.
        </h2>
        <p style={{ ...bodyText, marginBottom: "36px" }}>
          It can take up to 24 hours for Claude to prepare your export. We'll be
          here when you're ready.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "36px",
          }}
        >
          {[
            { step: "1", title: "Open Claude Settings", desc: "Go to claude.ai, click your initials, then Settings." },
            { step: "2", title: "Find Privacy", desc: "Navigate to the Privacy tab." },
            { step: "3", title: "Export Data", desc: 'Click "Export data." Claude emails you a download link.' },
            { step: "4", title: "Find conversations.json", desc: "Download the ZIP, extract it, and find conversations.json inside." },
          ].map((item) => (
            <div
              key={item.step}
              style={{
                padding: "20px",
                border: `1px solid ${C.border}`,
                background: C.surface,
                borderRadius: "12px",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: C.green,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "13px",
                  fontWeight: 600,
                  marginBottom: "12px",
                }}
              >
                {item.step}
              </div>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: C.ink,
                  marginBottom: "6px",
                }}
              >
                {item.title}
              </div>
              <div style={{ fontSize: "14px", lineHeight: 1.6, color: C.body }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>

        <a
          href="https://claude.ai/settings"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "14px",
            fontWeight: 600,
            color: C.greenMuted,
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
          background: C.cream,
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
          scrollMarginTop: "120px",
        }}
      >
        <div style={{ maxWidth: "780px", margin: "0 auto" }}>
          <div style={{ ...sectionLabel, color: C.warmGray }}>Get started</div>
          <h2 style={{
            fontFamily: sans,
            fontSize: "28px",
            fontWeight: 600,
            color: C.text,
            marginBottom: "8px",
            letterSpacing: "-0.01em",
          }}>
            See how it works.
          </h2>
          <p style={{
            fontFamily: sans,
            fontSize: "15px",
            color: C.textMuted,
            lineHeight: 1.6,
            maxWidth: "540px",
          }}>
            We analyze your conversation patterns and recommend Skills that fit
            how you already use Claude.
          </p>

          {/* Trust line */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "16px",
            marginBottom: "28px",
          }}>
            <div style={{
              width: "20px",
              height: "20px",
              background: C.green,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L2 4v4c0 3.5 2.5 6.5 6 7.5 3.5-1 6-4 6-7.5V4L8 1z" stroke={C.cream} strokeWidth="1.5" fill="none"/>
                <path d="M5.5 8L7 9.5 10.5 6" stroke={C.cream} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{
              fontFamily: sans,
              fontSize: "14px",
              fontWeight: 500,
              color: C.text,
            }}>
              Your data never leaves your browser. No server, no database, no account.{" "}
              <a
                href="#security-details"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("security-details")?.scrollIntoView({ behavior: "smooth" });
                }}
                style={{
                  color: C.green,
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                  fontWeight: 500,
                }}
              >
                How we keep it private &darr;
              </a>
            </span>
          </div>

          {/* ── Phase 1: Persona demos first, then upload zone ── */}
          {phase === "upload" && (
            <div>
              {/* ── Persona demos (primary CTA) ── */}
              <PersonaPicker
                onTryDemo={handleTryDemo}
                onDownload={handleDownload}
                heading="Try it with a famous mind."
                subheading="See the full experience with sample data — no upload needed."
              />

              {/* ── or ── divider */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "32px 0",
              }}>
                <div style={{ flex: 1, height: "1px", borderTop: `1px dashed ${C.border}` }} />
                <span style={{
                  fontFamily: mono,
                  fontSize: "11px",
                  color: C.warmGrayLight,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}>
                  or
                </span>
                <div style={{ flex: 1, height: "1px", borderTop: `1px dashed ${C.border}` }} />
              </div>

              {/* ── Upload card (secondary, below demos) ── */}
              <div
                style={{
                  background: C.white,
                  border: `1px solid ${C.border}`,
                  borderRadius: "12px",
                  padding: "32px",
                }}
              >
                <div style={{
                  fontFamily: sans,
                  fontSize: "15px",
                  fontWeight: 700,
                  color: C.text,
                  marginBottom: "4px",
                }}>
                  Ready? Upload your Claude export.
                </div>
                <div style={{ fontFamily: sans, fontSize: "14px", color: C.textMuted, marginBottom: "24px" }}>
                  Drop the{" "}
                  <code style={{
                    fontFamily: mono,
                    fontSize: "13px",
                    background: C.creamDark,
                    padding: "2px 8px",
                    borderRadius: "4px",
                    color: C.text,
                  }}>
                    conversations.json
                  </code>{" "}
                  file from Settings → Privacy → Export Data.
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
                    border: `2px dashed ${dragOver ? C.greenMuted : C.border}`,
                    borderRadius: "12px",
                    padding: "48px 24px",
                    textAlign: "center",
                    cursor: "pointer",
                    background: dragOver ? C.greenPale : C.cream,
                    transition: "all 0.2s ease",
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

                  {/* File icon SVG */}
                  <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "12px",
                    opacity: 0.5,
                  }}>
                    <svg width="28" height="34" viewBox="0 0 32 38" fill="none">
                      <path
                        d="M2 4C2 2.9 2.9 2 4 2H20L30 12V34C30 35.1 29.1 36 28 36H4C2.9 36 2 35.1 2 34V4Z"
                        stroke={C.warmGray}
                        strokeWidth="1.5"
                        fill="none"
                      />
                      <path d="M20 2V12H30" stroke={C.warmGray} strokeWidth="1.5" />
                      <line x1="8" y1="19" x2="24" y2="19" stroke={C.warmGray} strokeWidth="1" />
                      <line x1="8" y1="24" x2="24" y2="24" stroke={C.warmGray} strokeWidth="1" />
                      <line x1="8" y1="29" x2="18" y2="29" stroke={C.warmGray} strokeWidth="1" />
                    </svg>
                  </div>

                  <div style={{
                    fontFamily: sans,
                    fontSize: "15px",
                    color: C.textMuted,
                    marginBottom: "16px",
                  }}>
                    Drop your file here, or
                  </div>

                  <div style={{
                    display: "inline-block",
                    padding: "10px 24px",
                    background: C.green,
                    color: C.cream,
                    borderRadius: "8px",
                    fontFamily: sans,
                    fontSize: "14px",
                    fontWeight: 500,
                  }}>
                    Choose file
                  </div>

                  <div style={{
                    marginTop: "12px",
                    fontFamily: mono,
                    fontSize: "13px",
                    color: C.warmGray,
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
              </div>
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
            />
          )}

          {/* ── Phase 3: Expanded preview ── */}
          {phase === "preview" && uploadedConvs && uploadStats && dateRange && (
            <ParsedPreview
              conversations={uploadedConvs}
              stats={uploadStats}
              dateRange={dateRange}
              dataSource={dataSource || "file"}
              personaName={persona?.name}
              personaEmoji={persona?.emoji}
              userProfile={userProfile}
              recommendations={recommendations}
              onAnalyze={handleAnalyze}
              onReset={handleReset}
            />
          )}

          {/* ── Dev tools prompt (always visible) ── */}
          <DevToolsPrompt />

          {/* ── Privacy monitor (always visible) ── */}
          <PrivacyMonitor phase={phase} dataSource={dataSource} />
        </div>
      </section>

      {/* ─── Security Details (scroll target from trust line + hero pill) ─── */}
      <section
        id="security-details"
        style={{
          background: C.surface,
          borderTop: `1px solid ${C.border}`,
          scrollMarginTop: "120px",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "56px 32px 48px" }}>
          <div style={sectionLabel}>Privacy</div>
          <h2 style={{ ...headline, fontSize: "26px", marginBottom: "8px" }}>
            How we keep your data private.
          </h2>
          <p style={{
            fontFamily: sans,
            fontSize: "15px",
            color: C.textMuted,
            lineHeight: 1.6,
            marginBottom: "36px",
            maxWidth: "540px",
          }}>
            This tool was built by people who believe your AI history belongs to
            you. Here's exactly how the architecture enforces that.
          </p>

          {/* Security cards grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "40px",
          }}>
            {[
              {
                title: "Browser-only processing",
                desc: "Your file is read by JavaScript running on your device. The data never touches a server. There is no server. We use your browser's own compute to parse and analyze everything.",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke={C.cream} strokeWidth="2" width="18" height="18">
                    <rect x="2" y="3" width="20" height="14" rx="2"/>
                    <path d="M8 21h8M12 17v4"/>
                  </svg>
                ),
              },
              {
                title: "No database to breach",
                desc: "We don't store anything. There's no user account, no session data, no analytics cookies. Close the tab and everything disappears. There is nothing to hack because there is nothing to store.",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke={C.cream} strokeWidth="2" width="18" height="18">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                ),
              },
              {
                title: "Your API key stays in memory",
                desc: "When you provide an Anthropic API key for analysis, it lives only in browser memory. It's never written to disk, never sent to us, never logged. Close the tab and it's gone.",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke={C.cream} strokeWidth="2" width="18" height="18">
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                  </svg>
                ),
              },
              {
                title: "Open source",
                desc: "Every line of code is on GitHub. You can read the source, verify the claims, and audit the network requests yourself. We built this tool to be trustworthy, not to ask for trust.",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke={C.cream} strokeWidth="2" width="18" height="18">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                ),
              },
            ].map((card, i) => (
              <div
                key={i}
                style={{
                  background: C.cream,
                  borderRadius: "12px",
                  padding: "24px",
                }}
              >
                <div style={{
                  width: "36px",
                  height: "36px",
                  background: C.green,
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "14px",
                }}>
                  {card.icon}
                </div>
                <div style={{
                  fontFamily: sans,
                  fontSize: "15px",
                  fontWeight: 700,
                  color: C.text,
                  marginBottom: "6px",
                }}>
                  {card.title}
                </div>
                <div style={{
                  fontFamily: sans,
                  fontSize: "13px",
                  color: C.textMuted,
                  lineHeight: 1.6,
                }}>
                  {card.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Dev tools CTA (elevated) */}
          <div style={{
            background: C.cream,
            border: `1px dashed ${C.border}`,
            borderRadius: "12px",
            padding: "28px 32px",
            display: "flex",
            alignItems: "flex-start",
            gap: "16px",
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              background: C.green,
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke={C.cream} strokeWidth="2" width="20" height="20">
                <polyline points="16 18 22 12 16 6"/>
                <polyline points="8 6 2 12 8 18"/>
              </svg>
            </div>
            <div>
              <div style={{
                fontFamily: sans,
                fontSize: "15px",
                fontWeight: 700,
                color: C.text,
                marginBottom: "4px",
              }}>
                Want proof? Watch it yourself.
              </div>
              <p style={{
                fontFamily: sans,
                fontSize: "13px",
                color: C.textMuted,
                lineHeight: 1.6,
                margin: 0,
              }}>
                Open your browser's dev tools (
                <strong style={{ color: C.text }}>F12</strong> or{" "}
                <strong style={{ color: C.text }}>Cmd+Option+I</strong>
                ) and switch to the{" "}
                <strong style={{ color: C.text }}>Network tab</strong> before uploading.
                You'll see exactly zero requests to our domain. The only outbound
                traffic is to{" "}
                <strong style={{ color: C.text }}>api.anthropic.com</strong> — and only
                when you explicitly trigger analysis with your own API key.
              </p>
            </div>
          </div>
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
        style={{
          padding: "72px 24px",
          maxWidth: "800px",
          margin: "0 auto",
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
