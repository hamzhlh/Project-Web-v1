export function isTokenExpired(token) {
  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload));
    const now = Date.now() / 1000;
    return decoded.exp < now;
  } catch {
    return true; // kalau gagal decode → anggap expired
  }
}