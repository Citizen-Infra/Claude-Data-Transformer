import type { SkillCatalogEntry } from "../lib/types";

export const SKILLS_CATALOG: SkillCatalogEntry[] = [
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
  {
    skill_id: "brainstorming",
    name: "Brainstorming",
    source: "community",
    domains: ["planning", "creative", "strategy"],
    work_patterns: ["brainstorming", "ideation", "project-planning"],
    description:
      "Transforms rough ideas into fully-formed designs through structured questioning and alternative exploration. From the Superpowers library.",
    url: "https://github.com/obra/superpowers/tree/main/skills/brainstorming",
  },
  {
    skill_id: "playwright-skill",
    name: "Playwright Browser Automation",
    source: "community",
    domains: ["development", "testing", "automation"],
    work_patterns: ["browser-testing", "test-writing", "automation"],
    description:
      "General-purpose browser automation using Playwright for end-to-end testing, scraping, and workflow automation.",
    url: "https://github.com/lackeyjb/playwright-skill",
  },
  {
    skill_id: "web-asset-generator",
    name: "Web Asset Generator",
    source: "community",
    domains: ["design", "development", "web"],
    work_patterns: ["frontend-building", "web-development", "visual-styling"],
    description:
      "Generate favicons, app icons, and social media images (Open Graph, Twitter Cards) for web projects.",
    url: "https://github.com/alonw0/web-asset-generator",
  },
  {
    skill_id: "pm-skills",
    name: "Product Management Skills",
    source: "community",
    domains: ["product-management", "business", "strategy"],
    work_patterns: ["project-planning", "roadmap-creation", "content-planning"],
    description:
      "24 product management skills across the Triple Diamond lifecycle — discovery, PRDs, roadmapping, and prioritization.",
    url: "https://github.com/product-on-purpose/pm-skills",
  },
  {
    skill_id: "aws-skills",
    name: "AWS Development Skills",
    source: "community",
    domains: ["development", "cloud", "devops"],
    work_patterns: ["server-building", "automation", "api-integration"],
    description:
      "AWS development with CDK best practices, cost optimization, serverless patterns, and event-driven architecture.",
    url: "https://github.com/zxkane/aws-skills",
  },
  {
    skill_id: "meeting-insights",
    name: "Meeting Insights Analyzer",
    source: "community",
    domains: ["productivity", "communication", "business"],
    work_patterns: ["content-planning", "status-reporting", "data-analysis"],
    description:
      "Transform meeting transcripts into actionable insights about communication patterns, decisions, and action items.",
    url: "https://github.com/ComposioHQ/awesome-claude-skills/blob/master/meeting-insights-analyzer",
  },
  {
    skill_id: "invoice-organizer",
    name: "Invoice Organizer",
    source: "community",
    domains: ["finance", "automation", "productivity"],
    work_patterns: ["data-analysis", "automation", "formatting"],
    description:
      "Automatically organize invoices and receipts for tax preparation, expense tracking, and financial record-keeping.",
    url: "https://github.com/ComposioHQ/awesome-claude-skills/blob/master/invoice-organizer",
  },
  {
    skill_id: "trail-of-bits-security",
    name: "Security Code Auditing",
    source: "community",
    domains: ["security", "development", "quality"],
    work_patterns: ["code-review", "security-testing", "root-cause-analysis"],
    description:
      "Static analysis with CodeQL/Semgrep, variant analysis, code auditing, and fix verification. By Trail of Bits.",
    url: "https://github.com/trailofbits/skills",
  },
];
