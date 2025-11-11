import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import config from '../config';
const logoIcon = process.env.PUBLIC_URL + '/logo2.png';

const Sidebar = () => {
  const [arrowSelected, setArrowSelected] = useState(false);
  const navigate = useNavigate();

  const handleArrowClick = () => {
    setArrowSelected(true);
    navigate(-1);
  };

  const handleNavClick = () => setArrowSelected(false);

  return (
    <aside className={`sidebar ${arrowSelected ? 'arrow-selected' : ''}`}>
  <div className="sidebar-top-icons">
    <div
      className={`sidebar-icon top-icon ${arrowSelected ? 'selected' : ''}`}
      onClick={handleArrowClick}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 12H20M4 12L12 4M4 12L12 20"
          stroke="#9FA6B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>

    <ul>
      {/* Ostale stavke */}
      <li>
        <NavLink to="/" end className={({ isActive }) => `sidebar-icon home-icon ${isActive ? 'active' : ''}`} onClick={handleNavClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="#9FA6B2" />
          </svg>
        </NavLink>
      </li>

      {/* Ostale stavke... */}
    </ul>
  </div>

  {/* Donji deo menija - PROFIL & IZLOGUJ SE */}
  <div className="sidebar-bottom-icons">
    <ul>
      {/* PROFILE */}
      <li>
        <NavLink to="/profile" className={({ isActive }) => `sidebar-icon ${isActive ? 'active' : ''}`} onClick={handleNavClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#9FA6B2"/>
          </svg>
        </NavLink>
      </li>

      {/* LOGOUT */}
      <li>
        <NavLink to="/logout" end className={({ isActive }) => `sidebar-icon bottom-icon ${isActive ? 'active' : ''}`} onClick={handleNavClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="#9FA6B2"/>
          </svg>
        </NavLink>
      </li>
    </ul>
  </div>
</aside>
  );
  
};

export default Sidebar;
