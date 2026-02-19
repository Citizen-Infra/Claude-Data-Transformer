import { useState, useMemo } from "react";

const C = {
  dark: "#1a3a2a",
  mid: "#2d5a3f",
  cardBg: "#e8f0eb",
  border: "#e0e0e0",
  ink: "#1a1a1a",
  body: "#555",
  subtle: "#888",
};

interface EnvInfo {
  os: "mac" | "windows" | "linux" | "unknown";
  browser: "chrome" | "edge" | "firefox" | "safari" | "unknown";
  label: string;
}

function detectEnv(): EnvInfo {
  const ua = navigator.userAgent.toLowerCase();
  const platform = (
    (navigator as unknown as { userAgentData?: { platform?: string } })
      .userAgentData?.platform || navigator.platform || ""
  ).toLowerCase();

  let os: EnvInfo["os"] = "unknown";
  if (platform.includes("mac") || ua.includes("macintosh")) os = "mac";
  else if (platform.includes("win") || ua.includes("windows")) os = "windows";
  else if (platform.includes("linux") || ua.includes("linux")) os = "linux";

  let browser: EnvInfo["browser"] = "unknown";
  if (ua.includes("edg/")) browser = "edge";
  else if (ua.includes("chrome") && !ua.includes("edg")) browser = "chrome";
  else if (ua.includes("firefox")) browser = "firefox";
  else if (ua.includes("safari") && !ua.includes("chrome")) browser = "safari";

  const osName = { mac: "Mac", windows: "Windows", linux: "Linux", unknown: "Unknown OS" }[os];
  const browserName = {
    chrome: "Chrome",
    edge: "Edge",
    firefox: "Firefox",
    safari: "Safari",
    unknown: "Browser",
  }[browser];

  return { os, browser, label: `${browserName} on ${osName}` };
}

function getShortcuts(env: EnvInfo): { primary: string; alt?: string } {
  if (env.browser === "safari") {
    return { primary: "⌘ + ⌥ Option + I" };
  }
  if (env.os === "mac") {
    return { primary: "⌘ + ⌥ Option + I", alt: "F12" };
  }
  return { primary: "F12", alt: "Ctrl + Shift + I" };
}

export default function DevToolsPrompt() {
  const [open, setOpen] = useState(false);
  const env = useMemo(detectEnv, []);
  const shortcuts = useMemo(() => getShortcuts(env), [env]);

  return (
    <div
      style={{
        marginTop: "12px",
        border: `1px solid ${C.border}`,
        borderRadius: "10px",
        overflow: "hidden",
        background: "#fff",
      }}
    >
      {/* Summary row */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 16px",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "13px",
          color: C.body,
          textAlign: "left",
        }}
      >
        <span style={{ fontSize: "14px", flexShrink: 0 }}>🔍</span>
        <span>
          Want proof? Open your browser's{" "}
          <span
            style={{
              textDecoration: "underline",
              textUnderlineOffset: "3px",
              color: C.mid,
              fontWeight: 600,
            }}
          >
            dev tools
          </span>{" "}
          and watch the Network tab during upload.
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke={C.subtle}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            flexShrink: 0,
            marginLeft: "auto",
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Expanded content */}
      {open && (
        <div
          style={{
            padding: "0 16px 16px",
            borderTop: `1px solid ${C.border}`,
          }}
        >
          {/* Detected environment badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              background: C.cardBg,
              borderRadius: "6px",
              marginTop: "12px",
              marginBottom: "16px",
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                color: C.mid,
                fontWeight: 500,
              }}
            >
              Detected: {env.label}
            </span>
          </div>

          {/* Keyboard shortcuts */}
          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                color: C.ink,
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Open Dev Tools
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <kbd
                style={{
                  display: "inline-block",
                  padding: "4px 10px",
                  background: C.dark,
                  color: "#fff",
                  borderRadius: "6px",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "12px",
                  fontWeight: 500,
                }}
              >
                {shortcuts.primary}
              </kbd>
              {shortcuts.alt && (
                <>
                  <span
                    style={{
                      fontSize: "12px",
                      color: C.subtle,
                      alignSelf: "center",
                    }}
                  >
                    or
                  </span>
                  <kbd
                    style={{
                      display: "inline-block",
                      padding: "4px 10px",
                      background: "#f5f5f5",
                      color: C.ink,
                      borderRadius: "6px",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "12px",
                      fontWeight: 500,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    {shortcuts.alt}
                  </kbd>
                </>
              )}
            </div>
          </div>

          {/* Safari note */}
          {env.browser === "safari" && (
            <div
              style={{
                padding: "8px 12px",
                background: "#fffbeb",
                border: "1px solid #fde68a",
                borderRadius: "6px",
                fontSize: "12px",
                color: "#92400e",
                lineHeight: 1.5,
                marginBottom: "16px",
              }}
            >
              Safari requires a one-time setup: Open Safari → Settings → Advanced
              → check "Show features for web developers"
            </div>
          )}

          {/* Steps */}
          <ol
            style={{
              margin: "0 0 16px 0",
              paddingLeft: "20px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              color: C.body,
              lineHeight: 1.8,
            }}
          >
            <li>
              Click the <strong style={{ color: C.ink }}>Network</strong> tab at
              the top of the dev tools panel
            </li>
            <li>Upload your file (or try a persona demo)</li>
            <li>
              Watch the network log —{" "}
              <strong style={{ color: C.mid }}>it stays completely empty</strong>
            </li>
          </ol>

          {/* Footer */}
          <p
            style={{
              margin: 0,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              fontStyle: "italic",
              color: C.subtle,
              lineHeight: 1.6,
            }}
          >
            You should see zero network requests during parsing and analysis.
            Everything runs in your browser.
          </p>
        </div>
      )}
    </div>
  );
}
