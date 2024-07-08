import React, { useRef } from 'react';
import QRCode from 'qrcode.react';
import '../css/AdminUsersPage.css';

const UsersPage = ({ users, purchases, setShowConfirmDialog, confirmDeleteUser, expandedUsers, toggleUserDetails, searchTerm, setSearchTerm }) => {
  const cardRefs = useRef({});

  const handleToggleUserDetails = (uuid) => {
    toggleUserDetails(uuid);
    const cardElement = cardRefs.current[uuid];
    if (cardElement) {
      const rect = cardElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      if (rect.bottom > viewportHeight) {
        cardElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }
  };

  // Filtrer les username 'admin'
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase() !== 'admin' && (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.uuid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="admin-card-container">
      <div className="admin-card-wrapper">
        <div className="admin-card">
          <h2>Liste des utilisateurs et des achats</h2>
          <div className="admin-card-content visible">
            <input
              type="text"
              className="admin-user-search"
              placeholder="Search users or uuid..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {filteredUsers.length === 0 ? (
              <p>No users found.</p>
            ) : (
              filteredUsers.map(user => (
                <div key={user.uuid} ref={el => cardRefs.current[user.uuid] = el} className="admin-user-item user-card">
                  <div className="admin-user-header">
                    <div className="user-info">
                      <h4>{user.name}</h4>
                      <p className="user-email">email: {user.email}</p>
                      <p>uuid: {user.uuid}</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); confirmDeleteUser(user); }}>Delete</button>
                  </div>
                  {expandedUsers[user.uuid] && (
                    <div className="admin-user-details">
                      <hr />
                      {purchases.filter(purchase => purchase.user.username === user.username).length === 0 ? (
                        <p>Pas d'achat effectué</p>
                      ) : (
                        purchases
                          .filter(purchase => purchase.user.username === user.username)
                          .map(purchase => (
                            <div key={purchase.id} className="admin-purchase-item">
                              <div className="admin-purchase-details">
                                <div className="purchase-info">
                                  <p className="purchase-detail"><strong>Offer:</strong> {purchase.offer.title}</p>
                                  <p className="purchase-detail"><strong>Purchase Date:</strong> {new Date(purchase.purchase_date).toLocaleString()}</p>
                                  <p className="purchase-detail"><strong>Safe Key:</strong> {purchase.safe_key}</p>
                                  <p className="purchase-detail"><strong>Combined Key:</strong> {purchase.combined_key}</p>
                                </div>
                                <div className="qr-code-wrapper">
                                  <QRCode className="purchase-qr" value={purchase.combined_key} size={128} />
                                </div>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  )}
                  <div className="achats-header" onClick={() => handleToggleUserDetails(user.uuid)}>
                    <span>Achats</span>
                    <span className="arrow">{expandedUsers[user.uuid] ? '▲' : '▼'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;

