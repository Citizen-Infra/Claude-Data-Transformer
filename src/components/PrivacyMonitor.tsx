const C = {
  green: "#1a3a2a",
  greenMuted: "#2d5a3f",
  warmGray: "#5e594f",
};

interface PrivacyMonitorProps {
  phase: "upload" | "narrating" | "preview";
  dataSource: "file" | "persona" | null;
}

export default function PrivacyMonitor({ phase, dataSource }: PrivacyMonitorProps) {
  let statusText: string;

  switch (phase) {
    case "narrating":
      statusText = "Parsing locally — no network requests";
      break;
    case "preview":
      statusText =
        dataSource === "persona"
          ? "Sample mode · No outgoing requests — your data stays in your browser"
          : "No outgoing requests — your data stays in your browser";
      break;
    default:
      statusText = "No file loaded";
  }

  return (
    <div
      style={{
        marginTop: "12px",
        padding: "12px 18px",
        background: C.green,
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "8px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Shield + checkmark icon */}
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
          <path
            d="M8 1L2 4.5V8c0 3.5 2.5 6.5 6 7.5 3.5-1 6-4 6-7.5V4.5L8 1z"
            stroke="#7dba96"
            strokeWidth="1.3"
            fill="none"
          />
          <path
            d="M5.5 8L7 9.5L10.5 6"
            stroke="#7dba96"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <span
          style={{
            fontFamily: "'DM Mono', 'IBM Plex Mono', monospace",
            fontSize: "11.5px",
            color: "#d4e8dc",
            fontWeight: 500,
          }}
        >
          Privacy Monitor
        </span>

        <span
          style={{
            fontFamily: "'DM Mono', 'IBM Plex Mono', monospace",
            fontSize: "11.5px",
            color: "#9dcbad",
          }}
        >
          {statusText}
        </span>
      </div>

      <span
        style={{
          fontFamily: "'DM Mono', 'IBM Plex Mono', monospace",
          fontSize: "10.5px",
          color: "#7dba96",
          flexShrink: 0,
        }}
      >
        {dataSource === "persona" ? "sample · 0 requests" : "0 requests this session"}
      </span>
    </div>
  );
}
