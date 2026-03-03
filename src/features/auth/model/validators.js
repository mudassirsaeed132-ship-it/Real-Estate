export function required(v, label = "This field") {
  if (!String(v || "").trim()) return `${label} is required.`;
  return null;
}

export function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
}

export function validatePassword(pw) {
  const v = String(pw || "");
  if (v.length < 8) return "Password must be at least 8 characters.";
  return null;
}