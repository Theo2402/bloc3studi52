import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../css/AdminHeader.css';

const Header = ({ setPage }) => {
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="admin-header">
      <div className="header-content">
        <div className="logo">
          <img src="path_to_logo.png" alt="App Logo" />
          <h1>Admin Dashboard</h1>
        </div>
        <div className={`navigation ${isMenuOpen ? 'open' : ''}`}>
          <span onClick={() => { setPage('admin'); setIsMenuOpen(false); }}>Admin</span>
          <span onClick={() => { setPage('users'); setIsMenuOpen(false); }}>Utilisateurs</span>
          <span onClick={() => { setPage('offers'); setIsMenuOpen(false); }}>Offre</span>
        </div>
        <div className="profile">
          <button className="logout-button" onClick={logout}>Logout</button>
        </div>
        <div className="burger-menu" onClick={toggleMenu}>
          <div className="burger-bar"></div>
          <div className="burger-bar"></div>
          <div className="burger-bar"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;





