import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import QRCode from 'qrcode.react';
import { HeaderBase, FooterBase } from "./HeaderFooter";
import '../css/Profile.css';
import { useAuth } from '../contexts/AuthContext';


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; 

const getTotalQuantity = () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  return cart.reduce((acc, item) => acc + item.quantity, 0);
};

const Profile = () => {
  const { user, setUser, logout } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const [totalQuantity, setTotalQuantity] = useState(getTotalQuantity());

  const fetchPurchases = useCallback(async (currentToken) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/purchase/purchase/`, {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });
      console.log('API Response:', response.data);
      setPurchases(response.data);
      setIsLoading(false);
    } catch (fetchError) {
      console.error('Failed to fetch purchases:', fetchError);
      setError(fetchError.message);
      setIsLoading(false);
      if (fetchError.response && fetchError.response.status === 401) {
        logout();
        navigate('/login');
      }
    }
  }, [logout, navigate]);

  const parseJwtAndSetRole = useCallback((token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const decodedToken = JSON.parse(jsonPayload);
      setIsAdmin(decodedToken.is_admin);
      setUser({ ...decodedToken });
    } catch (e) {
      console.error('Failed to parse JWT:', e);
    }
  }, [setUser]);

  const refreshToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        console.error('Refresh token is not available.');
        navigate('/login');
        return;
      }
      const response = await axios.post(`${API_BASE_URL}/api/token/refresh/`, { refresh: refreshToken });
      const newAccessToken = response.data.access;
      const newExpiresAt = new Date().getTime() + (response.data.expires_in * 1000);
      localStorage.setItem('access_token', newAccessToken);
      localStorage.setItem('token_expires_at', newExpiresAt);
      parseJwtAndSetRole(newAccessToken);
      fetchPurchases(newAccessToken);
    } catch (refreshError) {
      console.error('Failed to refresh token:', refreshError);
      logout();
      navigate('/login');
    }
  }, [navigate, parseJwtAndSetRole, fetchPurchases, logout]);

  useEffect(() => {
    const checkTokenAndFetchData = async () => {
      const localToken = localStorage.getItem('access_token');
      const tokenExpiresAt = localStorage.getItem('token_expires_at');
      if (!localToken || new Date().getTime() > tokenExpiresAt) {
        await refreshToken();
      } else {
        parseJwtAndSetRole(localToken);
        fetchPurchases(localToken);
      }
    };

    if (user) {
      checkTokenAndFetchData();
    }

    updateTotalQuantity();

    const interval = setInterval(() => {
      const localToken = localStorage.getItem('access_token');
      const tokenExpiresAt = localStorage.getItem('token_expires_at');
      if (!localToken || new Date().getTime() > tokenExpiresAt) {
        logout();
        navigate('/login');
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [user, logout, navigate, refreshToken, parseJwtAndSetRole, fetchPurchases]);

  const updateTotalQuantity = () => {
    const total = getTotalQuantity();
    setTotalQuantity(total);
    console.log(`Total Quantity: ${total}`);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
      <div className="profile-page">
        <HeaderBase totalQuantity={totalQuantity} currentPage="profile" />
        <div className="profile-container">
          <div className="outer-card">
            <div className="logout-container">
              <button onClick={logout} className="logout-button">Logout</button>
            </div>
            {!isAdmin && (
              <div className="my-tickets-section">
                <h2>Mes Tickets</h2>
                {isLoading ? (
                  <p>Loading tickets...</p>
                ) : purchases.length > 0 ? (
                  purchases.map(purchase => (
                    <div className="ticket-card" key={purchase.id}>
                      <div className="ticket-info">
                        <h3>{purchase.offer?.title || "No Title Available"}</h3>
                        <p>Description: {purchase.offer?.description || "No Description Available"}</p>
                        <p>Date: {new Date(purchase.purchase_date).toLocaleDateString()}</p>
                        <p>Price: {purchase.offer?.price ? parseFloat(purchase.offer.price).toFixed(2) : "N/A"}€</p>
                      </div>
                      <div className="ticket-qr">
                        <QRCode value={purchase.combined_key} size={128} />
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Vous n'avez pas de tickets.</p>
                )}
                {error && <p className="error-message">{error}</p>}
              </div>
            )}
          </div>
        </div>
        <FooterBase />
      </div>
  );
};

export default Profile;






