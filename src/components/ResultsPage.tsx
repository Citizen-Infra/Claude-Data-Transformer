import type { AnalysisResults, AppView } from "../lib/types";
import StatCard from "./StatCard";
import BarChart from "./BarChart";
import TagCloud from "./TagCloud";
import SkillCard from "./SkillCard";
import SkillBuilderCard from "./SkillBuilderCard";

interface ResultsPageProps {
  results: AnalysisResults;
  onNavigate: (view: AppView) => void;
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

export default function ResultsPage({ results, onNavigate }: ResultsPageProps) {
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
          background: "#fff",
          padding: "64px 24px 80px",
          textAlign: "center",
        }}
      >
        <div style={{ ...sectionLabel, color: C.mid, marginBottom: "16px" }}>
          Your results
        </div>
        <h1
          style={{
            ...headline,
            fontSize: "clamp(30px, 5vw, 46px)",
            color: C.ink,
            maxWidth: "600px",
            margin: "0 auto 16px",
          }}
        >
          Claude convos, decoded.
        </h1>
        <p
          style={{
            fontSize: "16px",
            lineHeight: 1.7,
            color: C.body,
            maxWidth: "520px",
            margin: "0 auto",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Based on your conversation history, here's your usage breakdown
          and skill recommendations ranked by fit.
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
            border: `1px solid ${C.border}`,
            boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
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
      <section
        id="results-build"
        style={{
          padding: "0 24px 56px",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <SkillBuilderCard variant="results" />
      </section>

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
          Browse the full catalog
        </h2>
        <p
          style={{
            ...bodyText,
            margin: "0 auto 28px",
            textAlign: "center",
            maxWidth: "520px",
          }}
        >
          The Skills Commons is an open, community-curated collection of Skills
          for everyone. Browse what others have built, contribute your own, and
          help close the gap between tools and the people who need them.
        </p>
        <button
          onClick={() => onNavigate("commons")}
          style={{
            padding: "13px 28px",
            background: C.mid,
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "15px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Browse the Skills Commons &rarr;
        </button>
      </section>
    </div>
  );
}
