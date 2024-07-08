import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/MainPage.css';
import checkmark from '../animations/icons8-checkmark.gif';
import { HeaderBase, FooterBase } from './HeaderFooter.js';



const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getTotalQuantity = () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  return cart.reduce((acc, item) => acc + item.quantity, 0);
};

const MainPage = () => {
  const [offers, setOffers] = useState([]);
  const [quantities, setQuantities] = useState([]); 
  const [showPopup, setShowPopup] = useState(false); 
  const [totalQuantity, setTotalQuantity] = useState(getTotalQuantity());

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/offer/`);
        setOffers(response.data);
        setQuantities(response.data.map(() => 0)); 
      } catch (error) {
        console.error('Failed to fetch offers:', error);
      }
    };

    fetchOffers();
  }, []);

  const addToCart = (offerIndex) => {
    const offer = offers[offerIndex];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let itemIndex = cart.findIndex(item => item.id === offer.id);

    if (itemIndex !== -1) {
      cart[itemIndex].quantity += quantities[offerIndex];
    } else {
      cart.push({ ...offer, quantity: quantities[offerIndex] });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    setShowPopup(true); 
    setTotalQuantity(getTotalQuantity()); 
    setTimeout(() => {
    setShowPopup(false); 
    }, 3000);
  };

  const handleQuantityChange = (offerIndex, newQuantity) => {
    
    newQuantity = Math.min(Math.max(newQuantity, 0), 1);

    
    setQuantities(prevQuantities => {
      const newQuantities = [...prevQuantities];
      newQuantities[offerIndex] = newQuantity;
      return newQuantities;
    });
  };

  //const calculateSavingsPercentage = (price, savings) => {
   // return Math.round((savings / price) * 100);
  //};

  return (
    <div className="mainpage-background">
      <HeaderBase totalQuantity={totalQuantity} currentPage="offre" /> 
      <div className="offer-section">
        <h1 className="offer-title">Les Offres :</h1>
        <div className="offer-container">
          {offers.map((offer, index) => (
            <div className="offer-card" key={offer.id}>
              <div className="offer-card-content">
                <div className="offer-title-description">
                  <h3>{offer.title}</h3>
                  <p className="offer-description">{offer.description}</p>
                </div>
                <div className="offer-divider"></div>
                <div className="offer-price-quantity">
                  <p className="offer-price">{parseFloat(offer.price).toFixed(2)}€</p>
                  <div className="quantity-controls-wrapper">
                    <button className="subtract" onClick={() => handleQuantityChange(index, quantities[index] - 1)}>-</button>
                    <input
                      type="number"
                      value={quantities[index]}
                      onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                    />
                    <button className="add" onClick={() => handleQuantityChange(index, quantities[index] + 1)}>+</button>
                  </div>
                  <button className="add-to-basket" onClick={() => addToCart(index)} disabled={quantities[index] === 0}>Ajouter Panier</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {showPopup && <Popup message="Item successfully added to your basket" />}
      </div>
      <FooterBase />
    </div>
  );
};

const Popup = ({ message }) => {
  useEffect(() => {
    const icon = document.querySelector('.animation-icon');
    icon.classList.add('animate');

    setTimeout(() => {
      icon.classList.remove('animate');
    }, 1000);

    return () => {
      icon.classList.remove('animate');
    };
  }, []);

  return (
    <div className="popup">
      <p>{message}</p>
      <img
        src={checkmark}
        alt="Animation"
        className="animation-icon"
        style={{ animationDuration: '1s' }}
      />
    </div>
  );
};

export default MainPage;

