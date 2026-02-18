import type { SkillCatalogEntry } from "../lib/types";

export const SKILLS_CATALOG: SkillCatalogEntry[] = [
  {
    skill_id: "docx",
    name: "Word Documents",
    source: "anthropic",
    domains: ["writing", "business", "documentation"],
    work_patterns: ["document-creation", "report-writing", "template-filling"],
    description:
      "Create and edit professional Word documents with formatting, tables of contents, headers, and page numbers.",
    url: "https://github.com/anthropics/skills/tree/main/skills/docx",
  },
  {
    skill_id: "xlsx",
    name: "Excel Spreadsheets",
    source: "anthropic",
    domains: ["data", "finance", "analysis"],
    work_patterns: ["data-analysis", "spreadsheet-creation", "financial-modeling"],
    description:
      "Build spreadsheets with formulas, charts, conditional formatting, and pivot-table-ready layouts.",
    url: "https://github.com/anthropics/skills/tree/main/skills/xlsx",
  },
  {
    skill_id: "pptx",
    name: "PowerPoint Presentations",
    source: "anthropic",
    domains: ["design", "business", "communication"],
    work_patterns: ["presentation-design", "pitch-decks", "slide-creation"],
    description:
      "Create polished slide decks with layouts, speaker notes, and visual hierarchy.",
    url: "https://github.com/anthropics/skills/tree/main/skills/pptx",
  },
  {
    skill_id: "pdf",
    name: "PDF Tools",
    source: "anthropic",
    domains: ["documents", "forms", "extraction"],
    work_patterns: ["pdf-reading", "form-filling", "document-merging"],
    description:
      "Read, create, merge, split, and fill PDF forms programmatically.",
    url: "https://github.com/anthropics/skills/tree/main/skills/pdf",
  },
  {
    skill_id: "frontend-design",
    name: "Frontend Design",
    source: "anthropic",
    domains: ["design", "development", "web"],
    work_patterns: ["ui-design", "component-creation", "web-development"],
    description:
      "Create distinctive, production-grade frontend interfaces with high design quality.",
    url: "https://github.com/anthropics/skills/tree/main/skills/frontend-design",
  },
  {
    skill_id: "algorithmic-art",
    name: "Algorithmic Art",
    source: "community",
    domains: ["creative", "generative", "visual"],
    work_patterns: ["art-generation", "creative-coding", "visualization"],
    description:
      "Generate algorithmic art using SVG, Canvas, and mathematical patterns.",
    url: "https://github.com/anthropics/skills/tree/main/skills/algorithmic-art",
  },
  {
    skill_id: "mcp-builder",
    name: "MCP Server Builder",
    source: "community",
    domains: ["development", "integration", "tooling"],
    work_patterns: ["api-integration", "server-building", "tool-creation"],
    description:
      "Build Model Context Protocol servers to connect Claude to external services.",
    url: "https://github.com/anthropics/skills/tree/main/skills/mcp-builder",
  },
  {
    skill_id: "brand-guidelines",
    name: "Brand Guidelines",
    source: "community",
    domains: ["design", "marketing", "brand-identity"],
    work_patterns: ["document-creation", "presentation-design", "content-review"],
    description:
      "Apply consistent brand guidelines across all documents and presentations.",
    url: "https://github.com/anthropics/skills/tree/main/skills/brand-guidelines",
  },
  {
    skill_id: "test-app",
    name: "Web App Testing",
    source: "community",
    domains: ["development", "testing", "quality"],
    work_patterns: ["test-writing", "debugging", "code-review"],
    description:
      "Structured methodology for testing web applications with automated test generation.",
    url: "https://github.com/anthropics/skills/tree/main/skills/webapp-testing",
  },
  {
    skill_id: "data-viz",
    name: "Data Visualization",
    source: "community",
    domains: ["data", "visualization", "analysis"],
    work_patterns: ["chart-creation", "data-exploration", "dashboard-building"],
    description:
      "Create interactive data visualizations using D3, Recharts, and Plotly.",
    url: "https://github.com/anthropics/skills",
  },
  {
    skill_id: "systematic-debugging",
    name: "Systematic Debugging",
    source: "community",
    domains: ["development", "debugging", "problem-solving"],
    work_patterns: ["debugging", "root-cause-analysis", "code-review"],
    description:
      "Four-phase debugging methodology enforcing root cause analysis before proposing fixes.",
    url: "https://github.com/anthropics/skills",
  },
  {
    skill_id: "content-strategy",
    name: "Content Strategy",
    source: "community",
    domains: ["writing", "marketing", "seo"],
    work_patterns: ["content-planning", "blog-writing", "social-media"],
    description:
      "Plan and create content strategies with SEO optimization and audience targeting.",
    url: "https://github.com/anthropics/skills",
  },
];
