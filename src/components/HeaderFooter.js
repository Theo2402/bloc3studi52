import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/MainPage.css';
import '../css/HeaderFooter.css';
import olympicRings from '../images/game1.png';
import userIcon from '../icons/user.png';
import cartIcon from '../icons/shopping-cart.png';
import gameIcon from '../images/game.png';
import ticketIcon from '../icons/ticket.png'; 

const HeaderBase = ({ totalQuantity, currentPage }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  console.log(`HeaderBase totalQuantity: ${totalQuantity}, currentPage: ${currentPage}`); // Detailed debugging
  return (
    <div className="header-container">
      <div className="logo-container">
        <Link to="/">
          <img src={olympicRings} alt="Logo" className="logo" />
        </Link>
      </div>
      <div className="navigation-container">
        <nav>
          <ul>
            <li className={currentPage === 'offre' ? 'active' : ''}>
              <Link to="/offre">
                <img src={ticketIcon} alt="Ticket" className="iconNav" />
                Offres
              </Link>
            </li>
            <li className={currentPage === 'profile' ? 'active' : ''}>
              <Link to="/profile">
                <img src={userIcon} alt="User" className="iconNav" />
                Mon Compte
              </Link>
            </li>
            <li className={currentPage === 'cart' ? 'active' : ''}>
              <Link to="/cart">
                <img src={cartIcon} alt="Cart" className="iconNav" />
                Panier
                {totalQuantity > 0 && (
                  <div className="cart-badge">{totalQuantity}</div>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="hamburger" onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className={`hamburger-menu ${menuOpen ? 'show' : ''}`}>
        <ul>
          <li className={currentPage === 'offre' ? 'active' : ''}>
            <Link to="/offre" onClick={toggleMenu}>
              <img src={ticketIcon} alt="Ticket" className="iconNav" />
              Offres
            </Link>
          </li>
          <li className={currentPage === 'profile' ? 'active' : ''}>
            <Link to="/profile" onClick={toggleMenu}>
              <img src={userIcon} alt="User" className="iconNav" />
              Mon Compte
            </Link>
          </li>
          <li className={currentPage === 'cart' ? 'active' : ''}>
            <Link to="/cart" onClick={toggleMenu}>
              <img src={cartIcon} alt="Cart" className="iconNav" />
              Panier
              {totalQuantity > 0 && (
                <div className="cart-badge">{totalQuantity}</div>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

// Footer
const FooterBase = () => {
  return (
    <div className="footer">
      <div className="left-text">© 2024. All rights reserved.</div>
      <div className="icon-container">
        <img src={gameIcon} alt="Icon" className="icon" />
      </div>
      <div className="right-text">24 juillet - 4 aout</div>
    </div>
  );
};

export { HeaderBase, FooterBase };
