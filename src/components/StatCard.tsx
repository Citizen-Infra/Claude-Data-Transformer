interface StatCardProps {
  value: string;
  label: string;
}

export default function StatCard({ value, label }: StatCardProps) {
  return (
    <div
      style={{
        padding: "20px 28px",
        background: "#fff",
        border: "1px solid #e0e0e0",
        borderRadius: "12px",
        minWidth: "130px",
      }}
    >
      <div
        style={{
          fontFamily: "'DM Serif Display', Georgia, serif",
          fontSize: "26px",
          fontWeight: 400,
          color: "#1a1a1a",
          marginBottom: "4px",
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
