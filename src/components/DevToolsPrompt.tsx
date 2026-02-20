import { useState, useMemo } from "react";

const C = {
  green: "#1a3a2a",
  greenPale: "#e8f0eb",
  greenLight: "#c8ddd0",
  cream: "#f5f0e8",
  text: "#1a1a18",
  textMuted: "#4d4943",
  warmGray: "#5e594f",
  warmGrayLight: "#76716a",
  border: "#d8d2c6",
  borderLight: "#e8e2d6",
  white: "#ffffff",
};

const mono = "'DM Mono', 'IBM Plex Mono', monospace";
const sans = "'DM Sans', 'Helvetica Neue', sans-serif";

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

function getShortcutRows(env: EnvInfo): { label: string; keys: string[] }[] {
  if (env.browser === "safari") {
    return [{ label: "Open Developer Tools", keys: ["\u2318", "\u2325 Option", "I"] }];
  }
  if (env.os === "mac") {
    return [
      { label: "Open Developer Tools", keys: ["\u2318", "\u2325 Option", "I"] },
      { label: "Alternative", keys: ["F12"] },
    ];
  }
  return [
    { label: "Open Developer Tools", keys: ["F12"] },
    { label: "Alternative", keys: ["Ctrl", "Shift", "I"] },
  ];
}

export default function DevToolsPrompt() {
  const [open, setOpen] = useState(false);
  const env = useMemo(detectEnv, []);
  const shortcutRows = useMemo(() => getShortcutRows(env), [env]);

  return (
    <div style={{ marginTop: "16px" }}>
      {/* Summary row — dark green bar matching PrivacyMonitor style */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "8px",
          padding: "12px 18px",
          background: C.green,
          borderRadius: open ? "10px 10px 0 0" : "10px",
          cursor: "pointer",
          transition: "border-radius 0.15s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 }}>
          {/* Shield icon */}
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

          <span style={{
            fontFamily: mono,
            fontSize: "11.5px",
            color: "#d4e8dc",
            fontWeight: 500,
          }}>
            Want proof?
          </span>

          <span style={{
            fontFamily: mono,
            fontSize: "11.5px",
            color: "#9dcbad",
          }}>
            Open dev tools and watch the Network tab
          </span>
        </div>

        <span
          style={{
            fontFamily: mono,
            fontSize: "12px",
            color: "#7dba96",
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
            display: "inline-block",
            flexShrink: 0,
          }}
        >
          ▾
        </span>
      </div>

      {/* Expanded content */}
      {open && (
        <div
          style={{
            padding: "20px",
            background: C.white,
            border: `1px solid ${C.border}`,
            borderTop: `1px solid ${C.borderLight}`,
            borderRadius: "0 0 10px 10px",
            animation: "revealUp 0.2s ease",
          }}
        >
          {/* Detected badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "16px",
            }}
          >
            <span
              style={{
                fontFamily: mono,
                fontSize: "10px",
                color: C.warmGray,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Detected:
            </span>
            <span
              style={{
                padding: "3px 10px",
                fontFamily: mono,
                fontSize: "11px",
                fontWeight: 500,
                color: C.green,
                background: C.greenPale,
                border: `1px solid ${C.greenLight}`,
                borderRadius: "4px",
              }}
            >
              {env.label}
            </span>
          </div>

          {/* How to open label */}
          <div
            style={{
              fontFamily: mono,
              fontSize: "10px",
              color: C.warmGray,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "10px",
            }}
          >
            How to open dev tools
          </div>

          {/* Keyboard shortcut rows */}
          {shortcutRows.map((row, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: `1px solid ${C.borderLight}`,
              }}
            >
              <span style={{ fontFamily: sans, fontSize: "13px", color: C.text }}>
                {row.label}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                {row.keys.map((k, ki) => (
                  <span
                    key={ki}
                    style={{ display: "flex", alignItems: "center", gap: "4px" }}
                  >
                    <kbd
                      style={{
                        display: "inline-block",
                        padding: "3px 8px",
                        fontFamily: mono,
                        fontSize: "11px",
                        fontWeight: 500,
                        color: C.text,
                        background: C.white,
                        border: `1px solid ${C.border}`,
                        borderRadius: "4px",
                        boxShadow: "0 1px 0 rgba(0,0,0,0.06)",
                      }}
                    >
                      {k}
                    </kbd>
                    {ki < row.keys.length - 1 && (
                      <span
                        style={{
                          fontFamily: mono,
                          fontSize: "9px",
                          color: C.warmGrayLight,
                        }}
                      >
                        +
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}

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
                marginTop: "12px",
              }}
            >
              Safari requires a one-time setup: Open Safari → Settings → Advanced
              → check "Show features for web developers"
            </div>
          )}

          {/* Steps */}
          <div
            style={{
              padding: "16px",
              background: C.cream,
              border: `1px solid ${C.borderLight}`,
              borderRadius: "8px",
              marginTop: "16px",
            }}
          >
            <div
              style={{
                fontFamily: mono,
                fontSize: "10px",
                color: C.warmGray,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "12px",
              }}
            >
              Then
            </div>
            {[
              "Click the Network tab at the top of the dev tools panel",
              "Upload your file (or try a persona demo)",
              "Watch the network log — in default mode, it stays completely empty",
            ].map((step, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "10px",
                  marginBottom: i < 2 ? "10px" : 0,
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: C.green,
                    color: C.cream,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: mono,
                    fontSize: "10px",
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <span
                  style={{
                    fontFamily: sans,
                    fontSize: "13px",
                    color: C.textMuted,
                    lineHeight: 1.5,
                  }}
                >
                  {step}
                </span>
              </div>
            ))}

            {/* Footer note */}
            <div
              style={{
                marginTop: "14px",
                paddingTop: "12px",
                borderTop: `1px solid ${C.borderLight}`,
                fontFamily: sans,
                fontSize: "12.5px",
                color: C.warmGray,
                fontStyle: "italic",
                lineHeight: 1.55,
              }}
            >
              If you enable AI mode, you'll see requests only to{" "}
              <code
                style={{
                  fontFamily: mono,
                  fontSize: "11px",
                  background: C.white,
                  padding: "1px 5px",
                  borderRadius: "3px",
                }}
              >
                api.anthropic.com
              </code>{" "}
              — nothing to our servers, because we don't have any.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
