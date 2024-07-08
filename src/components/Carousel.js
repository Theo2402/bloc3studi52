import React, { useRef } from 'react';
import Card from './Card';
import '../css/Carousel.css';

const Carousel = ({ events }) => {
  const containerRef = useRef(null);

  const scrollLeft = () => {
    containerRef.current.scrollBy({ left: -containerRef.current.clientWidth, behavior: 'smooth' });
  };

  const scrollRight = () => {
    containerRef.current.scrollBy({ left: containerRef.current.clientWidth, behavior: 'smooth' });
  };

  return (
    <div className="carousel-wrapper">
      <button className="scroll-btn left" onClick={scrollLeft}>&lt;</button>
      <div className="carousel-container" ref={containerRef}>
        {events.map((event, index) => (
          <Card key={index} event={event} />
        ))}
      </div>
      <button className="scroll-btn right" onClick={scrollRight}>&gt;</button>
    </div>
  );
};

export default Carousel;


















