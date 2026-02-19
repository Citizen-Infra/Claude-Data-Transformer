import type { SkillCatalogEntry } from "../lib/types";

export const SKILLS_CATALOG: SkillCatalogEntry[] = [
  // ─── Official Anthropic community repo ───
  {
    skill_id: "canvas-design",
    name: "Canvas Design",
    source: "anthropic",
    domains: ["design", "creative", "visual"],
    work_patterns: ["poster-design", "visual-art", "art-generation"],
    description:
      "Create sophisticated visual art in PNG and PDF formats using a design-philosophy-first approach — 90% visual, 10% text.",
    url: "https://github.com/anthropics/skills/tree/main/skills/canvas-design",
  },
  {
    skill_id: "doc-coauthoring",
    name: "Doc Co-authoring",
    source: "anthropic",
    domains: ["writing", "documentation", "business"],
    work_patterns: ["co-authoring", "document-creation", "content-planning"],
    description:
      "A structured 3-stage workflow for co-authoring documentation, proposals, technical specs, and decision docs.",
    url: "https://github.com/anthropics/skills/tree/main/skills/doc-coauthoring",
  },
  {
    skill_id: "internal-comms",
    name: "Internal Comms",
    source: "anthropic",
    domains: ["communication", "business", "writing"],
    work_patterns: ["status-reporting", "newsletter-writing", "document-creation"],
    description:
      "Compose internal communications: 3P updates, newsletters, FAQs, status reports, leadership updates, and incident reports.",
    url: "https://github.com/anthropics/skills/tree/main/skills/internal-comms",
  },
  {
    skill_id: "mcp-builder",
    name: "MCP Server Builder",
    source: "anthropic",
    domains: ["development", "integration", "tooling"],
    work_patterns: ["api-integration", "server-building", "tool-creation"],
    description:
      "Build Model Context Protocol servers to connect Claude to external services across 4 phases: research, implementation, review, evaluation.",
    url: "https://github.com/anthropics/skills/tree/main/skills/mcp-builder",
  },
  {
    skill_id: "skill-creator",
    name: "Skill Creator",
    source: "anthropic",
    domains: ["development", "tooling", "meta"],
    work_patterns: ["template-creation", "tool-creation", "automation"],
    description:
      "Interactive guide for building new Claude Skills with proper structure, progressive disclosure, and bundled resources.",
    url: "https://github.com/anthropics/skills/tree/main/skills/skill-creator",
  },
  {
    skill_id: "theme-factory",
    name: "Theme Factory",
    source: "anthropic",
    domains: ["design", "business", "presentation"],
    work_patterns: ["theming", "visual-styling", "presentation-design"],
    description:
      "Apply consistent professional styling with 10 pre-set themes (plus custom generation) to slides, docs, reports, and HTML pages.",
    url: "https://github.com/anthropics/skills/tree/main/skills/theme-factory",
  },
  {
    skill_id: "web-artifacts-builder",
    name: "Web Artifacts Builder",
    source: "anthropic",
    domains: ["development", "design", "web"],
    work_patterns: ["frontend-building", "component-creation", "web-development"],
    description:
      "Create multi-component HTML artifacts using React 18, TypeScript, Tailwind CSS, and 40+ shadcn/ui components.",
    url: "https://github.com/anthropics/skills/tree/main/skills/web-artifacts-builder",
  },
  {
    skill_id: "webapp-testing",
    name: "Web App Testing",
    source: "anthropic",
    domains: ["development", "testing", "quality"],
    work_patterns: ["browser-testing", "test-writing", "debugging"],
    description:
      "Test local web applications using Playwright with automated server lifecycle management and DOM inspection.",
    url: "https://github.com/anthropics/skills/tree/main/skills/webapp-testing",
  },
  {
    skill_id: "brand-guidelines",
    name: "Brand Guidelines",
    source: "anthropic",
    domains: ["design", "marketing", "brand-identity"],
    work_patterns: ["brand-consistency", "styling", "document-creation"],
    description:
      "Apply consistent brand colors, typography, and visual identity across all documents and presentations.",
    url: "https://github.com/anthropics/skills/tree/main/skills/brand-guidelines",
  },
  {
    skill_id: "slack-gif-creator",
    name: "Slack GIF Creator",
    source: "anthropic",
    domains: ["creative", "communication", "design"],
    work_patterns: ["gif-animation", "visual-art", "content-planning"],
    description:
      "Create animated GIFs optimized for Slack with proper dimensions, frame rates, and easing functions.",
    url: "https://github.com/anthropics/skills/tree/main/skills/slack-gif-creator",
  },

  // ─── Community skills ───
  {
    skill_id: "systematic-debugging",
    name: "Systematic Debugging",
    source: "community",
    domains: ["development", "debugging", "problem-solving"],
    work_patterns: ["debugging", "root-cause-analysis", "code-review"],
    description:
      "Four-phase debugging methodology enforcing root cause analysis before proposing fixes. From the Superpowers library.",
    url: "https://github.com/obra/superpowers/blob/main/skills/systematic-debugging",
  },
  {
    skill_id: "tdd",
    name: "Test-Driven Development",
    source: "community",
    domains: ["development", "testing", "quality"],
    work_patterns: ["test-writing", "tdd", "code-review"],
    description:
      "Enforces TDD workflow: write tests before implementation code for any feature or bugfix. From the Superpowers library.",
    url: "https://github.com/obra/superpowers/tree/main/skills/test-driven-development",
  },
  {
    skill_id: "d3js-viz",
    name: "D3.js Data Visualization",
    source: "community",
    domains: ["data", "visualization", "analysis"],
    work_patterns: ["chart-creation", "data-exploration", "dashboard-building"],
    description:
      "Create interactive data visualizations using D3.js for charts, dashboards, and data exploration.",
    url: "https://github.com/chrisvoncsefalvay/claude-d3js-skill",
  },
  {
    skill_id: "content-research-writer",
    name: "Content Research Writer",
    source: "community",
    domains: ["writing", "marketing", "research"],
    work_patterns: ["content-planning", "blog-writing", "research-writing"],
    description:
      "Write high-quality content with research, citations, hooks, and iterative outlines for blogs, articles, and marketing copy.",
    url: "https://github.com/ComposioHQ/awesome-claude-skills/tree/master/content-research-writer",
  },
  {
    skill_id: "revealjs",
    name: "Reveal.js Presentations",
    source: "community",
    domains: ["presentation", "business", "communication"],
    work_patterns: ["slide-creation", "presentation-design", "pitch-decks"],
    description:
      "Generate polished HTML presentations using the Reveal.js framework with themes, transitions, and speaker notes.",
    url: "https://github.com/ryanbbrown/revealjs-skill",
  },
  {
    skill_id: "owasp-security",
    name: "OWASP Security Review",
    source: "community",
    domains: ["security", "development", "quality"],
    work_patterns: ["code-review", "security-testing", "debugging"],
    description:
      "OWASP Top 10:2025, ASVS 5.0, and Agentic AI security with code review checklists and secure patterns for 20+ languages.",
    url: "https://github.com/agamm/claude-code-owasp",
  },
  {
    skill_id: "csv-summarizer",
    name: "CSV Data Summarizer",
    source: "community",
    domains: ["data", "analysis", "automation"],
    work_patterns: ["data-analysis", "data-exploration", "spreadsheet-creation"],
    description:
      "Automatically analyze CSVs: columns, distributions, missing data, and correlations for quick data understanding.",
    url: "https://github.com/coffeefuelbump/csv-data-summarizer-claude-skill",
  },
  {
    skill_id: "ui-ux-guide",
    name: "UI/UX Design Guide",
    source: "community",
    domains: ["design", "ux", "development"],
    work_patterns: ["ui-design", "component-creation", "code-review"],
    description:
      "Modern UI/UX guidance covering CRAP principles, task-first UX, HCI laws, and interaction psychology for design reviews.",
    url: "https://github.com/oil-oil/oiloil-ui-ux-guide",
  },
  {
    skill_id: "kanban",
    name: "Kanban Board",
    source: "community",
    domains: ["project-management", "productivity", "planning"],
    work_patterns: ["task-tracking", "project-planning", "automation"],
    description:
      "Markdown-based Kanban board with file-based cards, YAML frontmatter for status/priority/dependencies — no database required.",
    url: "https://github.com/mattjoyce/kanban-skill",
  },
  {
    skill_id: "epub-creator",
    name: "EPUB Creator",
    source: "community",
    domains: ["writing", "publishing", "creative"],
    work_patterns: ["document-creation", "content-planning", "formatting"],
    description:
      "Convert markdown documents, chat summaries, or research reports into downloadable EPUB files for e-readers and Kindle.",
    url: "https://github.com/smerchek/claude-epub-skill",
  },
];
