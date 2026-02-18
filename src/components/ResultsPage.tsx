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
        style={{
          background: `linear-gradient(135deg, ${C.dark} 0%, ${C.mid} 100%)`,
          padding: "64px 24px 80px",
          textAlign: "center",
        }}
      >
        <div style={{ ...sectionLabel, color: C.accent, marginBottom: "16px" }}>
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
          Here's what we found.
        </h1>
        <p
          style={{
            fontSize: "16px",
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.6)",
            maxWidth: "480px",
            margin: "0 auto",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Your Claude history reveals how you think, what you build, and where
          your mind keeps returning.
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

      {/* ─── Install guide ─── */}
      <section
        style={{
          padding: "56px 24px",
          background: `linear-gradient(135deg, ${C.dark} 0%, ${C.mid} 100%)`,
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ ...sectionLabel, color: C.accent }}>Get set up</div>
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
              color: "rgba(255,255,255,0.5)",
              marginBottom: "32px",
              maxWidth: "560px",
            }}
          >
            Skills are custom instructions that give Claude specialized
            abilities. Here's how to add them in three simple steps.
          </p>

          {/* Steps */}
          <div
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
                  color: "rgba(255,255,255,0.5)",
                  margin: 0,
                }}
              >
                In Claude.ai, go to your <strong style={{ color: "rgba(255,255,255,0.75)" }}>Profile → Settings</strong> and
                find the <strong style={{ color: "rgba(255,255,255,0.75)" }}>Skills</strong> section. Make sure skills
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
                  color: "rgba(255,255,255,0.5)",
                  margin: 0,
                }}
              >
                Click <strong style={{ color: "rgba(255,255,255,0.75)" }}>Add skill</strong> and
                paste the URL to any skill — like a GitHub link to
                a <code
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "11px",
                    background: "rgba(255,255,255,0.1)",
                    padding: "2px 6px",
                    borderRadius: "4px",
                  }}
                >SKILL.md</code> file.
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
                  color: "rgba(255,255,255,0.5)",
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
                <strong style={{ color: "rgba(255,255,255,0.75)" }}>automatically</strong> when
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
                color: "rgba(255,255,255,0.6)",
                margin: 0,
              }}
            >
              <strong style={{ color: "rgba(255,255,255,0.8)" }}>Tip:</strong>{" "}
              Click any skill card above to go straight to its page — then copy the URL
              and paste it into the "Add skill" dialog in Claude.ai.
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
