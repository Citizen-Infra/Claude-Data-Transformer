import { useState, useRef, useCallback } from "react";
import { parseClaudeExport } from "../lib/parseClaudeExport";
import { SAMPLE_CONVERSATIONS } from "../data/sampleConversations";
import type { ParsedConversation } from "../lib/types";

interface LandingPageProps {
  onDataReady: (conversations: ParsedConversation[]) => void;
}

/* ── Design tokens ── */
const C = {
  dark: "#1a3a2a",
  mid: "#2d5a3f",
  accent: "#3d7a56",
  cream: "#f7f5f0",
  surface: "#fff",
  cardBg: "#e8f0eb",
  border: "#e0e0e0",
  cardBorder: "#d8d8d8",
  ink: "#1a1a1a",
  body: "#555",
  subtle: "#888",
};

const sectionLabel: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "11px",
  fontWeight: 500,
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  color: C.subtle,
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

/* ── Main LandingPage ── */
export default function LandingPage({ onDataReady }: LandingPageProps) {
  // Upload state
  const [dragOver, setDragOver] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [uploadedConvs, setUploadedConvs] = useState<ParsedConversation[] | null>(null);
  const [uploadStats, setUploadStats] = useState<{
    conversations: number;
    messages: number;
  } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const analyzeBtnRef = useRef<HTMLButtonElement>(null);

  // Handle file
  const handleFile = useCallback(async (file: File) => {
    setParsing(true);
    setUploadError(null);
    try {
      if (file.name.endsWith(".zip")) {
        setUploadError(
          "Please extract the ZIP first and upload the conversations.json file inside it."
        );
        setParsing(false);
        return;
      }
      const text = await file.text();
      const jsonData = JSON.parse(text);
      const conversations = parseClaudeExport(jsonData);
      const totalMessages = conversations.reduce(
        (s, c) => s + c.message_count,
        0
      );
      setUploadedConvs(conversations);
      setUploadStats({
        conversations: conversations.length,
        messages: totalMessages,
      });
      // Nudge the analyze button into view after render
      setTimeout(() => {
        analyzeBtnRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 150);
    } catch {
      setUploadError(
        "Couldn't parse that file. Make sure it's the conversations.json from your Claude export."
      );
    }
    setParsing(false);
  }, []);

  // Load sample data without file upload
  const handleSampleData = useCallback(() => {
    const conversations = parseClaudeExport(SAMPLE_CONVERSATIONS);
    const totalMessages = conversations.reduce(
      (s, c) => s + c.message_count,
      0
    );
    setUploadedConvs(conversations);
    setUploadStats({
      conversations: conversations.length,
      messages: totalMessages,
    });
    setUploadError(null);
    setTimeout(() => {
      analyzeBtnRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 150);
  }, []);

  // Ready to analyze?
  const hasFile = uploadedConvs && uploadedConvs.length > 0;

  const handleAnalyze = () => {
    if (hasFile && uploadedConvs) {
      onDataReady(uploadedConvs);
    }
  };

  return (
    <div>
      {/* ─── Hero ─── */}
      <section
        style={{
          background: `linear-gradient(135deg, ${C.dark} 0%, ${C.mid} 100%)`,
          padding: "80px 24px 72px",
          textAlign: "center",
        }}
      >
        <div style={{ ...sectionLabel, color: "#88E7BB", marginBottom: "20px" }}>
          Skills discovery
        </div>
        <h1
          style={{
            ...headline,
            fontSize: "clamp(32px, 5vw, 52px)",
            color: "#fff",
            maxWidth: "640px",
            margin: "0 auto 20px",
          }}
        >
          Find the Skills that fit how you already think.
        </h1>
        <p
          style={{
            fontSize: "17px",
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.8)",
            maxWidth: "520px",
            margin: "0 auto 36px",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Upload your Claude history. We'll analyze your patterns and recommend
          Skills that make Claude work harder for you. Everything runs in your
          browser.
        </p>
        <a
          href="#upload"
          style={{
            display: "inline-block",
            padding: "14px 32px",
            background: "#fff",
            color: C.dark,
            border: "none",
            borderRadius: "8px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "15px",
            fontWeight: 600,
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          Get started
        </a>
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
        style={{ padding: "0 24px 72px", maxWidth: "800px", margin: "0 auto" }}
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
            {
              step: "1",
              title: "Open Claude Settings",
              desc: "Go to claude.ai, click your initials, then Settings.",
            },
            {
              step: "2",
              title: "Find Privacy",
              desc: "Navigate to the Privacy tab.",
            },
            {
              step: "3",
              title: "Export Data",
              desc: 'Click "Export data." Claude emails you a download link.',
            },
            {
              step: "4",
              title: "Find conversations.json",
              desc: "Download the ZIP, extract it, and find conversations.json inside.",
            },
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
                  background: C.dark,
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
              <div
                style={{
                  fontSize: "14px",
                  lineHeight: 1.6,
                  color: C.body,
                }}
              >
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
            color: C.mid,
            textDecoration: "underline",
            textUnderlineOffset: "3px",
          }}
        >
          Open Claude Settings ↗
        </a>
      </section>

      {/* ─── Upload section ─── */}
      <section
        id="upload"
        style={{
          padding: "64px 24px",
          background: C.cream,
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div style={{ ...sectionLabel, color: C.mid }}>Get started</div>
          <h2 style={{ ...headline, fontSize: "32px", marginBottom: "8px" }}>
            Upload your data.
          </h2>
          <p style={{ ...bodyText, marginBottom: "36px" }}>
            Drop your Claude export file below. We'll analyze your conversation
            patterns and recommend Skills — entirely in your browser.
          </p>

          {/* ── Drop zone ── */}
          <div style={{ marginBottom: "8px" }}>
            <label
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                color: C.ink,
                display: "block",
                marginBottom: "4px",
              }}
            >
              Claude Export File
            </label>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                color: C.body,
                marginBottom: "10px",
                lineHeight: 1.5,
              }}
            >
              Upload the{" "}
              <code
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "12px",
                  background: C.cardBg,
                  padding: "2px 6px",
                  borderRadius: "4px",
                  color: C.mid,
                  fontWeight: 500,
                }}
              >
                conversations.json
              </code>{" "}
              file from your Claude data export.
            </div>
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
                border: `2px dashed ${
                  uploadStats
                    ? C.accent
                    : dragOver
                    ? C.mid
                    : C.cardBorder
                }`,
                borderRadius: "16px",
                background: uploadStats
                  ? C.cardBg
                  : dragOver
                  ? C.cream
                  : C.surface,
                padding: "48px 32px",
                textAlign: "center",
                cursor: "pointer",
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

              {parsing ? (
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "14px",
                    color: C.subtle,
                  }}
                >
                  Parsing conversations...
                </div>
              ) : uploadStats ? (
                <div>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      margin: "0 auto 12px",
                      borderRadius: "50%",
                      background: C.mid,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                    }}
                  >
                    ✓
                  </div>
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "16px",
                      fontWeight: 600,
                      color: C.ink,
                      marginBottom: "4px",
                    }}
                  >
                    {uploadStats.conversations.toLocaleString()} conversations
                  </div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "13px",
                      color: C.body,
                    }}
                  >
                    {uploadStats.messages.toLocaleString()} messages found
                  </div>
                </div>
              ) : (
                <div>
                  <div
                    style={{
                      fontSize: "32px",
                      marginBottom: "12px",
                      opacity: 0.5,
                    }}
                  >
                    📄
                  </div>
                  <div
                    style={{
                      fontSize: "15px",
                      color: C.body,
                      marginBottom: "6px",
                    }}
                  >
                    Drop your file here, or
                  </div>
                  <div
                    style={{
                      display: "inline-block",
                      padding: "10px 28px",
                      background: C.mid,
                      color: "#fff",
                      borderRadius: "8px",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      marginBottom: "12px",
                    }}
                  >
                    Choose file
                  </div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "11px",
                      color: C.subtle,
                      letterSpacing: "0.3px",
                    }}
                  >
                    Accepts conversations.json
                  </div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSampleData();
                    }}
                    style={{
                      marginTop: "16px",
                      paddingTop: "12px",
                      borderTop: `1px solid ${C.border}`,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "13px",
                      color: C.body,
                    }}
                  >
                    Hesitant?{" "}
                    <span
                      style={{
                        color: C.mid,
                        fontWeight: 600,
                        textDecoration: "underline",
                        textUnderlineOffset: "3px",
                        cursor: "pointer",
                      }}
                    >
                      Try with sample data
                    </span>
                  </div>
                </div>
              )}
            </div>

            {uploadError && (
              <div
                style={{
                  marginTop: "8px",
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

          {/* ── Analyze button ── */}
          <button
            ref={analyzeBtnRef}
            onClick={handleAnalyze}
            disabled={!hasFile}
            className={hasFile ? "analyze-btn-pulse" : ""}
            style={{
              width: "100%",
              marginTop: "12px",
              padding: "16px",
              border: "none",
              borderRadius: "12px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "16px",
              fontWeight: 700,
              cursor: hasFile ? "pointer" : "default",
              background: hasFile
                ? `linear-gradient(135deg, ${C.mid}, ${C.accent})`
                : "#e0e0e0",
              color: hasFile ? "#fff" : "#aaa",
              transition: "all 0.2s",
              letterSpacing: "-0.2px",
            }}
          >
            Analyze my conversations →
          </button>

          {/* ── Privacy note ── */}
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              padding: "16px",
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: "12px",
            }}
          >
            <span style={{ fontSize: "16px" }}>🔒</span>
            <div style={{ fontSize: "13px", lineHeight: 1.65, color: C.body }}>
              <strong style={{ color: C.ink }}>Privacy guarantee:</strong> Your
              conversation data never leaves your browser. All analysis runs
              locally using JavaScript — no servers, no APIs, no accounts.
              Close this tab and everything is gone.
            </div>
          </div>
        </div>
      </section>

      {/* ─── Privacy section ─── */}
      <section
        id="privacy"
        style={{ padding: "72px 24px", maxWidth: "800px", margin: "0 auto" }}
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
          {/* GitHub icon */}
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
      </section>

      {/* ─── CTA ─── */}
      <section
        style={{
          padding: "64px 24px",
          background: `linear-gradient(135deg, ${C.dark} 0%, ${C.mid} 100%)`,
          textAlign: "center",
        }}
      >
        <h2
          style={{
            ...headline,
            fontSize: "28px",
            color: "#fff",
            marginBottom: "8px",
          }}
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
            color: C.dark,
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

      {/* ─── More tools from Bloom ─── */}
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
            borderLeft: `3px solid ${C.mid}`,
            paddingLeft: "20px",
            marginBottom: "28px",
          }}
        >
          <p
            style={{
              ...bodyText,
              fontStyle: "italic",
              marginBottom: "6px",
              lineHeight: 1.7,
            }}
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
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "48px",
          }}
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
                color: C.mid,
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
            <div
              style={{
                fontSize: "14px",
                lineHeight: 1.65,
                color: C.body,
              }}
            >
              Analyze your ChatGPT export — see your usage signature, topics,
              and conversation patterns. Same privacy-first approach, built for
              OpenAI's format.
            </div>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                color: C.mid,
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
              border: `1px solid ${C.mid}`,
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
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
                  background: C.mid,
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
            <div
              style={{
                fontSize: "14px",
                lineHeight: 1.65,
                color: C.body,
              }}
            >
              Analyze your Claude export — discover your usage patterns and get
              matched with Skills that make your workflows more efficient.
            </div>
            <a
              href="#upload"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                color: C.mid,
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
