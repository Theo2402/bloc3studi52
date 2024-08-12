import React from 'react';
import '../css/HomePageFooter.css';
import gameIcon from '../images/game.png';

const Footer = () => {
  return (
    <div className="footer">
      <div className="left-text">Jeux Olympiques de Paris</div>
      <div className="icon-container">
        <img src= {gameIcon} alt="Icon" className="icon" style={{ width: '40px', height: '40px' }} />
      </div>
      <div className="right-text">24 juillet - 8 septembre</div>
    </div>
  );
};

export default Footer;