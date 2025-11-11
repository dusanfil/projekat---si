import React from 'react';
import { Link } from 'react-router-dom';
import { FaList, FaPlus, FaUser, FaSignOutAlt } from 'react-icons/fa';

function Sidebar() {
  return (
    <div style={{ width: '220px', backgroundColor: '#0d0b1f', minHeight: '100vh', color: 'white' }}>
      <div className="p-3 fw-bold">Organizator događaja</div>

      <nav className="nav flex-column">
        <Link to="/events" className="nav-link text-white ps-4">
          <FaList className="me-2" /> Svi događaji
        </Link>
        <Link to="/create" className="nav-link text-white ps-4">
          <FaPlus className="me-2" /> Napravi novi
        </Link>
        <Link to="/profile" className="nav-link text-white ps-4 mt-4">
          <FaUser className="me-2" /> Moj profil
        </Link>
        <Link to="/" className="nav-link text-white ps-4 mt-1">
          <FaSignOutAlt className="me-2" /> Izloguj se
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;
