// const API_URL = "http://localhost:8080/api";
const API_URL = "https://agile-tranquility-production.up.railway.app/api";


export async function login(username, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (res.ok && data?.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }
  return { ok: res.ok, data: data };
}

export async function register(username, email, password) {
  try {
    const res = await fetch("http://localhost:8080/api/auth/register", {
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

