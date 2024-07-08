import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import MainPage from './components/MainPage';
import LoginPage from './components/LoginPage';
import Profile from './components/Profile';
import AdminPage from './components/AdminPage';
import Cart from './components/Cart';
import ProtectedRoute from './routing/ProtectedRoute';
import HomePage from './components/HomePage';
import RegisterPage from './components/RegisterPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/offre" element={<MainPage />} />
            <Route path="/login" element={<AuthWrapper><LoginPage /></AuthWrapper>} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}



const AuthWrapper = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    return null; // pas de login page qd le user est connecte
  }
  return children;
};

export default App;


