interface TagCloudProps {
  tags: string[];
  variant?: "domain" | "artifact";
}

export default function TagCloud({ tags, variant = "domain" }: TagCloudProps) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
      {tags.map((tag, i) => (
        <span
          key={i}
          style={{
            padding: "5px 12px",
            borderRadius: "6px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "12px",
            border: `1px solid ${variant === "artifact" ? "#bbf7d0" : "#e0e0e0"}`,
            background: variant === "artifact" ? "#e8f0eb" : "#f7f5f0",
            color: variant === "artifact" ? "#2d5a3f" : "#555",
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
