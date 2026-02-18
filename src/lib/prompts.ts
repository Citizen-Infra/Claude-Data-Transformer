import type { ParsedConversation, UserProfile, SkillCatalogEntry } from "./types";

export function buildAnalysisPrompt(conversations: ParsedConversation[]): string {
  const sample = conversations.slice(0, 40);
  const summaries = sample.map((c) => {
    const preview = c.messages
      .slice(0, 4)
      .map((m) => `${m.sender}: ${m.text?.substring(0, 200)}`)
      .join("\n");
    return `### "${c.title}" (${c.message_count} msgs, ${c.created_at?.split("T")[0] || "?"})\n${preview}`;
  });

  return `You are analyzing a user's Claude conversation history to understand how they use AI and recommend Skills they should install.

Here are summaries of ${sample.length} of their ${conversations.length} total conversations:

${summaries.join("\n\n---\n\n")}

Produce a JSON object (no markdown fencing, no other text) with this structure:
{
  "primary_domains": ["3-6 main domains/topics"],
  "work_patterns": ["4-8 recurring types of work"],
  "artifact_types": ["file/output types they request"],
  "repeated_requests": ["3-5 things they ask for repeatedly"],
  "skill_gaps": ["3-5 areas where a skill could save them time"],
  "usage_breakdown": [{"category": "name", "percentage": number}],
  "persona_summary": "2-3 sentence description of this user's relationship with Claude"
}`;
}

export function buildMatchingPrompt(
  userProfile: UserProfile,
  skills: SkillCatalogEntry[]
): string {
  return `Match this Claude user's profile against available Skills. Rank the top 8 most relevant.

USER PROFILE:
${JSON.stringify(userProfile, null, 2)}

AVAILABLE SKILLS:
${JSON.stringify(
  skills.map((s) => ({
    id: s.skill_id,
    name: s.name,
    source: s.source,
    domains: s.domains,
    work_patterns: s.work_patterns,
    description: s.description,
  })),
  null,
  2
)}

Respond ONLY with a JSON array (no markdown fencing):
[{"skill_id": "id", "relevance_score": 0.0-1.0, "reasoning": "1-2 sentences why this fits"}]
Order by relevance_score descending.`;
}
