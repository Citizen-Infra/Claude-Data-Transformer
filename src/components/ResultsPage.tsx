import { useState } from "react";
import type { AnalysisResults } from "../lib/types";
import StatCard from "./StatCard";
import BarChart from "./BarChart";
import TagCloud from "./TagCloud";
import SkillCard from "./SkillCard";

interface ResultsPageProps {
  results: AnalysisResults;
}

const C = {
  dark: "#1a3a2a",
  mid: "#2d5a3f",
  accent: "#3d7a56",
  mint: "#88E7BB",      // light mint for dark backgrounds
  cream: "#f7f5f0",
  surface: "#fff",
  cardBg: "#e8f0eb",
  border: "#e0e0e0",
  ink: "#1a1a1a",
  body: "#444",
  subtle: "#777",
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
  lineHeight: 1.2,
  margin: "0 0 16px 0",
};

const bodyText: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "16px",
  lineHeight: 1.7,
  color: C.body,
};

const SKILL_PROMPT =
  "Use the skill-creator skill to help me build a skill for [describe your use case]. Walk me through defining use cases, writing the SKILL.md with proper YAML frontmatter, and structuring the folder. Output the final skill as a downloadable folder I can install.";

function MakeSkillSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SKILL_PROMPT).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  return (
    <section
      id="results-build"
      style={{
        padding: "0 24px 56px",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          ...sectionLabel,
          color: C.accent,
          paddingBottom: "12px",
          borderBottom: `1px solid ${C.border}`,
          marginBottom: "32px",
        }}
      >
        Build Your Own
      </div>

      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: "16px",
          boxShadow:
            "0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(45,106,79,0.08)",
          overflow: "hidden",
        }}
      >
        {/* Thin gradient accent */}
        <div
          style={{
            height: "3px",
            background: `linear-gradient(90deg, ${C.dark} 0%, ${C.mid} 40%, #C2DFD0 100%)`,
          }}
        />

        <div className="make-skill-inner" style={{ padding: "40px" }}>
          <h2
            style={{
              ...headline,
              fontSize: "32px",
              marginBottom: "12px",
            }}
          >
            Not seeing a skill you need?{" "}
            <em
              style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                fontStyle: "italic",
                color: C.mid,
              }}
            >
              Make one.
            </em>
          </h2>

          <p
            style={{
              ...bodyText,
              maxWidth: "540px",
              marginBottom: "28px",
            }}
          >
            Skills are simple instruction folders that teach Claude repeatable
            workflows — your processes, your standards, your domain expertise.
            Describe what you need and Claude will build a ready-to-install
            skill for you.
          </p>

          {/* Feature chips */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              marginBottom: "28px",
            }}
          >
            {[
              {
                label: "Under 5 minutes to build",
                icon: (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                ),
              },
              {
                label: "No code required",
                icon: (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                ),
              },
              {
                label: "Works across Claude.ai & Code",
                icon: (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                    <line x1="4" y1="22" x2="4" y2="15" />
                  </svg>
                ),
              },
            ].map((chip) => (
              <span
                key={chip.label}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "5px 12px",
                  background: "#F2FAF5",
                  border: "1px solid #C2DFD0",
                  borderRadius: "99px",
                  fontSize: "12px",
                  color: C.mid,
                  fontWeight: 500,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {chip.icon}
                {chip.label}
              </span>
            ))}
          </div>

          {/* Prompt preview */}
          <div
            style={{
              background: C.dark,
              borderRadius: "12px",
              padding: "20px 24px",
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                color: "#C2DFD0",
                marginBottom: "10px",
                opacity: 0.7,
              }}
            >
              Prompt copied to clipboard
            </div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "13px",
                lineHeight: 1.7,
                color: "#E4F2EB",
              }}
            >
              <span style={{ color: "#fff", fontWeight: 500 }}>
                Use the skill-creator skill
              </span>{" "}
              to help me build a skill for{" "}
              <span
                style={{
                  color: "#C2DFD0",
                  fontStyle: "italic",
                  borderBottom: "1px dashed #C2DFD0",
                  paddingBottom: "1px",
                }}
              >
                [describe your use case]
              </span>
              . Walk me through defining use cases, writing the SKILL.md with
              proper YAML frontmatter, and structuring the folder. Output the
              final skill as a downloadable folder I can install.
            </div>
          </div>

          {/* Buttons */}
          <div
            className="make-skill-buttons"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={handleCopy}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: copied ? C.accent : C.mid,
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "13px 28px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.15s ease",
                lineHeight: 1,
              }}
            >
              {copied ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
              {copied ? "Copied!" : "Copy skill-builder prompt"}
            </button>

            <a
              href="https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "transparent",
                color: C.mid,
                border: `1px solid #C2DFD0`,
                borderRadius: "8px",
                padding: "12px 28px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.15s ease, border-color 0.15s ease",
                textDecoration: "none",
                lineHeight: 1,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              Read the full guide →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ResultsPage({ results }: ResultsPageProps) {
  const {
    userProfile,
    recommendations,
    dateRange,
    totalConversations,
    totalMessages,
  } = results;

  const breakdown =
    userProfile.usage_breakdown ||
    userProfile.primary_domains?.map((d, i) => ({
      category: d,
      percentage: Math.round(80 / (i + 1)),
    })) ||
    [];

  return (
    <div>
      {/* ─── Hero banner ─── */}
      <section
        id="results-overview"
        style={{
          background: `linear-gradient(135deg, ${C.dark} 0%, ${C.mid} 100%)`,
          padding: "64px 24px 80px",
          textAlign: "center",
        }}
      >
        <div style={{ ...sectionLabel, color: C.mint, marginBottom: "16px" }}>
          Your results
        </div>
        <h1
          style={{
            ...headline,
            fontSize: "clamp(30px, 5vw, 46px)",
            color: "#fff",
            maxWidth: "600px",
            margin: "0 auto 16px",
          }}
        >
          Your Claude, decoded.
        </h1>
        <p
          style={{
            fontSize: "16px",
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.75)",
            maxWidth: "520px",
            margin: "0 auto",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Based on your conversation history, here's your usage breakdown,
          skill recommendations ranked by fit, and gaps worth building.
        </p>
      </section>

      {/* ─── Stats banner (overlapping hero) ─── */}
      <section
        style={{
          maxWidth: "800px",
          margin: "-40px auto 0",
          padding: "0 24px",
        }}
      >
        <div
          className="stats-grid"
          style={{
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
            padding: "32px",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "24px",
          }}
        >
          {[
            {
              value: totalConversations.toLocaleString(),
              label: "Conversations",
            },
            { value: totalMessages.toLocaleString(), label: "Messages" },
            {
              value:
                dateRange.years < 2
                  ? `${dateRange.years}`
                  : `${Math.floor(dateRange.years)}`,
              label:
                dateRange.years === 1 ? "Year of history" : "Years of history",
            },
            {
              value: `${dateRange.earliest}`,
              label: "Active since",
            },
          ].map((s, i) => (
            <StatCard key={i} value={s.value} label={s.label} />
          ))}
        </div>
      </section>

      {/* ─── Usage signature ─── */}
      <section
        id="results-usage"
        style={{
          padding: "56px 24px 64px",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <div style={sectionLabel}>Usage signature</div>
        <h2 style={{ ...headline, fontSize: "30px", marginBottom: "10px" }}>
          How you use AI
        </h2>
        <p
          style={{
            ...bodyText,
            marginBottom: "36px",
            maxWidth: "640px",
          }}
        >
          {userProfile.persona_summary}
        </p>

        <div
          className="usage-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "48px",
          }}
        >
          <div
            style={{
              background: "#fff",
              border: `1px solid ${C.border}`,
              borderRadius: "16px",
              padding: "28px",
            }}
          >
            <div style={{ ...sectionLabel, marginBottom: "20px" }}>
              Breakdown by domain
            </div>
            <BarChart data={breakdown} />
          </div>

          <div
            style={{
              background: "#fff",
              border: `1px solid ${C.border}`,
              borderRadius: "16px",
              padding: "28px",
            }}
          >
            <div style={{ ...sectionLabel, marginBottom: "20px" }}>
              Work patterns
            </div>
            <TagCloud tags={userProfile.work_patterns || []} />

            {(userProfile.artifact_types?.length ?? 0) > 0 && (
              <>
                <div
                  style={{
                    ...sectionLabel,
                    marginBottom: "12px",
                    marginTop: "28px",
                  }}
                >
                  Artifact types
                </div>
                <TagCloud
                  tags={userProfile.artifact_types}
                  variant="artifact"
                />
              </>
            )}
          </div>
        </div>
      </section>

      {/* ─── Skill gaps ─── */}
      {(userProfile.skill_gaps?.length ?? 0) > 0 && (
        <section
          style={{
            padding: "48px 24px",
            background: C.cream,
            borderTop: `1px solid ${C.border}`,
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div style={sectionLabel}>Where skills can help</div>
            <h2
              style={{ ...headline, fontSize: "26px", marginBottom: "20px" }}
            >
              Gaps we identified
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "12px",
              }}
            >
              {userProfile.skill_gaps.map((gap, i) => (
                <div
                  key={i}
                  style={{
                    padding: "16px 20px",
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: "12px",
                    fontSize: "14px",
                    lineHeight: 1.7,
                    color: C.body,
                  }}
                >
                  {gap}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Recommendations ─── */}
      <section
        id="results-skills"
        style={{
          padding: "56px 24px",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <div style={sectionLabel}>Your recommended skills</div>
        <h2 style={{ ...headline, fontSize: "30px", marginBottom: "10px" }}>
          Skills matched to your patterns
        </h2>
        <p style={{ ...bodyText, marginBottom: "32px", maxWidth: "640px" }}>
          These are ranked by how well they fit the work you actually do with
          Claude. Click any card to learn more.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {recommendations.map((rec) => (
            <SkillCard key={rec.skill_id} recommendation={rec} />
          ))}
        </div>
      </section>

      {/* ─── Make a Skill CTA ─── */}
      <MakeSkillSection />

      {/* ─── Install guide ─── */}
      <section
        id="results-install"
        style={{
          padding: "56px 24px",
          background: `linear-gradient(135deg, ${C.dark} 0%, ${C.mid} 100%)`,
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ ...sectionLabel, color: C.mint }}>Get set up</div>
          <h2
            style={{
              ...headline,
              fontSize: "26px",
              color: "#fff",
              marginBottom: "10px",
            }}
          >
            How to install Skills
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "15px",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.75)",
              marginBottom: "32px",
              maxWidth: "560px",
            }}
          >
            Skills are custom instructions that give Claude specialized
            abilities. Here's how to add them in three simple steps.
          </p>

          {/* Steps */}
          <div
            className="install-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
              marginBottom: "32px",
            }}
          >
            {/* Step 1 */}
            <div
              style={{
                padding: "28px 24px",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "14px",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "rgba(61,122,86,0.35)",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#52b788",
                  marginBottom: "16px",
                }}
              >
                1
              </div>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#fff",
                  marginBottom: "8px",
                }}
              >
                Open Skills settings
              </div>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.75)",
                  margin: 0,
                }}
              >
                In Claude.ai, go to your <strong style={{ color: "#fff" }}>Profile → Settings</strong> and
                find the <strong style={{ color: "#fff" }}>Skills</strong> section. Make sure skills
                are enabled.
              </p>
            </div>

            {/* Step 2 */}
            <div
              style={{
                padding: "28px 24px",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "14px",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "rgba(61,122,86,0.35)",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#52b788",
                  marginBottom: "16px",
                }}
              >
                2
              </div>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#fff",
                  marginBottom: "8px",
                }}
              >
                Add a skill
              </div>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.75)",
                  margin: 0,
                }}
              >
                Click <strong style={{ color: "#fff" }}>Add skill</strong> and
                upload the <code
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "11px",
                    background: "rgba(255,255,255,0.1)",
                    padding: "2px 6px",
                    borderRadius: "4px",
                  }}
                >SKILL.md</code> file you downloaded from the skill's page.
              </p>
            </div>

            {/* Step 3 */}
            <div
              style={{
                padding: "28px 24px",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "14px",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "rgba(61,122,86,0.35)",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#52b788",
                  marginBottom: "16px",
                }}
              >
                3
              </div>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#fff",
                  marginBottom: "8px",
                }}
              >
                Use it in chat
              </div>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.75)",
                  margin: 0,
                }}
              >
                Type <code
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "11px",
                    background: "rgba(255,255,255,0.1)",
                    padding: "2px 6px",
                    borderRadius: "4px",
                  }}
                >/</code> in any conversation to see your installed skills, or
                Claude will load them{" "}
                <strong style={{ color: "#fff" }}>automatically</strong> when
                they're relevant.
              </p>
            </div>
          </div>

          {/* Tip banner */}
          <div
            style={{
              padding: "16px 24px",
              background: "rgba(82,183,136,0.1)",
              border: "1px solid rgba(82,183,136,0.2)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span style={{ fontSize: "16px" }}>💡</span>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.75)",
                margin: 0,
              }}
            >
              <strong style={{ color: "#fff" }}>Tip:</strong>{" "}
              Click any skill card above to go to its page, download
              the <code
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "11px",
                  background: "rgba(255,255,255,0.1)",
                  padding: "2px 6px",
                  borderRadius: "4px",
                }}
              >SKILL.md</code> file, then upload it in your Claude settings.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Skills commons CTA ─── */}
      <section style={{ padding: "64px 24px", textAlign: "center" }}>
        <div style={sectionLabel}>The skills commons</div>
        <h2
          style={{ ...headline, fontSize: "28px", marginBottom: "12px" }}
        >
          Want to build citizen infrastructure?
        </h2>
        <p
          style={{
            ...bodyText,
            margin: "0 auto 28px",
            textAlign: "center",
            maxWidth: "520px",
          }}
        >
          The skills commons is an open, community-curated collection of Skills
          for everyone. Upload your own, browse what others have built, and help
          close the gap between tools and the people who need them.
        </p>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "12px",
            color: C.subtle,
          }}
        >
          Coming soon &middot;{" "}
          <a
            href="#"
            style={{
              color: C.mid,
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
          >
            Get in touch →
          </a>
          {" · "}
          <a
            href="#"
            style={{
              color: C.mid,
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
          >
            Learn about CIBC →
          </a>
        </div>
      </section>
    </div>
  );
}
