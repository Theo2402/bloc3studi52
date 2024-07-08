import React from 'react';
import Header from './HomePageHeader';
import Carousel from './Carousel';
import Footer from './HomePageFooter.js';
import '../css/HomePage.css';

const HomePage = () => {
  const events = [
    { id: 1, title: 'Natation', description: 'La natation est un défi contre la résistance de l\'eau, où les nageurs cherchent à réaliser les meilleurs temps sur diverses distances et styles de nage.||Les épreuves individuelles et en équipe offrent des courses spectaculaires et l\'opportunité de battre des records.' },
    { id: 2, title: 'Aviron', description: 'L\'aviron implique de glisser sur l\'eau en synchronisant les mouvements avec ses coéquipiers pour franchir la ligne d\'arrivée en premier. ||C\'est un sport qui demande de la force, de la technique et de la coordination.' },
    { id: 3, title: 'Basketball', description: 'Le basketball est un duel d\'adresse et de stratégie entre deux équipes de cinq joueurs, où les participants dribblent, passent et marquent des paniers. ||Spectaculaire et rythmé, il est suivi par des millions de fans à travers le monde.' },
    { id: 4, title: 'Escrime', description: 'L\'escrime consiste à toucher son adversaire avec précision et rapidité en utilisant une épée, un fleuret ou un sabre. ||Ce sport allie adresse et stratégie, exigeant technique et anticipation.' },
    { id: 5, title: 'Golf', description: 'Au golf, l\'objectif est d\'envoyer une balle dans le trou en un minimum de coups sur un parcours semé d\'embûches. ||C\'est un sport de précision et de concentration qui requiert patience et stratégie.' },
    { id: 6, title: 'Handball', description: 'Le handball est un sport collectif intense où les joueurs cherchent à marquer des buts en lançant la balle dans le but adverse avec leurs mains. ||Rapidité, coordination et puissance sont de mise.' },
    { id: 7, title: 'Judo', description: 'Le judo est un sport martial axé sur la projection de l\'adversaire au sol ou sa contrainte à l\'abandon par des techniques de saisie et de projection. ||Il met l\'accent sur la discipline, le respect et le contrôle de soi.' },
    { id: 8, title: 'Tennis', description: 'Au tennis, les joueurs échangent des coups de raquette avec pour objectif de faire rebondir la balle dans le camp adverse pour remporter le point. ||Intense et individuel, il demande précision et endurance.' },
    { id: 9, title: 'Voile', description: 'La voile consiste à exploiter la force du vent pour naviguer sur un bateau et franchir la ligne d\'arrivée en tête. ||C\'est un sport technique et stratégique, en communion avec la nature.' },
    { id: 10, title: 'Water-Polo', description: 'Le water-polo est un sport aquatique intense où les joueurs tentent de marquer des buts en lançant la balle dans le but adverse avec leurs mains. ||Il requiert natation, force et précision.' },
    { id: 11, title: 'Gymnastique', description: 'En gymnastique, les athlètes réalisent des acrobaties et des mouvements complexes avec grâce et précision sur différents agrès. ||C\'est un sport exigeant force, souplesse et contrôle du corps.' },
  ];

  if (!events || !Array.isArray(events) || events.length === 0) {
    return <div>No events available</div>;
  }

  return (
    <div className="homepage">
      <Header/>
      <div className="container">
        <div className="content-container">
          <Carousel events={events} />
        </div>
        <div className="bottom-content">
          <h4>Citius, altius, fortius ~ Plus vite, plus haut, plus fort</h4>
          <h8>Devise des Jeux Olympiques</h8>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;




