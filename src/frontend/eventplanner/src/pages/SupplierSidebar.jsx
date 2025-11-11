import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MdInventory, MdOutlineAddBox } from 'react-icons/md';
import { FaUser } from 'react-icons/fa';
import { CiLogout } from 'react-icons/ci';

const SupplierSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("supplierToken");
    navigate("/login");
  };

  const menuItems = [
    { path: "/dobavljac/dashboard", label: "Moji resursi", icon: <MdInventory /> },
    { path: "/dobavljac/dodaj-resurs", label: "Dodaj resurs", icon: <MdOutlineAddBox /> },
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
            className={`menu-item profile-item ${location.pathname === "/dobavljac/profil" ? "active" : ""}`}
            onClick={() => navigate("/dobavljac/profil")}
          >
            <span className="icon"><FaUser /></span>
            <span className="label">Profil</span>
          </div>
          <div className="menu-item logout-item" onClick={handleLogout}>
            <span className="icon"><CiLogout /></span>
            <span className="label">Odjavi se</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SupplierSidebar;
