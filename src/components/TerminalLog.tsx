import type { LogEntry } from "../lib/types";

interface TerminalLogProps {
  log: LogEntry[];
  showCursor: boolean;
}

export default function TerminalLog({ log, showCursor }: TerminalLogProps) {
  return (
    <div
      style={{
        background: "#1a3a2a",
        padding: "20px 24px",
        borderRadius: "12px",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "12px",
        lineHeight: 2,
        maxHeight: "240px",
        overflowY: "auto",
      }}
    >
      {log.map((e, i) => (
        <div
          key={i}
          style={{
            color: e.msg.startsWith("Error")
              ? "#fca5a5"
              : "rgba(255,255,255,0.6)",
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.25)" }}>{e.time}</span>{" "}
          {e.msg}
        </div>
      ))}
      {showCursor && (
        <div style={{ color: "rgba(255,255,255,0.3)" }}>
          <span className="blink">▊</span>
        </div>
      )}
    </div>
  );
}
