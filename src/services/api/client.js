// PATH: src/services/api/client.js

async function parseResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  const rawText = await res.text();
  const text = rawText.trim();

  const isJsonByHeader =
    contentType.includes("application/json") || contentType.includes("+json");
  const looksLikeJson = text.startsWith("{") || text.startsWith("[");
  const isHtml = text.startsWith("<!doctype") || text.startsWith("<html");

  let data;
  if (text && (isJsonByHeader || looksLikeJson)) {
    try {
      data = JSON.parse(text);
    } catch {
      const hint = isHtml
        ? " (received HTML; check API base URL / proxy / MSW)"
        : "";
      throw new Error(`Invalid JSON response from ${res.url}${hint}`);
    }
  }

  if (!res.ok) {
    const message =
      data?.error?.message ||
      data?.message ||
      (isHtml
        ? "Request failed (received HTML; check API base URL / proxy / MSW)"
        : text
          ? text.slice(0, 200)
          : "Request failed");
    throw new Error(message);
  }

  if (data !== undefined) return data;

  const hint = isHtml
    ? " (received HTML; check API base URL / proxy / MSW)"
    : "";
  throw new Error(
    `Expected JSON but received "${contentType || "unknown"}"${hint}`
  );
}

export async function apiGet(url, options = {}) {
  const res = await fetch(url, { method: "GET", ...options });
  return parseResponse(res);
}

export async function apiPost(url, body, options = {}) {
  const res = await fetch(url, {
    method: "POST",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: JSON.stringify(body ?? {}),
  });
  return parseResponse(res);
}

export async function apiPut(url, body, options = {}) {
  const res = await fetch(url, {
    method: "PUT",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: JSON.stringify(body ?? {}),
  });
  return parseResponse(res);
}

export async function apiDelete(url, options = {}) {
  const res = await fetch(url, { method: "DELETE", ...options });
  return parseResponse(res);
}