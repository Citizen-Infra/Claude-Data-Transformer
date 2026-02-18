import type { ClaudeConversation, ParsedConversation, DateRange } from "./types";

export function parseClaudeExport(jsonData: ClaudeConversation | ClaudeConversation[]): ParsedConversation[] {
  const conversations = Array.isArray(jsonData) ? jsonData : [jsonData];
  return conversations.map((conv) => ({
    id: conv.uuid,
    title: conv.name || "Untitled",
    created_at: conv.created_at,
    updated_at: conv.updated_at,
    message_count: conv.chat_messages?.length || 0,
    messages: (conv.chat_messages || []).map((msg) => ({
      sender: msg.sender,
      text: msg.text || "",
      created_at: msg.created_at,
    })),
  }));
}

export function getDateRange(conversations: ParsedConversation[]): DateRange {
  const dates = conversations
    .map((c) => c.created_at)
    .filter(Boolean)
    .map((d) => new Date(d));

  if (!dates.length) {
    return { earliest: "Unknown", latest: "Unknown", years: 0 };
  }

  const earliest = new Date(Math.min(...dates.map((d) => d.getTime())));
  const latest = new Date(Math.max(...dates.map((d) => d.getTime())));
  const years = Math.max(
    1,
    Math.round(((latest.getTime() - earliest.getTime()) / (365.25 * 24 * 60 * 60 * 1000)) * 10) / 10
  );
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", year: "numeric" });

  return { earliest: fmt(earliest), latest: fmt(latest), years };
}
