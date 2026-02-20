// Raw Claude export format
export interface ClaudeMessage {
  uuid: string;
  text: string;
  sender: "human" | "assistant";
  created_at: string;
  content?: unknown[];
  attachments?: unknown[];
  files?: unknown[];
}

export interface ClaudeConversation {
  uuid: string;
  name?: string;
  created_at: string;
  updated_at: string;
  account?: { uuid: string };
  chat_messages?: ClaudeMessage[];
}

// Internal parsed format
export interface ParsedMessage {
  sender: string;
  text: string;
  created_at: string;
}

export interface ParsedConversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  messages: ParsedMessage[];
}

// AI-generated profile
export interface UsageBreakdown {
  category: string;
  percentage: number;
}

export interface UserProfile {
  primary_domains: string[];
  work_patterns: string[];
  artifact_types: string[];
  repeated_requests: string[];
  skill_gaps: string[];
  usage_breakdown: UsageBreakdown[];
  persona_summary: string;
}

// Skills catalog
export interface SkillCatalogEntry {
  skill_id: string;
  name: string;
  source: "anthropic" | "community" | "skillsmp" | "skillhub";
  domains: string[];
  work_patterns: string[];
  description: string;
  url?: string;
}

// App view state
export type AppView = "landing" | "results" | "commons" | "style-guide";

// AI-generated recommendation
export interface SkillRecommendation {
  skill_id: string;
  relevance_score: number;
  reasoning: string;
}

export interface EnrichedRecommendation extends SkillRecommendation {
  skill?: SkillCatalogEntry;
}

// Date range from conversations
export interface DateRange {
  earliest: string;
  latest: string;
  years: number;
}

// Combined analysis results
export interface AnalysisResults {
  userProfile: UserProfile;
  recommendations: EnrichedRecommendation[];
  dateRange: DateRange;
  totalConversations: number;
  totalMessages: number;
}

// Log entry for terminal
export interface LogEntry {
  time: string;
  msg: string;
}
