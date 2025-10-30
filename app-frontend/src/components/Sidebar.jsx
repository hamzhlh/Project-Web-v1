import React from "react";
import { FaHome, FaUser, FaCog, FaSignOutAlt, FaBars } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import "./Dashboard.css";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("isAuth");
    navigate("/login");
  };

  const menuItems = [
    { name: "Home", icon: <FaHome />, path: "/dashboard" },
    { name: "Profile", icon: <FaUser />, path: "/profile" },
    { name: "Settings", icon: <FaCog />, path: "/settings" },
  ];

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <FaBars className="menu-toggle" onClick={() => setIsOpen(!isOpen)} />
        {isOpen && <h2 className="sidebar-title">MyApp</h2>}
      </div>

      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={`menu-item ${
              location.pathname === item.path ? "active" : ""
            }`}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            {isOpen && <span>{item.name}</span>}
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        <div className="sidebar-logout" onClick={logout}>
          <FaSignOutAlt />
          {isOpen && <span>Logout</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
