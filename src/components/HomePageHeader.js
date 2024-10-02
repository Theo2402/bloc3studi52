import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Header.css'; 

import olympicRings from '../images/game1.png';
import downArrowIcon from '../icons/down-chevron.png';
import upArrowIcon from '../icons/up_arrow.png';
import ticketIcon from '../icons/ticket.png';
import userIcon from '../icons/user.png';
import cartIcon from '../icons/shopping-cart.png';
import pauseIcon from '../icons/pause.png';
import playIcon from '../icons/play.png';

import background from '../images/background.avif';
import escrime from '../images/escrime.jpg';
import natation from '../images/natation.avif';
import voile from '../images/voile.jpg';
import tennis from '../images/tennis.avif';

const getTotalQuantity = () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  return cart.reduce((acc, item) => acc + item.quantity, 0);
};

const Header = () => {
  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);
  const [arrowIcon, setArrowIcon] = useState(downArrowIcon);
  const descriptionRef = useRef(null);
  const contentRef = useRef(null);
  const [totalQuantity] = useState(getTotalQuantity());

  const [countdown, setCountdown] = useState('');
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const backgroundImages = [background, escrime, natation, voile, tennis]; 

  useEffect(() => {
    let intervalId;
    if (isPlaying) {
      intervalId = setInterval(() => {
        setCurrentBackgroundIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
      }, 6000); // Changer images toutes les 6 secondes
    }
    return () => clearInterval(intervalId);
  }, [isPlaying, backgroundImages.length]);

  useEffect(() => {
    const targetDate = new Date('2024-09-08T00:00:00');

    let intervalId; 

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        setCountdown('00j 00h 00m 00s');
        clearInterval(intervalId); 
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      const formattedDays = String(days).padStart(2, '0');
      const formattedHours = String(hours).padStart(2, '0');
      const formattedMinutes = String(minutes).padStart(2, '0');
      const formattedSeconds = String(seconds).padStart(2, '0');

      const countdownString = `${formattedDays}j ${formattedHours}h ${formattedMinutes}m ${formattedSeconds}s`;
      setCountdown(countdownString);
    };

  
    updateCountdown();

    intervalId = setInterval(updateCountdown, 1000); 

    return () => clearInterval(intervalId);
  }, []);

  const toggleDescription = () => {
    setDescriptionExpanded(!isDescriptionExpanded);
    setArrowIcon(isDescriptionExpanded ? downArrowIcon : upArrowIcon);

    const descriptionElement = descriptionRef.current;
    const contentElement = contentRef.current;

    if (descriptionElement) {
      if (isDescriptionExpanded) {
        descriptionElement.style.maxHeight = '60px';
        contentElement.classList.add('collapsed');
      } else {
        descriptionElement.style.maxHeight = `${descriptionElement.scrollHeight}px`;
        contentElement.classList.remove('collapsed');
      }
    }

    const handleTransitionEnd = () => {
      const descriptionHeight = descriptionElement.scrollHeight;
      const newTop = isDescriptionExpanded ? 20 : descriptionHeight + 20;
      setNavigationTop(newTop);
      descriptionElement.removeEventListener('transitionend', handleTransitionEnd);
    };

    descriptionElement.addEventListener('transitionend', handleTransitionEnd);
  };

  const [navigationTop, setNavigationTop] = useState(20);

  useEffect(() => {
    setNavigationTop(isDescriptionExpanded ? descriptionRef.current?.scrollHeight + 20 : 20);
  }, [isDescriptionExpanded]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Reset barre de progression
      setProgressKey((prevKey) => prevKey + 1);
    }
  };

  const [progressKey, setProgressKey] = useState(0);
  const [progressBarDuration] = useState(6000);

  return (
    <div className="background" style={{ backgroundImage: `url(${backgroundImages[currentBackgroundIndex]})` }}>
      <header>
        <img src={olympicRings} alt="Olympic Rings" className="olympic_rings"/>
      </header>

      <div className="content" ref={contentRef}>
        <div ref={descriptionRef} className={`description ${isDescriptionExpanded ? 'expanded' : ''}`}>
          <p>
            Bienvenue aux Jeux Olympiques de Paris 2024 ! Du 26 juillet au 11 août, la Ville Lumière accueillera le monde entier pour célébrer l'excellence sportive et l'esprit olympique. Découvrez des performances incroyables, vivez des moments d'émotion intense et partagez des souvenirs inoubliables dans des sites emblématiques de Paris. Rejoignez-nous pour cette aventure extraordinaire où l'histoire et l'innovation se rencontrent pour créer des Jeux uniques et inoubliables.
          </p>
        </div>
        <div className="navigation" style={{ top: `${navigationTop}px` }}>
          <span>
            <Link to="/offre">
              <img src={ticketIcon} alt="ticket" style={{ width: '40px', height: '40px', marginRight: '8px', verticalAlign: '-10px', marginTop: '-5px' }} />
              Offre
            </Link>
          </span>
          <span>
            <Link to="/profile">
              <img src={userIcon} alt="user" style={{ width: '30px', height: '30px', marginRight: '8px', verticalAlign: '-5px' }} />
              Mon Compte
            </Link>
          </span>
          <span>
            <Link to="/cart">
              <img src={cartIcon} alt="cart" style={{ width: '30px', height: '30px', marginRight: '8px', verticalAlign: '-5px' }} />
              Panier
              {totalQuantity > 0 && (
                <div className="cart-badge">{totalQuantity}</div>
              )}
            </Link>
          </span>
        </div>
      </div>
      <div className="countdown-container">
        <p>Fin des Jeux Olympiques</p>
        <p className='countdown'>{countdown}</p>
        <div className="playPauseContainer">
          <button className="playPauseButton" onClick={handlePlayPause}>
            <img src={isPlaying ? pauseIcon : playIcon} alt={isPlaying ? 'Pause' : 'Play'} />
          </button>
        </div>
        <div key={progressKey} className="bar" style={{ animationDuration: `${progressBarDuration}ms`, animationPlayState: isPlaying ? 'running' : 'paused' }}></div>
      </div>
      <div className="expand-button-container">
        <div className="expand-button" onClick={toggleDescription}>
          <img src={arrowIcon} alt="Expand" className={`arrow-icon ${isDescriptionExpanded ? 'up' : 'down'}`} />
        </div>
      </div>
    </div>
  );
};

export default Header;
