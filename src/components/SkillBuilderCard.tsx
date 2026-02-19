import { useState } from "react";

const C = {
  green: "#1a3a2a",
  greenMuted: "#2d5a3f",
  cream: "#f5f0e8",
  text: "#1a1a18",
  textMuted: "#4d4943",
  warmGray: "#5e594f",
  border: "#d8d2c6",
  borderLight: "#e8e2d6",
  white: "#ffffff",
};

const mono = "'DM Mono', 'IBM Plex Mono', monospace";
const sans = "'DM Sans', 'Helvetica Neue', sans-serif";

const SKILL_PROMPT =
  "Use the skill-creator skill to help me build a skill for [describe your use case]. Walk me through defining use cases, writing the SKILL.md with proper YAML frontmatter, and structuring the folder. Output the final skill as a downloadable folder I can install.";

const VARIANTS = {
  homepage: {
    label: "Skills Commons",
    headline: (
      <>
        Build a skill.{" "}
        <em style={{ fontStyle: "italic", color: C.greenMuted }}>
          Share it with everyone.
        </em>
      </>
    ),
    body: "The Skills Commons is a community-built library of instruction sets that make Claude smarter for everyone. Every skill you create and share helps someone else skip the learning curve. Build from your expertise — contribute what you know.",
    pills: [
      { icon: "\uD83C\uDF31", text: "Community-built, open to all" },
      { icon: "\u270F\uFE0F", text: "No code required" },
      { icon: "\uD83D\uDD01", text: "Build once, share forever" },
    ],
    primaryBtn: "Copy skill-builder prompt",
    secondaryLabel: "Browse the Skills Commons \u2192",
    secondaryHref: "#",
  },
  results: {
    label: "Build your own",
    headline: (
      <>
        Not seeing a skill you need?{" "}
        <em style={{ fontStyle: "italic", color: C.greenMuted }}>
          Make one.
        </em>
      </>
    ),
    body: "Skills are simple instruction folders that teach Claude repeatable workflows \u2014 your processes, your standards, your domain expertise. Describe what you need and Claude will build a ready-to-install skill for you.",
    pills: [
      { icon: "\u23F1", text: "Under 5 minutes to build" },
      { icon: "\u270F\uFE0F", text: "No code required" },
      { icon: "\u26A1", text: "Works across Claude.ai & Code" },
    ],
    primaryBtn: "Copy skill-builder prompt",
    secondaryLabel: "Read the full guide \u2192",
    secondaryHref:
      "https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf",
  },
} as const;

export type SkillBuilderVariant = keyof typeof VARIANTS;

interface SkillBuilderCardProps {
  variant: SkillBuilderVariant;
  onSecondaryClick?: () => void;
}

export default function SkillBuilderCard({ variant, onSecondaryClick }: SkillBuilderCardProps) {
  const [copied, setCopied] = useState(false);
  const content = VARIANTS[variant];

  const handleCopy = () => {
    navigator.clipboard?.writeText(SKILL_PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        background: C.white,
        border: `1.5px solid ${C.borderLight}`,
        borderRadius: "14px",
        padding: "40px 36px 36px",
      }}
    >
      {/* Label */}
      <div
        style={{
          fontFamily: mono,
          fontSize: "10.5px",
          color: C.warmGray,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: "12px",
        }}
      >
        {content.label}
      </div>

      {/* Headline */}
      <h3
        style={{
          fontFamily: sans,
          fontSize: "26px",
          fontWeight: 600,
          color: C.text,
          lineHeight: 1.25,
          marginBottom: "14px",
          letterSpacing: "-0.01em",
        }}
      >
        {content.headline}
      </h3>

      {/* Body */}
      <p
        style={{
          fontFamily: sans,
          fontSize: "15px",
          color: C.textMuted,
          lineHeight: 1.65,
          marginBottom: "20px",
          maxWidth: "580px",
        }}
      >
        {content.body}
      </p>

      {/* Pills */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "28px",
        }}
      >
        {content.pills.map((pill, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 14px",
              border: `1px solid ${C.border}`,
              borderRadius: "20px",
              fontFamily: sans,
              fontSize: "12.5px",
              color: C.textMuted,
            }}
          >
            <span style={{ fontSize: "13px" }}>{pill.icon}</span>
            {pill.text}
          </div>
        ))}
      </div>

      {/* Prompt block */}
      <div
        style={{
          background: C.green,
          borderRadius: "10px",
          padding: "20px 22px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            fontFamily: mono,
            fontSize: "10px",
            color: "#7dba96",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "10px",
          }}
        >
          {copied ? "\u2713 Copied to clipboard" : "Prompt \u2014 click below to copy"}
        </div>
        <div
          style={{
            fontFamily: mono,
            fontSize: "13px",
            color: "#d4e8dc",
            lineHeight: 1.65,
          }}
        >
          Use the skill-creator skill to help me build a skill for{" "}
          <span
            style={{
              color: C.cream,
              borderBottom: "1px dashed #7dba96",
              fontStyle: "italic",
            }}
          >
            [describe your use case]
          </span>
          . Walk me through defining use cases, writing the SKILL.md with proper
          YAML frontmatter, and structuring the folder. Output the final skill as
          a downloadable folder I can install.
        </div>
      </div>

      {/* Buttons */}
      <div
        className="skill-builder-buttons"
        style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}
      >
        <button
          onClick={handleCopy}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 24px",
            background: C.green,
            color: C.cream,
            border: "none",
            borderRadius: "8px",
            fontFamily: sans,
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <rect
              x="5"
              y="5"
              width="9"
              height="9"
              rx="1.5"
              stroke="#c8ddd0"
              strokeWidth="1.3"
            />
            <path
              d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5"
              stroke="#c8ddd0"
              strokeWidth="1.3"
            />
          </svg>
          {copied ? "Copied!" : content.primaryBtn}
        </button>
        <a
          href={onSecondaryClick ? undefined : content.secondaryHref}
          target={onSecondaryClick ? undefined : "_blank"}
          rel={onSecondaryClick ? undefined : "noopener noreferrer"}
          onClick={onSecondaryClick ? (e) => { e.preventDefault(); onSecondaryClick(); } : undefined}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 24px",
            background: "transparent",
            color: C.text,
            border: `1.5px solid ${C.border}`,
            borderRadius: "8px",
            fontFamily: sans,
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 3h5v10H2zM9 3h5v10H9z"
              stroke={C.warmGray}
              strokeWidth="1.2"
            />
          </svg>
          {content.secondaryLabel}
        </a>
      </div>
    </div>
  );
}
