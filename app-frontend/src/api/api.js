const API_URL = "https://api.hamzah-dev.sbs/api";
// const API_URL = "https://agile-tranquility-production.up.railway.app/api";


// 🧩 LOGIN — sekarang cookie akan otomatis disimpan oleh browser
export async function login(username, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // ⬅️ penting untuk kirim & terima cookie refreshToken
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (res.ok && data?.user) {
    // Simpan user + accessToken di localStorage
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("accessToken", data.accessToken);
  }

  return { ok: res.ok, data };
}

// 🧩 REGISTER
export async function register(username, email, password) {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.text();
    return { ok: res.ok, data };
  } catch (err) {
    console.error(err);
    return { ok: false, data: "Error" };
  }
}

// 🧩 REFRESH TOKEN — untuk perbarui access token ketika expired
export async function refreshAccessToken() {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include", // ⬅️ kirim cookie refreshToken
  });

  if (res.ok) {
    const data = await res.json();
    localStorage.setItem("accessToken", data.accessToken);
    return data.accessToken;
  } else {
    logout();
    return null;
  }
}

// 🧩 LOGOUT — hapus data lokal & panggil endpoint logout backend
export async function logout() {
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include", // kirim cookie biar server hapus refreshToken
  });

  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
}
