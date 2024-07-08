import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import QRCode from 'qrcode.react';
import Header from './AdminHeader';
import PurchaseChart from './AdminChart';
import UsersPage from './AdminUsersPage';
import AdminOffer from './AdminOffre';
import '../css/AdminPage.css';
import '../css/MainPage.css';
import '../css/AdminOffre.css';


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; 
console.log('API_BASE_URL:', API_BASE_URL);

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [offers, setOffers] = useState([]);
  const [newOffer, setNewOffer] = useState({
    title: '',
    description: '',
    price: ''
  });

  const [expandedUsers, setExpandedUsers] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [page, setPage] = useState('admin');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('Authentication token not found');
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/user/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Users response:', response.data);
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          console.error('Unexpected response format for users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchPurchases = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/purchase/purchase/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        //console.log('Purchases response:', response.data);
        if (Array.isArray(response.data)) {
          setPurchases(response.data);
        } else {
          console.error('Unexpected response format for purchases');
        }
      } catch (error) {
        console.error('Error fetching purchases:', error);
      }
    };

    const fetchOffers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/offer/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        //console.log('Offers response:', response.data);
        if (Array.isArray(response.data)) {
          setOffers(response.data);
        } else {
          console.error('Unexpected response format for offers');
        }
      } catch (error) {
        console.error('Error fetching offers:', error);
      }
    };

    fetchUsers();
    fetchPurchases();
    fetchOffers();
  }, []);

  const handleAddOffer = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.post(`${API_BASE_URL}/api/offer/`, newOffer, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setOffers([...offers, response.data]);
      setNewOffer({ title: '', description: '', price: '' });
      setShowPreview(false);
    } catch (error) {
      console.error('Error adding offer:', error);
    }
  };

  const handleDeleteOffer = async (offerId) => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.delete(`${API_BASE_URL}/api/offer/${offerId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setOffers(offers.filter(offer => offer.id !== offerId));
    } catch (error) {
      console.error('Error deleting offer:', error);
    }
  };

  const handleDeleteUser = async () => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.delete(`${API_BASE_URL}/api/user/${userToDelete.uuid}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUsers(users.filter(user => user.uuid !== userToDelete.uuid));
      setShowConfirmDialog(false);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const confirmDeleteUser = (user) => {
    setUserToDelete(user);
    setShowConfirmDialog(true);
  };

  const toggleUserDetails = (uuid) => {
    setExpandedUsers(prevState => ({
      ...prevState,
      [uuid]: !prevState[uuid]
    }));
  };

  return (
    <div className="admin-page-container">
      <Header setPage={setPage} />
      {page === 'admin' && (
        <>
          <div className="admin-chart-container">
            <PurchaseChart purchases={purchases} offers={offers} />
          </div>
        </>
      )}
      {page === 'users' && (
        <UsersPage
          users={users}
          purchases={purchases}
          setUsers={setUsers}
          setShowConfirmDialog={setShowConfirmDialog}
          confirmDeleteUser={confirmDeleteUser}
          expandedUsers={expandedUsers}
          toggleUserDetails={toggleUserDetails}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      )}
      {page === 'offers' && (
        <AdminOffer
          offers={offers}
          setOffers={setOffers}
          newOffer={newOffer}
          setNewOffer={setNewOffer}
          handleAddOffer={handleAddOffer}
          handleDeleteOffer={handleDeleteOffer}
          showPreview={showPreview}
          setShowPreview={setShowPreview}
        />
      )}
      {showConfirmDialog && (
        <div className="lightbox">
          <div className="confirm-dialog">
            <h3>Etes-vous sur de vouloir supprimer cet utlilsateur ?</h3>
            <p>{userToDelete && userToDelete.name}</p>
            <div className="confirm-dialog-buttons">
              <button onClick={handleDeleteUser}>Yes</button>
              <button onClick={() => setShowConfirmDialog(false)}>Non</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
