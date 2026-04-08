const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!BASE) throw new Error("NEXT_PUBLIC_API_BASE_URL missing");

export function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("accessToken") || "";
}

type ApiErrorPayload = { message?: string; success?: boolean; errors?: any };

type ApiOptions = Omit<RequestInit, "body" | "headers"> & {
  body?: any; 
  headers?: Record<string, string>; 
};


async function throwNiceError(res: Response) {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const j = (await res.json().catch(() => null)) as ApiErrorPayload | null;
    throw new Error(j?.message || `Request failed: ${res.status}`);
  }
  const text = await res.text().catch(() => "");
  throw new Error(text || `Request failed: ${res.status}`);
}

async function readJsonSafe<T>(res: Response): Promise<T> {
  if (res.status === 204) return (null as unknown) as T;

  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    const text = await res.text().catch(() => "");
    return ((text ? text : null) as unknown) as T;
  }
  return (await res.json()) as T;
}

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const token = getToken();

  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  // only set JSON header for non-FormData
  if (!isFormData) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  // auto stringify object body
  let body: BodyInit | undefined = undefined;
  if (options.body !== undefined && options.body !== null) {
    if (isFormData) body = options.body as FormData;
    else if (typeof options.body === "string") body = options.body;
    else body = JSON.stringify(options.body);
  }

  const res = await fetch(`${BASE}${path}`, {
    method: options.method || "GET",
    headers,
    body,
    cache: "no-store",
    credentials: options.credentials,
    signal: options.signal,
    mode: options.mode,
    redirect: options.redirect,
    referrerPolicy: options.referrerPolicy,
    integrity: options.integrity,
    keepalive: options.keepalive,
  });

  if (!res.ok) await throwNiceError(res);
  return readJsonSafe<T>(res);
}

// aliases
export const apiJson = api;

export async function apiForm<T>(path: string, formData: FormData, method: "POST" | "PATCH" | "PUT") {
  return api<T>(path, { method, body: formData });
}

export async function apiDelete<T>(path: string, options: ApiOptions = {}) {
  return api<T>(path, { ...options, method: "DELETE" });
}

export function qs(params: Record<string, any>) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    sp.set(k, String(v));
  });
  const q = sp.toString();
  return q ? `?${q}` : "";
}
