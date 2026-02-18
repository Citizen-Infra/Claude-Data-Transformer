import type { ParsedConversation, UserProfile, SkillRecommendation } from "./types";
import type { SkillCatalogEntry } from "./types";

/* ──────────────────────────────────────────────────────
   Keyword dictionaries — map domains to signal words
   ────────────────────────────────────────────────────── */
const DOMAIN_KEYWORDS: Record<string, string[]> = {
  "Software Development": [
    "code", "function", "class", "api", "bug", "debug", "error", "typescript",
    "javascript", "python", "react", "component", "deploy", "git", "commit",
    "refactor", "variable", "import", "export", "npm", "package", "server",
    "database", "sql", "css", "html", "frontend", "backend", "endpoint",
    "framework", "library", "compile", "build", "test", "lint",
  ],
  "Writing & Content": [
    "write", "essay", "blog", "article", "draft", "edit", "tone", "rewrite",
    "paragraph", "outline", "headline", "copy", "proofread", "grammar",
    "narrative", "story", "content", "newsletter", "tweet", "post", "seo",
    "audience", "creative writing",
  ],
  "Data & Analysis": [
    "data", "csv", "spreadsheet", "chart", "graph", "analyze", "statistics",
    "dashboard", "metric", "kpi", "report", "trend", "visualization",
    "dataset", "excel", "pivot", "formula", "aggregate", "sql", "query",
  ],
  "Business & Strategy": [
    "strategy", "business", "plan", "market", "competitor", "revenue", "okr",
    "roadmap", "stakeholder", "pitch", "proposal", "budget", "pricing",
    "growth", "launch", "product", "customer", "user research", "mvp",
  ],
  "Design & Creative": [
    "design", "ui", "ux", "layout", "color", "font", "wireframe", "mockup",
    "figma", "prototype", "brand", "logo", "visual", "illustration",
    "svg", "canvas", "animation", "aesthetic", "responsive",
  ],
  "Research & Learning": [
    "research", "explain", "understand", "learn", "summary", "summarize",
    "compare", "difference", "how does", "what is", "overview", "pros cons",
    "literature", "study", "paper", "citation", "source",
  ],
  "Marketing & Growth": [
    "marketing", "campaign", "social media", "instagram", "linkedin",
    "email marketing", "conversion", "funnel", "ads", "branding",
    "engagement", "influencer", "analytics", "a/b test",
  ],
};

const PATTERN_KEYWORDS: Record<string, string[]> = {
  "Document creation": ["create", "generate", "write", "build", "make", "draft", "template"],
  "Code review & debugging": ["review", "debug", "fix", "error", "issue", "broken", "wrong", "bug"],
  "Data transformation": ["convert", "transform", "parse", "extract", "format", "csv", "json"],
  "Brainstorming": ["ideas", "brainstorm", "suggest", "options", "alternatives", "creative"],
  "Editing & revision": ["edit", "revise", "improve", "polish", "rewrite", "refine", "feedback"],
  "Learning & explanation": ["explain", "how", "why", "what", "teach", "learn", "understand"],
  "Automation & scripting": ["automate", "script", "batch", "cron", "schedule", "pipeline", "workflow"],
  "Project planning": ["plan", "roadmap", "milestone", "timeline", "scope", "requirements", "spec"],
};

const ARTIFACT_KEYWORDS: Record<string, string[]> = {
  "Code files": ["function", "class", "import", "export", ".py", ".ts", ".js", ".tsx"],
  "Documents & reports": ["report", "document", "memo", "brief", "whitepaper"],
  "Spreadsheets": ["spreadsheet", "excel", "csv", "table", "formula"],
  "Presentations": ["slide", "presentation", "deck", "powerpoint", "pptx"],
  "Emails & messages": ["email", "message", "subject line", "reply", "draft email"],
  "Web pages & UI": ["html", "css", "component", "page", "layout", "website"],
  "Lists & outlines": ["list", "outline", "bullet", "checklist", "todo"],
  "Creative content": ["story", "poem", "script", "dialogue", "narrative"],
};

/* ──────────────────────────────────────────────────────
   Scoring helpers
   ────────────────────────────────────────────────────── */

function getAllText(conversations: ParsedConversation[]): string {
  return conversations
    .flatMap((c) => [
      c.title || "",
      ...c.messages.map((m) => m.text || ""),
    ])
    .join(" ")
    .toLowerCase();
}

function scoreKeywords(text: string, keywords: string[]): number {
  let score = 0;
  for (const kw of keywords) {
    // Count occurrences (capped per keyword to avoid single-topic skew)
    const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "gi");
    const matches = text.match(regex);
    score += Math.min(matches?.length || 0, 50);
  }
  return score;
}

function rankMap(
  text: string,
  dict: Record<string, string[]>
): { name: string; score: number }[] {
  return Object.entries(dict)
    .map(([name, keywords]) => ({ name, score: scoreKeywords(text, keywords) }))
    .sort((a, b) => b.score - a.score);
}

/* ──────────────────────────────────────────────────────
   Main heuristic profile builder
   ────────────────────────────────────────────────────── */

export function buildHeuristicProfile(
  conversations: ParsedConversation[]
): UserProfile {
  const text = getAllText(conversations);
  const totalMessages = conversations.reduce((s, c) => s + c.message_count, 0);

  // --- Domains ---
  const domainRanks = rankMap(text, DOMAIN_KEYWORDS);
  const topDomains = domainRanks.filter((d) => d.score > 0).slice(0, 6);
  const domainTotal = topDomains.reduce((s, d) => s + d.score, 0) || 1;

  const primary_domains = topDomains.map((d) => d.name);
  const usage_breakdown = topDomains.map((d) => ({
    category: d.name,
    percentage: Math.round((d.score / domainTotal) * 100),
  }));

  // --- Work patterns ---
  const patternRanks = rankMap(text, PATTERN_KEYWORDS);
  const work_patterns = patternRanks
    .filter((p) => p.score > 0)
    .slice(0, 8)
    .map((p) => p.name);

  // --- Artifact types ---
  const artifactRanks = rankMap(text, ARTIFACT_KEYWORDS);
  const artifact_types = artifactRanks
    .filter((a) => a.score > 0)
    .slice(0, 5)
    .map((a) => a.name);

  // --- Repeated requests (top conversation titles) ---
  const titleWords = conversations
    .map((c) => (c.title || "").toLowerCase())
    .join(" ");
  const wordCounts: Record<string, number> = {};
  for (const word of titleWords.split(/\s+/)) {
    if (word.length > 4) wordCounts[word] = (wordCounts[word] || 0) + 1;
  }
  const repeated_requests = Object.entries(wordCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([word, count]) => `"${word}" appears in ${count} conversation titles`);

  // --- Skill gaps (domains with lower scores) ---
  const skill_gaps: string[] = [];
  if (domainRanks.find((d) => d.name === "Data & Analysis" && d.score < 10))
    skill_gaps.push("Data analysis and visualization could save time on reporting tasks");
  if (domainRanks.find((d) => d.name === "Software Development" && d.score > 20) &&
      patternRanks.find((p) => p.name === "Code review & debugging" && p.score < 10))
    skill_gaps.push("Systematic debugging methodology could improve your dev workflow");
  if (patternRanks.find((p) => p.name === "Document creation" && p.score > 15))
    skill_gaps.push("Document generation skills could automate repetitive formatting");
  if (patternRanks.find((p) => p.name === "Automation & scripting" && p.score < 5))
    skill_gaps.push("Automation tools could help with repetitive tasks");
  if (topDomains.some((d) => d.name === "Writing & Content"))
    skill_gaps.push("Content strategy skills could help structure your writing workflow");

  // --- Persona summary ---
  const topDomain = primary_domains[0] || "general tasks";
  const topPattern = work_patterns[0] || "various tasks";
  const persona_summary = `Based on ${conversations.length} conversations and ${totalMessages.toLocaleString()} messages, you primarily work in ${topDomain.toLowerCase()} with a focus on ${topPattern.toLowerCase()}. Your conversations show a pattern of ${primary_domains.slice(0, 3).join(", ").toLowerCase()}, suggesting you're a ${conversations.length > 100 ? "power" : "regular"} user who leverages Claude for both creative and analytical work.`;

  return {
    primary_domains,
    work_patterns,
    artifact_types,
    repeated_requests,
    skill_gaps: skill_gaps.slice(0, 5),
    usage_breakdown,
    persona_summary,
  };
}

/* ──────────────────────────────────────────────────────
   Heuristic skill matching
   ────────────────────────────────────────────────────── */

export function matchSkillsHeuristic(
  profile: UserProfile,
  catalog: SkillCatalogEntry[]
): SkillRecommendation[] {
  const userDomains = new Set(profile.primary_domains.map((d) => d.toLowerCase()));
  const userPatterns = new Set(profile.work_patterns.map((p) => p.toLowerCase()));

  const scored = catalog.map((skill) => {
    let score = 0;
    let reasons: string[] = [];

    // Domain overlap
    for (const domain of skill.domains) {
      for (const userDomain of userDomains) {
        if (
          userDomain.includes(domain) ||
          domain.includes(userDomain.split(" ")[0].toLowerCase())
        ) {
          score += 0.3;
          reasons.push(`matches your ${userDomain} work`);
        }
      }
    }

    // Pattern overlap
    for (const pattern of skill.work_patterns) {
      for (const userPattern of userPatterns) {
        if (
          userPattern.toLowerCase().includes(pattern.split("-").join(" ")) ||
          pattern.split("-").join(" ").includes(userPattern.toLowerCase().split(" ")[0])
        ) {
          score += 0.2;
          reasons.push(`aligns with your ${userPattern.toLowerCase()} pattern`);
        }
      }
    }

    // Cap at 0.95 for heuristic (reserve 1.0 for AI)
    score = Math.min(score, 0.95);

    // Deduplicate reasons
    const uniqueReasons = [...new Set(reasons)].slice(0, 2);
    const reasoning =
      uniqueReasons.length > 0
        ? uniqueReasons.join(", and ") + "."
        : `Could complement your work in ${profile.primary_domains[0] || "your primary domain"}.`;

    return {
      skill_id: skill.skill_id,
      relevance_score: Math.round(score * 100) / 100,
      reasoning: reasoning.charAt(0).toUpperCase() + reasoning.slice(1),
    };
  });

  return scored
    .filter((s) => s.relevance_score > 0)
    .sort((a, b) => b.relevance_score - a.relevance_score)
    .slice(0, 8);
}
