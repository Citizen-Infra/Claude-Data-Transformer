import { useState, useSyncExternalStore } from "react";
import { subscribe, getSnapshot } from "../lib/networkLog";
import type { NetworkRequest } from "../lib/networkLog";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function formatDuration(ms: number | null): string {
  if (ms === null) return "...";
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function StatusDot({ req }: { req: NetworkRequest }) {
  if (req.error) {
    return (
      <span
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "#ef4444",
          flexShrink: 0,
        }}
      />
    );
  }
  if (req.status === null) {
    return (
      <span
        className="network-pending-pulse"
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "#fbbf24",
          flexShrink: 0,
        }}
      />
    );
  }
  return (
    <span
      style={{
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        background: req.status >= 200 && req.status < 300 ? "#22c55e" : "#ef4444",
        flexShrink: 0,
      }}
    />
  );
}

export default function NetworkInspector() {
  const requests = useSyncExternalStore(subscribe, getSnapshot);
  const [expanded, setExpanded] = useState(false);

  const pendingCount = requests.filter((r) => r.status === null && !r.error).length;
  const hasRequests = requests.length > 0;

  const statusText = !hasRequests
    ? "No outgoing requests — your data stays in your browser"
    : pendingCount > 0
    ? `${requests.length} request${requests.length > 1 ? "s" : ""} — ${pendingCount} pending`
    : `${requests.length} request${requests.length > 1 ? "s" : ""} — all to api.anthropic.com`;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      {/* ── Expanded panel ── */}
      {expanded && (
        <div
          style={{
            background: "#1a3a2a",
            maxHeight: "240px",
            overflowY: "auto",
            padding: "12px 24px 8px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {!hasRequests ? (
            <div
              style={{
                fontSize: "12px",
                color: "rgba(255,255,255,0.5)",
                textAlign: "center",
                padding: "16px 0",
              }}
            >
              No outgoing requests have been made this session.
              <br />
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>
                In default mode, all analysis runs locally in your browser.
              </span>
            </div>
          ) : (
            <>
              {/* Header row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 56px 64px 64px",
                  gap: "12px",
                  padding: "0 0 6px",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  marginBottom: "6px",
                }}
              >
                {["Request", "Status", "Time", "Size"].map((h) => (
                  <span
                    key={h}
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.3)",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {h}
                  </span>
                ))}
              </div>

              {/* Request rows */}
              {requests.map((req) => (
                <div
                  key={req.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 56px 64px 64px",
                    gap: "12px",
                    padding: "6px 0",
                    alignItems: "center",
                  }}
                >
                  {/* Label + URL */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                    <StatusDot req={req} />
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#88E7BB",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {req.label}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        color: "rgba(255,255,255,0.3)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {req.method} api.anthropic.com
                    </span>
                  </div>

                  {/* Status */}
                  <span
                    style={{
                      fontSize: "11px",
                      color: req.error
                        ? "#ef4444"
                        : req.status === null
                        ? "#fbbf24"
                        : req.status >= 200 && req.status < 300
                        ? "#22c55e"
                        : "#ef4444",
                    }}
                  >
                    {req.error ? "ERR" : req.status ?? "..."}
                  </span>

                  {/* Duration */}
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
                    {formatDuration(req.durationMs)}
                  </span>

                  {/* Size */}
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
                    {formatBytes(req.bodyBytes)}
                  </span>
                </div>
              ))}

              {/* Trust footer */}
              <div
                style={{
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.25)",
                  textAlign: "center",
                  padding: "10px 0 4px",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  marginTop: "4px",
                }}
              >
                All requests go directly to api.anthropic.com. Nothing is sent to us.
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Collapsed bar ── */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          background: "#1a3a2a",
          height: "36px",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: "pointer",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          userSelect: "none",
        }}
      >
        {/* Shield icon */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#88E7BB"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ flexShrink: 0 }}
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>

        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "rgba(255,255,255,0.6)",
            letterSpacing: "0.3px",
          }}
        >
          Network Inspector
        </span>

        <span
          style={{
            fontSize: "11px",
            color: "rgba(255,255,255,0.35)",
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {statusText}
        </span>

        {/* Chevron */}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            flexShrink: 0,
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </div>
    </div>
  );
}
