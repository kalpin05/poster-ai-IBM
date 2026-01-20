// frontend/src/services/api.js
export async function api(path, opts = {}) {
  const base =
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_BASE ||
    "http://localhost:5000";
  const url = `${base}${path}`;
  const token = localStorage.getItem("token");
  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
  const options = {
    headers: { ...defaultHeaders, ...(opts.headers || {}) },
    method: opts.method || "GET",
    body: opts.body || undefined
  };

  const resp = await fetch(url, options);
  const text = await resp.text();
  try {
    const json = JSON.parse(text);
    if (!resp.ok) throw json;
    return json;
  } catch {
    // If response is not JSON, throw the raw text for debugging
    if (!resp.ok) {
      throw { status: resp.status, body: text };
    }
    // If it was JSON parse error but status ok, return text
    return text;
  }
}