import React, { useState } from "react";
import "./Dashboard.css";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="dashboard-container">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className={`main-content ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <Header setIsSidebarOpen={setIsSidebarOpen} />
        <div className="dashboard-body">
          <h1>Welcome to Dashboard</h1>
          <p>Here is your main content area 🚀</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
