import type { UsageBreakdown } from "../lib/types";

interface BarChartProps {
  data: UsageBreakdown[];
}

export default function BarChart({ data }: BarChartProps) {
  const maxPct = Math.max(...data.map((b) => b.percentage), 1);

  return (
    <div>
      {data.slice(0, 7).map((b, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              width: "100px",
              fontSize: "13px",
              color: "#555",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {b.category}
          </div>
          <div
            style={{
              flex: 1,
              height: "8px",
              background: "#e8f0eb",
              borderRadius: "100px",
              overflow: "hidden",
            }}
            role="progressbar"
            aria-valuenow={b.percentage}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              style={{
                height: "100%",
                width: `${(b.percentage / maxPct) * 100}%`,
                background: "linear-gradient(90deg, #2d5a3f, #3d7a56)",
                borderRadius: "100px",
                transition: "width 0.6s ease",
              }}
            />
          </div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px",
              color: "#888",
              width: "36px",
              textAlign: "right",
            }}
          >
            {b.percentage}%
          </div>
        </div>
      ))}
    </div>
  );
}
