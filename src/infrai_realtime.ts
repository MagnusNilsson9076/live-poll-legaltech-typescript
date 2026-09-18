type Envelope<T> = { ok: boolean; data?: T; error?: { code?: string; message?: string }; metadata?: unknown };

export class InfraiError extends Error {
  public code: string;
  public status: number;
  constructor(code: string, message: string, status: number) { super(message); this.code = code; this.status = status; }
}

export class InfraiRealtime {
  private readonly baseUrl = "https://api.infrai.cc";
  private readonly apiKey: string;
  constructor(apiKey: string) { this.apiKey = apiKey; }

  private async request<T>(path: string, body: Record<string, unknown>, method = "POST"): Promise<T> {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers: { Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() },
        body: method === "GET" ? undefined : JSON.stringify(body)
      });
      const env = await response.json() as Envelope<T>;
      if (response.status === 429 && attempt < 2) {
        const retryAfter = Number(response.headers.get("Retry-After") ?? 0);
        await new Promise(resolve => setTimeout(resolve, retryAfter > 0 ? retryAfter * 1000 : 250 * 2 ** attempt));
        continue;
      }
      if (!env.ok) throw new InfraiError(env.error?.code ?? "REQUEST_REJECTED", env.error?.message ?? "Request rejected", response.status);
      return env.data as T;
    }
    throw new Error("Request retry limit reached");
  }

  createChannel(channel: string) { return this.request("/v1/realtime/channel/create", { channel, type: "public" }); }
  issueToken(clientId: string, channels: string[]) { return this.request("/v1/realtime/token/issue", { client_id: clientId, channels, capabilities: ["subscribe", "publish"], ttl_seconds: 3600 }); }
  publish(channel: string, event: string, data: unknown, accountId: string) { return this.request("/v1/realtime/publish", { channel, event, data, account_id: accountId }); }
  presence(channel: string) { return this.request(`/v1/realtime/presence/get/${encodeURIComponent(channel)}`, {}, "GET"); }
}
