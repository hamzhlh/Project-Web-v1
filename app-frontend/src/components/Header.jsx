import React from "react";
import { API_URL } from "../api/authApi";
import { FaBars } from "react-icons/fa";
import "./Dashboard.css";

const Header = ({ setIsSidebarOpen }) => {
  let user;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }
  user ||= {
    name: "Hamzah",
    email: "hamzah@example.com",
    profile: "/default-avatar.png",
  };


  const defaultAvatar = "https://i.pravatar.cc/150?img=12"; // bisa diganti default kamu
  const profileImage =
  user.profile && user.profile.startsWith("http")
    ? user.profile
    : user.profile
    ? `${API_URL}${user.profile}`
    : defaultAvatar;


  return (
    <header className="header">
      <div className="header-left">
        <FaBars
          className="header-menu"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
        />
        <h1 className="header-title">Science of Technology</h1>
      </div>

      <div className="header-right">
        <div className="user-info">
          <span className="user-name">Hi, {user.name}</span>
        </div>

        <div className="profile-pic">
          <img
            src={profileImage}
            alt="User Avatar"
            onError={(e) => (e.target.src = defaultAvatar)}
          />
        </div>

        {/* 🔽 Dropdown muncul ketika hover di header-right */}
        <div className="profile-dropdown">
          <p className="profile-name">{user.name}</p>
          <p className="profile-email">{user.email}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
