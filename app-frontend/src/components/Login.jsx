import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/api";
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await login(username, password);
    if (res.ok && res.data.message === "Login berhasil!") {
      localStorage.setItem("isAuth", "true");
      navigate("/dashboard");
    } else {
      setError(res.data.message || "Username atau password salah");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img
          src="/images/vr-tech.png"
          alt="Tech"
          className="login-image"
        />
      </div>

      <div className="login-right">
        <div className="login-box">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="login-logo"
          />
          <h2 className="login-title">Science of Technology</h2>

          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
            />

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="login-button">
              Log In
            </button>
          </form>

          <p className="login-register">
            <a href="/register">Register now!</a>
          </p>

          <div className="login-back">
            <a href="/">
              <span>←</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
