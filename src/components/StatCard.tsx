interface StatCardProps {
  value: string;
  label: string;
}

export default function StatCard({ value, label }: StatCardProps) {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontFamily: "'DM Serif Display', Georgia, serif",
          fontSize: "28px",
          fontWeight: 400,
          color: "#1a3a2a",
          marginBottom: "4px",
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "10px",
          fontWeight: 500,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          color: "#888",
        }}
      >
        {label}
      </div>
    </div>
  );
}
