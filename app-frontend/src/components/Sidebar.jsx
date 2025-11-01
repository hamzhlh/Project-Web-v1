import React, { useEffect, useRef } from "react";
import { FaHome, FaUser, FaCog, FaSignOutAlt, FaBars } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import "./Dashboard.css";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef(null); // ⬅️ ini penting

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

  // 🔹 Detect klik di luar sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      // jika sidebar terbuka & klik di luar area sidebar → tutup
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setIsOpen]);

  return (
    <div ref={sidebarRef} className={`sidebar ${isOpen ? "open" : "closed"}`}>
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
