import React, { useState } from 'react';
import '../css/AdminOffre.css';
import trashIcon from '../icons/trash.png';
import ModalAdmin from './ModalAdmin';

const AdminOffer = ({ offers, setOffers, newOffer, setNewOffer, handleAddOffer, handleDeleteOffer }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const openModal = (offerId) => {
    setSelectedOffer(offerId);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedOffer(null);
  };

  const confirmDelete = () => {
    handleDeleteOffer(selectedOffer);
    closeModal();
  };

  return (
    <div className="admin-offer-container admin-page">
      <div className="admin-offers-left">
        <h3>Ajouter une offre:</h3>
        <div className="admin-offers-card">
          <div className="admin-card-content visible">
            <form onSubmit={handleAddOffer} className="admin-form">
              <input
                type="text"
                value={newOffer.title}
                onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                placeholder="Title"
                required
              />
              <input
                type="text"
                value={newOffer.description}
                onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                placeholder="Description"
                required
              />
              <input
                type="number"
                step="0.01"
                value={newOffer.price}
                onChange={(e) => setNewOffer({ ...newOffer, price: e.target.value })}
                placeholder="Price"
                required
              />
              <div className="button-container">
                <button className="add-offer" type="submit">Add Offer</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="admin-offers-right">
        <h3>Offres existantes:</h3>
        <div className="admin-existing-offers">
          {offers.length === 0 ? (
            <p>No offers found.</p>
          ) : (
            offers.map(offer => (
              <div className="offer-card" key={offer.id}>
                <img
                  src={trashIcon}
                  alt="Delete Offer"
                  className="delete-icon"
                  onClick={() => openModal(offer.id)}
                />
                <div className="offer-card-content">
                  <div className="offer-title-description">
                    <h3>{offer.title}</h3>
                    <p className="offer-description">{offer.description}</p>
                  </div>
                  <div className="offer-divider"></div>
                  <div className="offer-price-quantity">
                    <p className="offer-price">{parseFloat(offer.price).toFixed(2)}€</p>
                    <div className="quantity-controls-wrapper">
                      <button className="subtract" disabled>-</button>
                      <input type="number" value="0" disabled />
                      <button className="add" disabled>+</button>
                    </div>
                    <button className="add-to-basket" disabled>Add to Cart</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <ModalAdmin
        isOpen={modalIsOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
        title="Confirmation"
        message="Êtes vous sûr de vouloir supprimer cette offre ?"
      />
    </div>
  );
};

export default AdminOffer;

