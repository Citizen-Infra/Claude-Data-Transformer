import { recordStart, recordEnd, recordError } from "./networkLog";

const API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-haiku-4-5-20251001";
const API_VERSION = "2023-06-01";

interface ApiResponse {
  content: Array<{ type: string; text?: string }>;
}

/* ── Tracked fetch wrapper ── */

async function trackedFetch(
  url: string,
  init: RequestInit,
  label: string
): Promise<Response> {
  const bodyBytes = init.body
    ? new TextEncoder().encode(init.body as string).length
    : 0;
  const id = recordStart(url, init.method ?? "POST", label, bodyBytes);
  const startTime = performance.now();
  try {
    const res = await fetch(url, init);
    recordEnd(id, res.status, performance.now() - startTime);
    return res;
  } catch (err) {
    recordError(id, err);
    throw err;
  }
}

/* ── API helpers ── */

async function callAnthropic(
  apiKey: string,
  prompt: string,
  label: string,
  maxTokens: number = 2000
): Promise<string> {
  const res = await trackedFetch(
    API_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": API_VERSION,
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: maxTokens,
        messages: [{ role: "user", content: prompt }],
      }),
    },
    label
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || `API error (${res.status})`);
  }

  const data: ApiResponse = await res.json();
  return data.content
    .map((b) => (b.type === "text" ? b.text : ""))
    .join("");
}

function parseJsonResponse<T>(text: string): T {
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

export async function testApiKey(apiKey: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await trackedFetch(
      API_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": API_VERSION,
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 10,
          messages: [{ role: "user", content: "Say ok" }],
        }),
      },
      "Test API Key"
    );

    if (res.ok) {
      return { success: true };
    }

    const data = await res.json();
    return { success: false, error: data.error?.message || "Invalid key" };
  } catch {
    return { success: false, error: "Network error — check your connection" };
  }
}

export async function buildUserProfile<T>(apiKey: string, prompt: string): Promise<T> {
  const text = await callAnthropic(apiKey, prompt, "Build Profile");
  return parseJsonResponse<T>(text);
}

export async function matchSkills<T>(apiKey: string, prompt: string): Promise<T> {
  const text = await callAnthropic(apiKey, prompt, "Match Skills");
  return parseJsonResponse<T>(text);
}
