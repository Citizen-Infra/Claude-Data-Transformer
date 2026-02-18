import { useEffect, useRef, useState } from "react";
import type { EnrichedRecommendation } from "../lib/types";

interface SkillCardProps {
  recommendation: EnrichedRecommendation;
}

export default function SkillCard({ recommendation: rec }: SkillCardProps) {
  const score = Math.round(rec.relevance_score * 100);
  const url = rec.skill?.url;
  const domains = rec.skill?.domains || [];
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Animate ring on scroll into view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // SVG ring math: circumference of r=24 circle = 2*π*24 ≈ 150.8
  const circumference = 150.8;
  const offset = circumference * (1 - score / 100);

  // Format domains for display (capitalize)
  const formatDomain = (d: string) =>
    d.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const card = (
    <div
      ref={ref}
      className={`skill-card ${visible ? "skill-card-visible" : ""}`}
      style={{
        background: "#fff",
        border: `1px solid ${hovered ? "#d5d0ca" : "#e8e4df"}`,
        borderRadius: "16px",
        padding: "24px 28px",
        cursor: url ? "pointer" : "default",
        transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        boxShadow: hovered
          ? "0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.06)"
          : "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
        transform: hovered ? "translateY(-2px)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header: title + badge | ring */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          marginBottom: "8px",
        }}
      >
        {/* Left: name + badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <h3
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: "1.25rem",
              fontWeight: 400,
              color: "#1a1a1a",
              letterSpacing: "-0.01em",
              margin: 0,
            }}
          >
            {rec.skill?.name}
          </h3>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "3px 10px",
              background: "#f0ece7",
              borderRadius: "100px",
              fontSize: "0.65rem",
              fontWeight: 600,
              color: "#7a7168",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: rec.skill?.source === "anthropic" ? "#2d6a4f" : "#52b788",
                opacity: 0.6,
              }}
            />
            {rec.skill?.source === "anthropic" ? "Official" : "Community"}
          </span>
        </div>

        {/* Right: match ring */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2px",
            flexShrink: 0,
          }}
        >
          <div style={{ position: "relative", width: "40px", height: "40px" }}>
            <svg
              viewBox="0 0 56 56"
              style={{
                transform: "rotate(-90deg)",
                width: "40px",
                height: "40px",
              }}
            >
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="#e8e4df"
                strokeWidth="3.5"
              />
              <circle
                cx="28"
                cy="28"
                r="24"
                className="match-ring-fill"
                style={{
                  strokeDashoffset: visible ? offset : circumference,
                }}
              />
            </svg>
            <span
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'DM Serif Display', Georgia, serif",
                fontSize: "0.8rem",
                fontWeight: 700,
                color: "#2d6a4f",
              }}
            >
              {score}
            </span>
          </div>
          <span
            style={{
              fontSize: "0.6rem",
              fontWeight: 600,
              color: "#9b9590",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Match
          </span>
        </div>
      </div>

      {/* Body: tags + description */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {/* Domain tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {domains.map((d, i) => (
            <span
              key={i}
              className="match-tag"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "5px 12px",
                background: "#e8f5e9",
                borderRadius: "100px",
                fontSize: "0.78rem",
                fontWeight: 500,
                color: "#2d6a4f",
                transition: "background 0.2s ease",
              }}
            >
              {formatDomain(d)}
            </span>
          ))}
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: "0.88rem",
            lineHeight: 1.6,
            color: "#6b6560",
            margin: 0,
          }}
        >
          {rec.skill?.description}
        </p>
      </div>
    </div>
  );

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none", color: "inherit", display: "block" }}
      >
        {card}
      </a>
    );
  }

  return card;
}
