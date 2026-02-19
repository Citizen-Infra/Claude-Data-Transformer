export default function Footer() {
  return (
    <footer
      className="site-footer"
      style={{
        padding: "24px 24px",
        borderTop: "1px solid #e0e0e0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <span
        style={{
          fontSize: "14px",
          fontWeight: 700,
          color: "#1a1a1a",
          letterSpacing: "-0.3px",
          flexShrink: 0,
        }}
      >
        claude<span style={{ color: "#2d5a3f" }}>.</span>pdt
      </span>

      <div className="footer-links" style={{ display: "flex", gap: "24px" }}>
        {[
          { label: "How it works", href: "#how-it-works" },
          { label: "Privacy", href: "#privacy" },
          { label: "GitHub", href: "https://github.com/Citizen-Infra/Claude-Data-Transformer" },
          { label: "CIBC", href: "#" },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            style={{
              fontSize: "13px",
              color: "#888",
              textDecoration: "none",
              transition: "color 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            {link.label}
          </a>
        ))}
      </div>

      <span
        className="footer-copyright"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "11px",
          color: "#888",
          flexShrink: 0,
        }}
      >
        &copy; 2025 Citizen Infrastructure &middot; Your Data, Always
      </span>
    </footer>
  );
}
