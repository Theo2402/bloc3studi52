import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/RegisterPage.css';
import { HeaderBase, FooterBase } from "./HeaderFooter";


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; 
console.log('API_BASE_URL:', API_BASE_URL);

const getTotalQuantity = () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  return cart.reduce((acc, item) => acc + item.quantity, 0);
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [totalQuantity, setTotalQuantity] = useState(getTotalQuantity());

  const [errors, setErrors] = useState({});
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameTaken, setIsUsernameTaken] = useState(false);
  const [showPasswordCriteria, setShowPasswordCriteria] = useState(false);

  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    number: false,
    symbol: false,
  });

  useEffect(() => {
    setTotalQuantity(getTotalQuantity());
  }, []);

  useEffect(() => {
    if (username) {
      const checkUsernameAvailability = async () => {
        setIsCheckingUsername(true);
        try {
          const response = await axios.get(`${API_BASE_URL}/api/check-username/${username}`);
          setIsUsernameTaken(response.data.isTaken);
          setIsCheckingUsername(false);
          if (response.data.isTaken) {
            setErrors(prevErrors => ({ ...prevErrors, username: 'Username is already taken' }));
          } else {
            setErrors(prevErrors => {
              const { username, ...rest } = prevErrors;
              return rest;
            });
          }
        } catch (error) {
          console.error('Error checking username availability', error);
          setIsCheckingUsername(false);
        }
      };

      const delayDebounceFn = setTimeout(() => {
        checkUsernameAvailability();
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [username]);

  useEffect(() => {
    const length = password.length >= 8;
    const uppercase = /[A-Z]/.test(password);
    const number = /[0-9]/.test(password);
    const symbol = /[^A-Za-z0-9]/.test(password);

    setPasswordCriteria({
      length,
      uppercase,
      number,
      symbol,
    });
  }, [password]);

  const validate = () => {
    const newErrors = {};
    if (!username) newErrors.username = 'Le nom d\'utilisateur est nécessaire';
    if (isUsernameTaken) newErrors.username = 'Le nom d\'utilisateur existe déjà';
    if (!name) newErrors.name = 'Le nom est nécessaire';
    if (!email) newErrors.email = 'L\'email est nécessaire';
    if (!password) newErrors.password = 'Le mot de passe est nécessaire';
    if (!passwordCriteria.length) newErrors.password = 'Le mot de passe doit être d\'au moins 8 caractères';
    if (!passwordCriteria.uppercase) newErrors.password = 'Le mot de passe doit contenir au moins une lettre majuscule';
    if (!passwordCriteria.number) newErrors.password = 'Le mot de passe doit contenir au moins un chiffre';
    if (!passwordCriteria.symbol) newErrors.password = 'Le mot de passe doit contenir au moins un symbole';
    return newErrors;
  };

  const register = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setNotification({ message: 'Veuillez corriger les erreurs en rouge', type: 'error' });
      return;
    }

    const user = { username, name, email, password };
    try {
      const response = await axios.post(`${API_BASE_URL}/api/register/`, user);
      console.log('User registered:', response.data);
      setNotification({ message: 'Registration successful! Redirecting to login...', type: 'success' });
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 3000);
    } catch (error) {
      console.error('Registration error', error.response ? error.response.data : error);

      if (error.response && error.response.data) {
        const serverErrors = error.response.data;
        const newErrors = {};
        if (serverErrors.username) {
          newErrors.username = serverErrors.username[0];
        }
        if (serverErrors.email) {
          newErrors.email = serverErrors.email[0];
        }
        setErrors(newErrors);
        setNotification({ message: 'Veuillez corriger les erreurs en rouge', type: 'error' });
      } else {
        setNotification({ message: 'Échec de l\'inscription. Veuillez réessayer.', type: 'error' });
      }
    }
  };

  return (
    <div className="wrapper">
      <HeaderBase totalQuantity={totalQuantity} currentPage="register" />
      <div className="main-content">
        <div className="mon-compte-container">
          <div className="card">
            <h1>Inscription</h1>
            <div className="input-group">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className={errors.username ? 'invalid' : ''}
              />
              {isCheckingUsername && <p className="error-message">Verification du username...</p>}
              {errors.username && <p className="error-message">{errors.username}</p>}
            </div>
            <div className="input-group">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom"
                className={errors.name ? 'invalid' : ''}
              />
              {errors.name && <p className="error-message">{errors.name}</p>}
            </div>
            <div className="input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className={errors.email ? 'invalid' : ''}
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>
            <div className="input-group password-group">
              <input
                type="password"
                value={password}
                onFocus={() => setShowPasswordCriteria(true)}
                onBlur={() => setShowPasswordCriteria(false)}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                className={errors.password ? 'invalid' : ''}
              />
              {errors.password && <p className="error-message">{errors.password}</p>}
              {showPasswordCriteria && (
                <div className="password-criteria-dropdown">
                  <p className={passwordCriteria.length ? 'valid' : ''}>Au moins 8 caractères</p>
                  <p className={passwordCriteria.uppercase ? 'valid' : ''}>1 lettre majuscule</p>
                  <p className={passwordCriteria.number ? 'valid' : ''}>1 chiffre</p>
                  <p className={passwordCriteria.symbol ? 'valid' : ''}>1 symbole</p>
                </div>
              )}
            </div>
            <div className="button-container">
              <button className='register-button' onClick={register} disabled={isCheckingUsername || isUsernameTaken}>
                S'inscrire
              </button>
            </div>
            {notification.message && (
              <p className={`notification ${notification.type}`}>
                {notification.message}
              </p>
            )}
            <div className="login-link">
              <p className="login-text">
                Déjà un compte ? <span className="login-link-text" onClick={() => navigate('/login')}>Connectez-vous ici</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <FooterBase />
    </div>
  );
};

export default RegisterPage;

