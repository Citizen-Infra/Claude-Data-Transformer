export interface NetworkRequest {
  id: string;
  label: string;
  method: string;
  url: string;
  bodyBytes: number;
  status: number | null;
  durationMs: number | null;
  error: string | null;
  startedAt: number;
}

/* ── Module-level state ── */
let requests: NetworkRequest[] = [];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((fn) => fn());
}

/* ── Write API (called from anthropicApi.ts) ── */

export function recordStart(
  url: string,
  method: string,
  label: string,
  bodyBytes: number
): string {
  const id = `req-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  requests = [
    ...requests,
    { id, label, method, url, bodyBytes, status: null, durationMs: null, error: null, startedAt: Date.now() },
  ];
  emit();
  return id;
}

export function recordEnd(id: string, status: number, durationMs: number) {
  requests = requests.map((r) =>
    r.id === id ? { ...r, status, durationMs } : r
  );
  emit();
}

export function recordError(id: string, err: unknown) {
  requests = requests.map((r) =>
    r.id === id
      ? { ...r, error: err instanceof Error ? err.message : "Unknown error", durationMs: Date.now() - r.startedAt }
      : r
  );
  emit();
}

/* ── Read API (consumed by React via useSyncExternalStore) ── */

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function getSnapshot(): NetworkRequest[] {
  return requests;
}
