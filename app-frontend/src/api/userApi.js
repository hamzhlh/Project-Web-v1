// src/api/userApi.js
import { API_URL } from "./authApi";

export async function updateUser(token, userData) {
  try {
    // Hapus field sensitif (password)
    const { password, ...safeUserData } = userData;

    // Deteksi otomatis apakah userData itu FormData atau JSON
    const isFormData = userData instanceof FormData;

    const res = await fetch(`${API_URL}/api/users/update`, {
      method: "PUT",
      headers: isFormData
        ? { Authorization: `Bearer ${token}` } // ⚠️ jangan set Content-Type manual
        : {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
      body: isFormData ? userData : JSON.stringify(safeUserData),
    });

    // Kadang backend balikin plain text, jadi cek dulu tipe responsenya
    const contentType = res.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      data = { message: text };
    }

    console.log("response data:", data);

    // Simpan user terbaru ke localStorage kalau update berhasil
    if (res.ok) {
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      return { ok: true, data };
    } else {
      return { ok: false, data };
    }
  } catch (err) {
    console.error("Error update user:", err);
    return { ok: false, data: err.message };
  }
}

export async function getUserProfile() {
  const token = localStorage.getItem("accessToken");

  try {
    const res = await fetch(`${API_URL}/api/users/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Gagal mengambil data profil");

    const data = await res.json();
    return { ok: true, data };
  } catch (err) {
    console.error(err);
    return { ok: false, data: err.message };
  }
}
