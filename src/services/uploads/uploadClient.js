// PATH: src/services/uploads/uploadClient.js

// Usage:
// const { url } = await uploadFile(file)
// const { urls } = await uploadFiles([file1, file2])

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

// You can change this endpoint later to match backend
const UPLOAD_ENDPOINT = `${API_BASE_URL}/api/uploads`;

/**
 * Create a safe preview URL for UI (works without backend).
 * Remember: you should revokeObjectURL when you no longer need it in UI.
 */
function makeLocalUrl(file) {
  try {
    return URL.createObjectURL(file);
  } catch {
    return "";
  }
}

async function parseJson(res) {
  const text = (await res.text().catch(() => "")).trim();
  const contentType = res.headers.get("content-type") || "";

  const isJson =
    contentType.includes("application/json") ||
    contentType.includes("+json") ||
    text.startsWith("{") ||
    text.startsWith("[");

  let data;
  if (text && isJson) {
    try {
      data = JSON.parse(text);
    } catch {
      // ignore
    }
  }

  if (!res.ok) {
    const msg = data?.message || data?.error?.message || text || "Upload failed";
    throw new Error(msg);
  }

  return data || {};
}

/**
 * Upload a single file.
 * - If backend exists: POST FormData -> expects { url } or { item: { url } }
 * - If backend not ready: returns local object URL (mock)
 */
export async function uploadFile(file, { useMock = true } = {}) {
  if (!(file instanceof File)) throw new Error("uploadFile: file is required");

  // ✅ Mock mode (no backend required)
  if (useMock) {
    return { url: makeLocalUrl(file), name: file.name, size: file.size, type: file.type };
  }

  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch(UPLOAD_ENDPOINT, {
    method: "POST",
    body: fd,
  });

  const data = await parseJson(res);
  const url = data?.url || data?.item?.url || data?.data?.url || "";

  if (!url) throw new Error("Upload succeeded but no URL returned from server");
  return { url };
}

/**
 * Upload multiple files.
 */
export async function uploadFiles(files = [], { useMock = true } = {}) {
  if (!Array.isArray(files)) throw new Error("uploadFiles: files must be an array");

  // ✅ Mock mode (no backend required)
  if (useMock) {
    return {
      urls: files
        .filter((f) => f instanceof File)
        .map((f) => makeLocalUrl(f)),
    };
  }

  const fd = new FormData();
  files.forEach((f) => {
    if (f instanceof File) fd.append("files", f);
  });

  const res = await fetch(`${UPLOAD_ENDPOINT}/batch`, {
    method: "POST",
    body: fd,
  });

  const data = await parseJson(res);
  const urls = data?.urls || data?.items?.map((x) => x?.url).filter(Boolean) || [];

  return { urls };
}

/**
 * Utility to revoke preview URLs when no longer needed.
 */
export function revokeLocalUrl(url) {
  if (!url) return;
  try {
    URL.revokeObjectURL(url);
  } catch {
    // ignore
  }
}
