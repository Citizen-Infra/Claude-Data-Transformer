const C = {
  dark: "#1a3a2a",
  mid: "#2d5a3f",
  cardBg: "#e8f0eb",
  border: "#e0e0e0",
  body: "#555",
  subtle: "#888",
};

interface PrivacyMonitorProps {
  phase: "upload" | "narrating" | "preview";
  dataSource: "file" | "persona" | null;
}

export default function PrivacyMonitor({ phase, dataSource }: PrivacyMonitorProps) {
  let statusText: string;
  let dotColor: string;

  switch (phase) {
    case "narrating":
      statusText = "Parsing locally — no network requests";
      dotColor = C.mid;
      break;
    case "preview":
      statusText =
        dataSource === "persona"
          ? "Sample mode · No outgoing requests — your data stays in your browser"
          : "No outgoing requests — your data stays in your browser";
      dotColor = C.mid;
      break;
    default:
      statusText = "No file loaded";
      dotColor = C.subtle;
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 16px",
        background: C.cardBg,
        borderRadius: "8px",
        marginTop: "16px",
      }}
    >
      {/* Shield icon */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke={dotColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0 }}
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>

      {/* Pulsing dot */}
      <span
        className={phase !== "upload" ? "privacy-dot" : ""}
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: dotColor,
          flexShrink: 0,
        }}
      />

      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "11px",
          color: C.body,
          letterSpacing: "0.3px",
        }}
      >
        {statusText}
      </span>

      {/* Right side: request count */}
      <span
        style={{
          marginLeft: "auto",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "11px",
          color: C.subtle,
          flexShrink: 0,
        }}
      >
        {dataSource === "persona" ? "sample · 0 requests" : "0 requests this session"}
      </span>
    </div>
  );
}
