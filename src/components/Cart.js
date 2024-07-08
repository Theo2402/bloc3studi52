import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Cart.css';
import { HeaderBase, FooterBase } from "./HeaderFooter";


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getTotalQuantity = () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  return cart.reduce((acc, item) => acc + item.quantity, 0);
};

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState('');
  const [totalQuantity, setTotalQuantity] = useState(getTotalQuantity());

  useEffect(() => {
    const loadedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(loadedCartItems);
    setTotalQuantity(getTotalQuantity()); 
  }, []);

  const removeFromCart = (offerId) => {
    const updatedCartItems = cartItems.filter(item => item.id !== offerId);
    setCartItems(updatedCartItems);
    localStorage.setItem('cart', JSON.stringify(updatedCartItems));
    setTotalQuantity(getTotalQuantity()); 
  };

  const checkout = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setMessage('Please log in to complete your purchase.');
      return;
    }

    try {
      const payload = cartItems.map(item => ({ id: item.id }));
      //console.log("Payload being sent:", payload); 
      //console.log("Access Token:", token);

      const response = await axios.post(`${API_BASE_URL}/api/purchase/purchase/`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log("Checkout response:", response.data); 
      setMessage('Purchase successful!');
      setCartItems([]);
      localStorage.removeItem('cart');
      setTotalQuantity(0); // Reset quantite apres le paiement
    } catch (error) {
      console.error('Error during checkout:', error.response ? error.response.data : error);
      setMessage('Checkout failed. Please try again.');
    }
  };

  const totalPrice = cartItems.reduce((total, item) => total + parseFloat(item.price), 0).toFixed(2);

  return (
    <div id="root">
      <HeaderBase totalQuantity={totalQuantity} currentPage="cart" />
      <div className="main-content">
        <div className="cart-page">
          <h1>Panier</h1>
          {message && <p>{message}</p>}
          <p>Vous avez {cartItems.length} objets dans votre panier.</p>
          {cartItems.length === 0 ? (
            <p>Votre panier est vide.</p>
          ) : (
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-info">
                    <img src={item.image} alt={item.title} className="item-image" />
                    <div>
                      <h4>{item.title}</h4>
                      <p>Description: {item.description}</p>
                    </div>
                  </div>
                  <div className="item-controls">
                    <button onClick={() => removeFromCart(item.id)}>✕</button>
                    <p>{parseFloat(item.price).toFixed(2)}€</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {cartItems.length > 0 && (
            <div className="cart-summary">
              <div className="summary-item">
                <span>Sous-total</span>
                <span>{totalPrice}€</span>
              </div>
              <div className="summary-item">
                <span>Total</span>
                <span>{totalPrice}€</span>
              </div>
              <button onClick={checkout}>Acheter</button>
            </div>
          )}
        </div>
      </div>
      <FooterBase />
    </div>
  );
};

export default Cart;







