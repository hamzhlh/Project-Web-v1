import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/authApi";
import "./Register.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Password tidak sama!");
      return;
    }

    const res = await register(username, name, email, password);
    if (res.ok) {
      alert("Registrasi berhasil!");
      navigate("/login");
    } else {
      setError("Gagal registrasi");
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <div className="register-box">
          <img src="/images/logo.png" alt="Logo" className="register-logo" />
          <h2 className="register-title">Science of Technology</h2>

          <form onSubmit={handleSubmit} className="register-form">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="register-input"
              required
            />
            <div className="register-row">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="register-input"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="register-input"
                required
              />
            </div>

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="register-input"
              required
            />
            <input
              type="password"
              placeholder="Retype Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="register-input"
              required
            />

            {error && <p className="register-error">{error}</p>}

            <button type="submit" className="register-button">
              Sign Up
            </button>
          </form>

          <div className="register-back">
            <a href="/login">←</a>
          </div>
        </div>
      </div>

      <div className="register-right">
        <img src="/images/vr-tech.png" alt="Tech" className="register-image" />
      </div>
    </div>
  );
}
