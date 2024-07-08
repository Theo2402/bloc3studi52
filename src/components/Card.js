import React from 'react';
import '../css/Card.css'; 

import avironIcon from '../pictogrammes/aviron.png';
import basketballIcon from '../pictogrammes/basketball.png';
import escrimeIcon from '../pictogrammes/escrime.png';
import golfIcon from '../pictogrammes/golf.png';
import gymnastiqueIcon from '../pictogrammes/gymnastique.png';
import handballIcon from '../pictogrammes/handball.png';
import judoIcon from '../pictogrammes/judo.png';
import natationIcon from '../pictogrammes/natation.png';
import tennisIcon from '../pictogrammes/tennis.png';
import voileIcon from '../pictogrammes/voile.png';
import waterpoloIcon from '../pictogrammes/waterpolo.png';

const Card = ({ event }) => {
  const getIcon = (title) => {
    switch (title.toLowerCase()) {
      case 'natation':
        return natationIcon;
      case 'aviron':
        return avironIcon;
      case 'basketball':
        return basketballIcon;
      case 'escrime':
        return escrimeIcon;
      case 'golf':
        return golfIcon;
      case 'gymnastique':
        return gymnastiqueIcon;
      case 'handball':
        return handballIcon;
      case 'judo':
        return judoIcon;
      case 'tennis':
        return tennisIcon;
      case 'voile':
        return voileIcon;
      case 'water-polo':
        return waterpoloIcon;
      default:
        return null;
    }
  };

  return (
    <div className="event-card">
      <div className="content">
        <div className="title-icon-container">
          <h2>{event.title}</h2>
          {getIcon(event.title) && <img src={getIcon(event.title)} alt="Icon" className="event-icon" />}
        </div>
        <div className="descriptionCard">
          {event.description.split('||').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Card;







