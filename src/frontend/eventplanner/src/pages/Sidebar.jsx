import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MdListAlt, MdOutlineAddBox } from 'react-icons/md';
import { FaUser } from 'react-icons/fa';
import { CiLogout } from 'react-icons/ci';
import { FaRegCalendarAlt } from 'react-icons/fa';
import './Sidebar.css';
import config from '../config';
const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/events", label: "Lista događaja", icon: <MdListAlt /> },
    { path: "/create", label: "Napravi događaj", icon: <MdOutlineAddBox /> },
    { path: "/calendar", label: "Kalendar događaja", icon: <FaRegCalendarAlt /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <div className="menu-items">
          {menuItems.map((item) => (
            <div
              key={item.path}
              className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="bottom-items">
          <div
            className={`menu-item profile-item ${location.pathname === "/profile" ? "active" : ""}`}
            onClick={() => navigate("/profile")}
          >
            <span className="icon"><FaUser /></span>
            <span className="label">Moj profil</span>
          </div>
          <div className="menu-item logout-item" onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}>
            <span className="icon"><CiLogout /></span>
            <span className="label">Odjavi se</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;