import type { ClaudeConversation } from "./types";

/**
 * Generates a Claude-format JSON blob from conversations
 * and triggers a browser download.
 */
export function downloadPersonaExport(
  conversations: ClaudeConversation[],
  filename: string
): void {
  const json = JSON.stringify(conversations, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();

  // Cleanup
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}
