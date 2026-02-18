import type { EnrichedRecommendation } from "../lib/types";

interface SkillCardProps {
  recommendation: EnrichedRecommendation;
}

export default function SkillCard({ recommendation: rec }: SkillCardProps) {
  const score = Math.round(rec.relevance_score * 100);
  const scoreColor =
    rec.relevance_score >= 0.8
      ? "#1a3a2a"
      : rec.relevance_score >= 0.6
      ? "#2d5a3f"
      : "#888";

  return (
    <div
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: "12px",
        padding: "24px",
        background: "#fff",
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: "18px",
              color: "#1a1a1a",
            }}
          >
            {rec.skill?.name}
          </span>
          <span
            style={{
              padding: "3px 10px",
              borderRadius: "6px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              background:
                rec.skill?.source === "anthropic" ? "#f7f5f0" : "#e8f0eb",
              color:
                rec.skill?.source === "anthropic" ? "#888" : "#2d5a3f",
            }}
          >
            {rec.skill?.source === "anthropic" ? "Official" : "Community"}
          </span>
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "22px",
            fontWeight: 600,
            color: scoreColor,
            lineHeight: 1,
          }}
        >
          {score}
        </div>
      </div>
      <div
        style={{
          fontSize: "15px",
          color: "#1a1a1a",
          lineHeight: 1.65,
          marginBottom: "8px",
        }}
      >
        {rec.reasoning}
      </div>
      <div style={{ fontSize: "14px", color: "#888", lineHeight: 1.55 }}>
        {rec.skill?.description}
      </div>
    </div>
  );
}
