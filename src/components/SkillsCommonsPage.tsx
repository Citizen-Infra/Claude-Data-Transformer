import { useState, useMemo } from "react";
import { SKILLS_CATALOG } from "../data/skillsCatalog";
import SkillBuilderCard from "./SkillBuilderCard";
import type { AppView, UserProfile, EnrichedRecommendation, SkillCatalogEntry } from "../lib/types";

/* ── Design tokens ── */
const C = {
  green: "#1a3a2a",
  greenMuted: "#2d5a3f",
  greenLight: "#c8ddd0",
  greenPale: "#e8f0eb",
  cream: "#f5f0e8",
  creamDark: "#ebe5d9",
  text: "#1a1a18",
  textMuted: "#4d4943",
  warmGray: "#5e594f",
  warmGrayLight: "#76716a",
  border: "#d8d2c6",
  borderLight: "#e8e2d6",
  white: "#ffffff",
};

const mono = "'DM Mono', 'IBM Plex Mono', monospace";
const sans = "'DM Sans', 'Helvetica Neue', sans-serif";

/* ── Domain / source metadata ── */
const DOMAINS = ["all", "writing", "code", "design", "data", "business", "research", "creative", "productivity"] as const;
const SOURCES = ["all", "anthropic", "community", "skillsmp", "skillhub"] as const;

const sourceLabels: Record<string, string> = {
  anthropic: "Anthropic",
  community: "Community",
  skillsmp: "SkillsMP",
  skillhub: "SkillHub",
};

const domainEmoji: Record<string, string> = {
  writing: "\u270D\uFE0F",
  code: "\u2328\uFE0F",
  design: "\uD83C\uDFA8",
  data: "\uD83D\uDCCA",
  business: "\uD83D\uDCBC",
  research: "\uD83D\uDD2C",
  creative: "\uD83C\uDFAD",
  productivity: "\u26A1",
  development: "\u2328\uFE0F",
  testing: "\uD83E\uDDEA",
  security: "\uD83D\uDD12",
  automation: "\u2699\uFE0F",
  planning: "\uD83D\uDCCB",
  finance: "\uD83D\uDCB0",
};

/* ── Normalize catalog domains to our filter set ── */
function normalizeDomain(d: string): string {
  const map: Record<string, string> = {
    development: "code",
    debugging: "code",
    testing: "code",
    web: "code",
    cloud: "code",
    devops: "code",
    security: "code",
    quality: "code",
    visualization: "data",
    analysis: "data",
    marketing: "writing",
    publishing: "writing",
    communication: "business",
    "project-management": "productivity",
    "product-management": "business",
    ux: "design",
    presentation: "business",
    strategy: "business",
    finance: "business",
    "problem-solving": "productivity",
    planning: "productivity",
    creative: "creative",
  };
  return map[d] || d;
}

/* ── Props ── */
interface SkillsCommonsPageProps {
  userProfile?: UserProfile | null;
  recommendations?: EnrichedRecommendation[] | null;
  onNavigate: (view: AppView) => void;
}

/* ── Sub-components ── */

function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 14px",
        border: `1px solid ${active ? C.green : C.border}`,
        borderRadius: "20px",
        background: active ? C.green : "transparent",
        color: active ? C.cream : C.textMuted,
        fontFamily: sans,
        fontSize: "12.5px",
        fontWeight: active ? 500 : 400,
        cursor: "pointer",
        transition: "all 0.15s ease",
        textTransform: "capitalize",
      }}
    >
      {label}
    </button>
  );
}

function SkillCardCommons({
  skill,
  showMatch,
  matchScore,
}: {
  skill: SkillCatalogEntry;
  showMatch: boolean;
  matchScore?: number;
}) {
  const [hover, setHover] = useState(false);
  const score = matchScore ?? 0;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: "24px",
        background: C.white,
        border: `1.5px solid ${hover ? C.greenMuted : C.borderLight}`,
        borderRadius: "12px",
        transition: "all 0.2s ease",
        transform: hover ? "translateY(-2px)" : "none",
        boxShadow: hover ? "0 6px 16px rgba(0,0,0,0.06)" : "0 1px 3px rgba(0,0,0,0.02)",
        display: "flex",
        flexDirection: "column" as const,
        gap: "12px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ fontFamily: sans, fontSize: "16px", fontWeight: 600, color: C.text }}>
          {skill.name}
        </div>
        <span
          style={{
            fontFamily: mono,
            fontSize: "10px",
            padding: "3px 8px",
            borderRadius: "4px",
            flexShrink: 0,
            background: skill.source === "anthropic" ? C.greenPale : C.creamDark,
            color: skill.source === "anthropic" ? C.green : C.warmGray,
            border: `1px solid ${skill.source === "anthropic" ? C.greenLight : C.border}`,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {sourceLabels[skill.source] || skill.source}
        </span>
      </div>

      {/* Description */}
      <div
        style={{
          fontFamily: sans,
          fontSize: "13.5px",
          color: C.textMuted,
          lineHeight: 1.6,
          flex: 1,
        }}
      >
        {skill.description}
      </div>

      {/* Domain tags */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {skill.domains.slice(0, 3).map((d) => (
          <span
            key={d}
            style={{
              fontFamily: mono,
              fontSize: "10px",
              color: C.warmGray,
              padding: "3px 8px",
              background: C.cream,
              borderRadius: "4px",
              border: `1px solid ${C.borderLight}`,
            }}
          >
            {domainEmoji[d] || ""} {d}
          </span>
        ))}
      </div>

      {/* Match bar (conditional) */}
      {showMatch && score > 0 && (
        <div>
          <div
            style={{
              height: "4px",
              background: C.borderLight,
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${score}%`,
                background: score > 70 ? C.green : score > 50 ? C.greenMuted : C.warmGrayLight,
                borderRadius: "2px",
                transition: "width 0.4s ease",
              }}
            />
          </div>
          <div
            style={{
              fontFamily: mono,
              fontSize: "10.5px",
              color: C.warmGray,
              marginTop: "4px",
            }}
          >
            {score}% match
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
        <a
          href={skill.url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: sans,
            fontSize: "12.5px",
            color: C.green,
            fontWeight: 500,
            cursor: "pointer",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            textDecorationColor: C.greenLight,
          }}
        >
          View skill &rarr;
        </a>
      </div>
    </div>
  );
}

function ContributePath({
  number,
  title,
  subtitle,
  steps,
  bestFor,
}: {
  number: string;
  title: string;
  subtitle: string;
  steps: string[];
  bestFor: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        padding: "24px",
        background: C.white,
        border: `1.5px solid ${C.borderLight}`,
        borderRadius: "12px",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "6px" }}>
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: C.green,
            color: C.cream,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: mono,
            fontSize: "11px",
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          {number}
        </div>
        <div style={{ fontFamily: sans, fontSize: "16px", fontWeight: 600, color: C.text }}>
          {title}
        </div>
      </div>
      <div
        style={{
          fontFamily: sans,
          fontSize: "13.5px",
          color: C.textMuted,
          lineHeight: 1.6,
          marginBottom: "14px",
          paddingLeft: "36px",
        }}
      >
        {subtitle}
      </div>

      <button
        onClick={() => setOpen(!open)}
        style={{
          fontFamily: sans,
          fontSize: "13px",
          color: C.green,
          fontWeight: 500,
          cursor: "pointer",
          paddingLeft: "36px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: "none",
          border: "none",
        }}
      >
        {open ? "Hide steps" : "See how it works"}
        <span
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
            display: "inline-block",
            fontFamily: mono,
            fontSize: "11px",
          }}
        >
          &#9662;
        </span>
      </button>

      {open && (
        <div style={{ paddingLeft: "36px", marginTop: "14px" }}>
          {steps.map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "10px",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  fontFamily: mono,
                  fontSize: "11px",
                  color: C.greenMuted,
                  flexShrink: 0,
                  width: "16px",
                }}
              >
                {i + 1}.
              </span>
              <span
                style={{
                  fontFamily: sans,
                  fontSize: "13px",
                  color: C.textMuted,
                  lineHeight: 1.55,
                }}
              >
                {s}
              </span>
            </div>
          ))}
          <div
            style={{
              marginTop: "12px",
              padding: "10px 14px",
              background: C.cream,
              borderRadius: "6px",
              fontFamily: sans,
              fontSize: "12.5px",
              color: C.warmGray,
              border: `1px solid ${C.borderLight}`,
            }}
          >
            <strong style={{ color: C.text }}>Best for:</strong> {bestFor}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main page ── */
export default function SkillsCommonsPage({
  userProfile,
  recommendations,
  onNavigate,
}: SkillsCommonsPageProps) {
  const [domainFilter, setDomainFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  const hasProfile = !!userProfile && !!recommendations && recommendations.length > 0;
  const [showMatch, setShowMatch] = useState(hasProfile);

  // Build a map from skill_id → relevance_score
  const matchMap = useMemo(() => {
    if (!recommendations) return new Map<string, number>();
    const m = new Map<string, number>();
    for (const rec of recommendations) {
      m.set(rec.skill_id, Math.round(rec.relevance_score * 100));
    }
    return m;
  }, [recommendations]);

  // Compute unique domain counts from catalog
  const allDomains = useMemo(() => {
    const s = new Set<string>();
    SKILLS_CATALOG.forEach((sk) => sk.domains.forEach((d) => s.add(normalizeDomain(d))));
    return s.size;
  }, []);

  // Filter skills
  const filtered = useMemo(() => {
    let skills = [...SKILLS_CATALOG];
    if (domainFilter !== "all") {
      skills = skills.filter((sk) =>
        sk.domains.some((d) => normalizeDomain(d) === domainFilter)
      );
    }
    if (sourceFilter !== "all") {
      skills = skills.filter((sk) => sk.source === sourceFilter);
    }
    // Sort: by match score if available and showing, else alphabetical
    if (showMatch && hasProfile) {
      skills.sort((a, b) => (matchMap.get(b.skill_id) ?? 0) - (matchMap.get(a.skill_id) ?? 0));
    } else {
      skills.sort((a, b) => a.name.localeCompare(b.name));
    }
    return skills;
  }, [domainFilter, sourceFilter, showMatch, hasProfile, matchMap]);

  // Count unique contributors (unique sources)
  const contributorCount = useMemo(() => {
    const s = new Set<string>();
    SKILLS_CATALOG.forEach((sk) => {
      if (sk.url) {
        // Extract GitHub org/user from URL
        const match = sk.url.match(/github\.com\/([^/]+)/);
        if (match) s.add(match[1]);
      }
    });
    return s.size;
  }, []);

  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      {/* ═══ HERO ═══ */}
      <div
        style={{
          background: C.green,
          padding: "72px 32px 56px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: mono,
            fontSize: "10.5px",
            color: "#7dba96",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            marginBottom: "16px",
          }}
        >
          Community-built
        </div>
        <h1
          style={{
            fontFamily: sans,
            fontSize: "42px",
            fontWeight: 600,
            color: C.cream,
            lineHeight: 1.15,
            marginBottom: "16px",
            letterSpacing: "-0.02em",
          }}
        >
          The Skills Commons
        </h1>
        <p
          style={{
            fontFamily: sans,
            fontSize: "17px",
            color: "#b8cfc0",
            lineHeight: 1.6,
            maxWidth: "520px",
            margin: "0 auto 28px",
          }}
        >
          Community-built instruction sets that make Claude smarter for everyone.
          Open, community-governed, and growing.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="#browse"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("browse")?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{
              padding: "12px 24px",
              background: C.cream,
              color: C.green,
              borderRadius: "8px",
              fontFamily: sans,
              fontSize: "14px",
              fontWeight: 500,
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            Browse skills &darr;
          </a>
          <a
            href="#contribute"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("contribute")?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{
              padding: "12px 24px",
              background: "transparent",
              color: C.cream,
              border: "1.5px solid #7dba96",
              borderRadius: "8px",
              fontFamily: sans,
              fontSize: "14px",
              fontWeight: 500,
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            Contribute a skill &darr;
          </a>
        </div>
      </div>

      {/* Stats bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "48px",
          padding: "20px 32px",
          background: C.white,
          borderBottom: `1px solid ${C.borderLight}`,
          flexWrap: "wrap",
        }}
      >
        {[
          { value: SKILLS_CATALOG.length, label: "Skills" },
          { value: contributorCount, label: "Contributors" },
          { value: allDomains, label: "Domains" },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: mono, fontSize: "22px", fontWeight: 600, color: C.text }}>
              {s.value}
            </div>
            <div
              style={{
                fontFamily: mono,
                fontSize: "10px",
                color: C.warmGray,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 24px" }}>
        {/* ═══ HOW IT WORKS ═══ */}
        <div id="commons-how" style={{ padding: "56px 0 48px", scrollMarginTop: "88px" }}>
          <div
            style={{
              fontFamily: mono,
              fontSize: "10.5px",
              color: C.warmGray,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "8px",
            }}
          >
            How the commons works
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "16px",
              marginTop: "20px",
            }}
          >
            {[
              {
                icon: "\uD83C\uDF10",
                title: "Skills come from everywhere",
                body: "The commons is fed by Anthropic's official repo, community contributions on GitHub, and aggregator APIs that index thousands of skills across the ecosystem.",
              },
              {
                icon: "\uD83D\uDD0D",
                title: "Every skill is profiled",
                body: "When a skill enters the commons, Claude analyzes its SKILL.md to understand what domains it serves, what work patterns it supports, and what it pairs well with.",
              },
              {
                icon: "\uD83D\uDCE6",
                title: "You install what fits",
                body: "Skills are just folders. Download the ones that match how you work, drop them into your Claude setup, and they start working immediately. No accounts, no lock-in.",
              },
            ].map((card, i) => (
              <div
                key={i}
                style={{
                  padding: "28px 24px",
                  background: C.white,
                  border: `1px solid ${C.borderLight}`,
                  borderRadius: "12px",
                }}
              >
                <div style={{ fontSize: "24px", marginBottom: "12px" }}>{card.icon}</div>
                <div
                  style={{
                    fontFamily: sans,
                    fontSize: "15px",
                    fontWeight: 600,
                    color: C.text,
                    marginBottom: "8px",
                  }}
                >
                  {card.title}
                </div>
                <div
                  style={{
                    fontFamily: sans,
                    fontSize: "13.5px",
                    color: C.textMuted,
                    lineHeight: 1.65,
                  }}
                >
                  {card.body}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ BROWSE SKILLS ═══ */}
        <div id="browse" style={{ paddingBottom: "56px", scrollMarginTop: "88px" }}>
          <div
            style={{
              fontFamily: mono,
              fontSize: "10.5px",
              color: C.warmGray,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "8px",
            }}
          >
            Browse skills
          </div>
          <h2
            style={{
              fontFamily: sans,
              fontSize: "26px",
              fontWeight: 600,
              color: C.text,
              marginBottom: "20px",
            }}
          >
            Find what fits how you work.
          </h2>

          {/* Domain filter */}
          <div style={{ marginBottom: "12px" }}>
            <div
              style={{
                fontFamily: mono,
                fontSize: "10px",
                color: C.warmGray,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "8px",
              }}
            >
              Domain
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {DOMAINS.map((d) => (
                <Pill
                  key={d}
                  label={d}
                  active={domainFilter === d}
                  onClick={() => setDomainFilter(d)}
                />
              ))}
            </div>
          </div>

          {/* Source filter */}
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontFamily: mono,
                fontSize: "10px",
                color: C.warmGray,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "8px",
              }}
            >
              Source
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {SOURCES.map((s) => (
                <Pill
                  key={s}
                  label={s === "all" ? "All sources" : sourceLabels[s]}
                  active={sourceFilter === s}
                  onClick={() => setSourceFilter(s)}
                />
              ))}
            </div>
          </div>

          {/* Match toggle (only if user has a profile) */}
          {hasProfile && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "20px",
              }}
            >
              <div
                onClick={() => setShowMatch(!showMatch)}
                style={{
                  width: "36px",
                  height: "20px",
                  borderRadius: "10px",
                  background: showMatch ? C.green : C.border,
                  cursor: "pointer",
                  position: "relative",
                  transition: "background 0.2s",
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    background: C.white,
                    position: "absolute",
                    top: "2px",
                    left: showMatch ? "18px" : "2px",
                    transition: "left 0.2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                  }}
                />
              </div>
              <span style={{ fontFamily: sans, fontSize: "13px", color: C.textMuted }}>
                Show my match scores
              </span>
              <span style={{ fontFamily: mono, fontSize: "10.5px", color: C.warmGrayLight }}>
                (from your analysis)
              </span>
            </div>
          )}

          {/* Results count */}
          <div
            style={{
              fontFamily: mono,
              fontSize: "11px",
              color: C.warmGray,
              marginBottom: "16px",
            }}
          >
            {filtered.length} skill{filtered.length !== 1 ? "s" : ""}
            {domainFilter !== "all" ? ` in ${domainFilter}` : ""}
            {sourceFilter !== "all" ? ` from ${sourceLabels[sourceFilter]}` : ""}
          </div>

          {/* Skill grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "14px",
            }}
          >
            {filtered.map((skill) => (
              <SkillCardCommons
                key={skill.skill_id}
                skill={skill}
                showMatch={showMatch && hasProfile}
                matchScore={matchMap.get(skill.skill_id)}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "48px 24px",
                fontFamily: sans,
                fontSize: "15px",
                color: C.textMuted,
              }}
            >
              No skills match the current filters. Try adjusting your domain or source selection.
            </div>
          )}
        </div>

        {/* ═══ CONTRIBUTE ═══ */}
        <div
          id="contribute"
          style={{
            padding: "56px 0 64px",
            borderTop: `1px solid ${C.borderLight}`,
            scrollMarginTop: "88px",
          }}
        >
          <div
            style={{
              fontFamily: mono,
              fontSize: "10.5px",
              color: C.warmGray,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "8px",
            }}
          >
            Contribute
          </div>
          <h2
            style={{
              fontFamily: sans,
              fontSize: "26px",
              fontWeight: 600,
              color: C.text,
              marginBottom: "8px",
            }}
          >
            Build from what you know.{" "}
            <em style={{ fontStyle: "italic", color: C.greenMuted }}>
              Share it with everyone.
            </em>
          </h2>
          <p
            style={{
              fontFamily: sans,
              fontSize: "15px",
              color: C.textMuted,
              lineHeight: 1.65,
              marginBottom: "28px",
              maxWidth: "580px",
            }}
          >
            Every skill in the commons started with someone who knew something well
            enough to teach it to Claude. Your domain expertise, your workflow
            shortcuts, your hard-won processes — they can help thousands of people.
          </p>

          {/* Three paths */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              marginBottom: "36px",
            }}
          >
            <ContributePath
              number="1"
              title="Publish to GitHub"
              subtitle="Push your skill folder to any public repo. Community indexers automatically discover and catalog it within 24\u201348 hours."
              steps={[
                "Build your skill using the prompt below (or by hand)",
                "Create a public GitHub repo with your skill folder",
                "Include a SKILL.md with YAML frontmatter (name, description)",
                "Indexers like SkillsMP and SkillHub discover it automatically",
                "It appears in the commons within 24\u201348 hours",
              ]}
              bestFor="Developers and people already on GitHub who want to maintain and version their skills."
            />
            <ContributePath
              number="2"
              title="Submit directly here"
              subtitle="Drop your SKILL.md file and we\u2019ll handle the rest \u2014 Claude profiles it in your browser and we create a PR to the commons repo."
              steps={[
                "Build your skill using the prompt below",
                "Drop your SKILL.md file into the upload zone (coming soon)",
                "Claude analyzes it in your browser and generates catalog metadata",
                "Review the generated profile, edit if needed",
                "We create a pull request to the commons repo on your behalf",
                "After community review, it goes live",
              ]}
              bestFor="Non-developers and one-off contributions. No GitHub account needed."
            />
            <ContributePath
              number="3"
              title="Submit to a community catalog"
              subtitle="Go directly to SkillsMP or SkillHub and follow their submission process. Skills submitted there are automatically pulled into the commons."
              steps={[
                "Visit SkillsMP.com or SkillHub.club",
                "Follow their submission and review process",
                "Your skill gets indexed and AI-evaluated by their systems",
                "It appears in our commons automatically \u2014 we pull from these sources",
              ]}
              bestFor="People who want maximum distribution across the entire skills ecosystem."
            />
          </div>

          {/* Skill Builder Card (reusable component) */}
          <SkillBuilderCard variant="homepage" />

          {/* What makes a good skill */}
          <div style={{ marginTop: "40px" }}>
            <div
              style={{
                fontFamily: sans,
                fontSize: "16px",
                fontWeight: 600,
                color: C.text,
                marginBottom: "14px",
              }}
            >
              What makes a good skill
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "12px",
              }}
            >
              {[
                { title: "Focused scope", desc: "One skill, one job. Specific beats general." },
                {
                  title: "Clear instructions",
                  desc: "Write like you\u2019re explaining to a smart new hire.",
                },
                {
                  title: "Real examples",
                  desc: "Include sample inputs and expected outputs.",
                },
                {
                  title: "YAML frontmatter",
                  desc: "Name and description so the commons can index it.",
                },
                {
                  title: "Tested first",
                  desc: "Use it yourself before sharing. Quality matters.",
                },
              ].map((tip, i) => (
                <div
                  key={i}
                  style={{
                    padding: "16px",
                    background: C.white,
                    border: `1px solid ${C.borderLight}`,
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: sans,
                      fontSize: "13px",
                      fontWeight: 600,
                      color: C.text,
                      marginBottom: "4px",
                    }}
                  >
                    {tip.title}
                  </div>
                  <div
                    style={{
                      fontFamily: sans,
                      fontSize: "12.5px",
                      color: C.textMuted,
                      lineHeight: 1.55,
                    }}
                  >
                    {tip.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Back to analyzer CTA ═══ */}
      <div
        style={{
          padding: "48px 32px",
          background: C.green,
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: sans,
            fontSize: "24px",
            fontWeight: 600,
            color: C.cream,
            marginBottom: "10px",
          }}
        >
          Want personalized recommendations?
        </h2>
        <p
          style={{
            fontFamily: sans,
            fontSize: "15px",
            color: "#b8cfc0",
            lineHeight: 1.6,
            maxWidth: "460px",
            margin: "0 auto 24px",
          }}
        >
          Upload your Claude history and we'll match skills to the work you actually do.
        </p>
        <button
          onClick={() => onNavigate("landing")}
          style={{
            padding: "12px 28px",
            background: C.cream,
            color: C.green,
            border: "none",
            borderRadius: "8px",
            fontFamily: sans,
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Analyze my Claude history &rarr;
        </button>
      </div>
    </div>
  );
}
