import React from "react";
import { FaBars } from "react-icons/fa";
import "./Dashboard.css";

const Header = ({ setIsSidebarOpen }) => {
  const user = JSON.parse(localStorage.getItem("user")) || {
    username: "Hamzah",
    email: "hamzah@example.com",
    profile: "https://i.pravatar.cc/150?img=12",
  };

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
          <span className="user-name">Hi, {user.username}</span>
        </div>

        <div className="profile-pic">
          <img src={user.profile} alt="User Avatar" />
        </div>

        {/* 🔽 Dropdown muncul ketika hover di header-right */}
        <div className="profile-dropdown">
          <p className="profile-name">{user.username}</p>
          <p className="profile-email">{user.email}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
