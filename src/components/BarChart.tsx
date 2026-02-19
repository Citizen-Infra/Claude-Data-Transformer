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
          className="bar-chart-row"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "14px",
          }}
        >
          <div
            className="bar-label"
            style={{
              width: "110px",
              fontSize: "13px",
              color: "#333",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
            }}
          >
            {b.category}
          </div>
          <div
            style={{
              flex: 1,
              height: "14px",
              background: "#e8e5df",
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
              fontSize: "13px",
              fontWeight: 500,
              color: "#444",
              width: "40px",
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
