import { useState, useRef, useCallback } from "react";
import { testApiKey } from "../lib/anthropicApi";
import { parseClaudeExport } from "../lib/parseClaudeExport";
import type { ParsedConversation } from "../lib/types";

interface LandingPageProps {
  onDataReady: (apiKey: string, conversations: ParsedConversation[], useAI: boolean) => void;
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

/* ── API Key Modal ── */
function ApiKeyModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "36px",
          maxWidth: "480px",
          width: "100%",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            color: C.subtle,
            lineHeight: 1,
          }}
        >
          &times;
        </button>

        <div style={{ ...sectionLabel, color: C.mid }}>Getting an API key</div>
        <h3
          style={{
            ...headline,
            fontSize: "24px",
            marginBottom: "20px",
          }}
        >
          How to get your Anthropic API key
        </h3>

        <ol
          style={{
            paddingLeft: "20px",
            margin: "0 0 24px 0",
            fontSize: "15px",
            lineHeight: 2.2,
            color: C.body,
          }}
        >
          <li>
            Go to{" "}
            <a
              href="https://console.anthropic.com/settings/keys"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: C.mid, fontWeight: 600 }}
            >
              console.anthropic.com/settings/keys
            </a>
          </li>
          <li>Sign in (or create an Anthropic account)</li>
          <li>
            Click <strong>"Create Key"</strong>, name it anything, and copy it
          </li>
          <li>
            Go to{" "}
            <a
              href="https://console.anthropic.com/settings/billing"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: C.mid, fontWeight: 600 }}
            >
              Billing
            </a>{" "}
            and add credits ($5 is plenty)
          </li>
        </ol>

        <div
          style={{
            padding: "16px",
            background: C.cream,
            borderRadius: "12px",
            fontSize: "14px",
            color: C.body,
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: C.ink }}>Note:</strong> This is an{" "}
          <strong>Anthropic API key</strong>, not your Claude.ai login. The API
          console is separate from the chat interface.
        </div>

        <div
          style={{
            marginTop: "16px",
            padding: "16px",
            background: C.cardBg,
            borderRadius: "12px",
            fontSize: "14px",
            color: C.body,
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: C.ink }}>Cost:</strong> Analysis typically
          costs <strong>$0.05 - $0.30</strong> depending on your conversation
          volume. We use Claude Haiku for efficiency.
        </div>
      </div>
    </div>
  );
}

/* ── Main LandingPage ── */
export default function LandingPage({ onDataReady }: LandingPageProps) {
  // Enhanced mode (API key) state
  const [enhancedMode, setEnhancedMode] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [keyValid, setKeyValid] = useState<boolean | null>(null);
  const [keyError, setKeyError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

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

  // Test API key
  const handleTestKey = async () => {
    if (!apiKey) return;
    setTesting(true);
    setKeyError(null);
    setKeyValid(null);
    const result = await testApiKey(apiKey);
    if (result.success) {
      setKeyValid(true);
    } else {
      setKeyValid(false);
      setKeyError(result.error || "Invalid key");
    }
    setTesting(false);
  };

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

  // Ready to analyze?
  const hasFile = uploadedConvs && uploadedConvs.length > 0;
  const canAnalyze = hasFile && (!enhancedMode || keyValid);

  const handleAnalyze = () => {
    if (canAnalyze && uploadedConvs) {
      onDataReady(apiKey, uploadedConvs, enhancedMode && !!keyValid);
    }
  };

  return (
    <div>
      {showModal && <ApiKeyModal onClose={() => setShowModal(false)} />}

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

      {/* ─── Upload + API Key section ─── */}
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

          {/* ── Enhanced mode toggle ── */}
          <div
            style={{
              marginTop: "12px",
              padding: "16px 20px",
              background: C.surface,
              border: `1px solid ${enhancedMode ? C.mid : C.border}`,
              borderRadius: "12px",
              transition: "border-color 0.2s",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
              onClick={() => setEnhancedMode(!enhancedMode)}
            >
              <div>
                <div
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: C.ink,
                    marginBottom: "2px",
                  }}
                >
                  Enhanced analysis with AI
                  <span
                    style={{
                      marginLeft: "8px",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "10px",
                      fontWeight: 500,
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      background: C.cardBg,
                      color: C.mid,
                    }}
                  >
                    Optional
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: C.body, lineHeight: 1.5 }}>
                  Use your Anthropic API key for deeper, AI-powered pattern
                  analysis. Without it, we use fast local heuristics.
                </div>
              </div>
              <div
                style={{
                  width: "44px",
                  height: "24px",
                  borderRadius: "12px",
                  background: enhancedMode ? C.mid : "#ddd",
                  position: "relative",
                  flexShrink: 0,
                  marginLeft: "16px",
                  transition: "background 0.2s",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    background: "#fff",
                    position: "absolute",
                    top: "3px",
                    left: enhancedMode ? "23px" : "3px",
                    transition: "left 0.2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                  }}
                />
              </div>
            </div>

            {/* API key input (shown when enhanced mode is on) */}
            {enhancedMode && (
              <div style={{ marginTop: "16px", borderTop: `1px solid ${C.border}`, paddingTop: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <label
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: C.ink,
                    }}
                  >
                    Anthropic API Key
                  </label>
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowModal(true); }}
                    style={{
                      background: "none",
                      border: "none",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: C.mid,
                      cursor: "pointer",
                      textDecoration: "underline",
                      textUnderlineOffset: "3px",
                    }}
                  >
                    How to get a key
                  </button>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <div style={{ flex: 1, position: "relative" }}>
                    <input
                      type={showKey ? "text" : "password"}
                      value={apiKey}
                      onChange={(e) => {
                        setApiKey(e.target.value);
                        setKeyValid(null);
                        setKeyError(null);
                      }}
                      placeholder="sk-ant-api03-..."
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        width: "100%",
                        padding: "10px 50px 10px 14px",
                        border: `1px solid ${
                          keyValid === true
                            ? "#bbf7d0"
                            : keyValid === false
                            ? "#fecaca"
                            : C.cardBorder
                        }`,
                        borderRadius: "8px",
                        background: "#fff",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "13px",
                        color: C.ink,
                        outline: "none",
                        boxSizing: "border-box",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => {
                        if (keyValid === null) e.currentTarget.style.borderColor = C.mid;
                      }}
                      onBlur={(e) => {
                        if (keyValid === null) e.currentTarget.style.borderColor = C.cardBorder;
                      }}
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowKey(!showKey); }}
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "11px",
                        color: C.subtle,
                      }}
                    >
                      {showKey ? "hide" : "show"}
                    </button>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleTestKey(); }}
                    disabled={!apiKey || testing}
                    style={{
                      padding: "10px 20px",
                      border: "none",
                      borderRadius: "8px",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "13px",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      cursor: apiKey && !testing ? "pointer" : "default",
                      background: apiKey && !testing ? C.dark : "#e0e0e0",
                      color: apiKey && !testing ? "#fff" : "#aaa",
                      transition: "background 0.2s",
                    }}
                  >
                    {testing ? "Testing..." : keyValid ? "✓ Valid" : "Connect"}
                  </button>
                </div>

                {keyError && (
                  <div
                    style={{
                      marginTop: "8px",
                      padding: "8px 12px",
                      fontSize: "12px",
                      fontFamily: "'JetBrains Mono', monospace",
                      background: "#fef2f2",
                      color: "#991b1b",
                      border: "1px solid #fecaca",
                      borderRadius: "8px",
                    }}
                  >
                    ✗ {keyError}
                  </div>
                )}
                {keyValid && (
                  <div
                    style={{
                      marginTop: "8px",
                      padding: "8px 12px",
                      fontSize: "12px",
                      fontFamily: "'JetBrains Mono', monospace",
                      background: "#f0fdf4",
                      color: "#166534",
                      border: "1px solid #bbf7d0",
                      borderRadius: "8px",
                    }}
                  >
                    ✓ Connected — key is valid
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Analyze button ── */}
          <button
            ref={analyzeBtnRef}
            onClick={handleAnalyze}
            disabled={!canAnalyze}
            className={canAnalyze ? "analyze-btn-pulse" : ""}
            style={{
              width: "100%",
              marginTop: "12px",
              padding: "16px",
              border: "none",
              borderRadius: "12px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "16px",
              fontWeight: 700,
              cursor: canAnalyze ? "pointer" : "default",
              background: canAnalyze
                ? `linear-gradient(135deg, ${C.mid}, ${C.accent})`
                : "#e0e0e0",
              color: canAnalyze ? "#fff" : "#aaa",
              transition: "all 0.2s",
              letterSpacing: "-0.2px",
            }}
          >
            {enhancedMode && keyValid
              ? "Analyze with AI →"
              : "Analyze my conversations →"}
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
              key is held in browser memory only. Your conversation data goes
              directly from your browser to Anthropic's API. Close this tab and
              everything is gone.
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
              desc: "Your file is parsed and analyzed using client-side JavaScript and direct API calls. There is no server, no upload, no account.",
            },
            {
              icon: "🔑",
              title: "API key stays in memory",
              desc: "Your key is held in browser memory for this session only. Close the tab and it's gone. We never store, transmit, or log it.",
            },
            {
              icon: "🛡️",
              title: "We have no database",
              desc: "There is nothing to breach. Claude processes your data through Anthropic's API — we're just the interface.",
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
        <div style={sectionLabel}>Citizen Infrastructure</div>
        <h2 style={{ ...headline, fontSize: "32px", marginBottom: "12px" }}>
          We build tools that put people first.
        </h2>
        <p
          style={{
            ...bodyText,
            fontStyle: "italic",
            marginBottom: "16px",
            borderLeft: `3px solid ${C.mid}`,
            paddingLeft: "16px",
          }}
        >
          "Citizen infrastructure is the idea that tools, systems, and
          platforms should be designed to serve people — not extract from them."
        </p>
        <p style={{ ...bodyText, marginBottom: "16px" }}>
          These tools are part of an open effort to help people understand and
          own their AI usage data. No accounts. No servers. No surveillance.
          Just your browser.
        </p>
        <p style={{ ...bodyText, marginBottom: "24px" }}>
          Everything we build follows three principles:
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "40px",
          }}
        >
          {["Privacy by default", "Open source", "Community-driven"].map(
            (label) => (
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
            )
          )}
        </div>

        <div
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
