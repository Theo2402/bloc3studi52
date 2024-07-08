import React, { useState } from 'react';
import '../css/AdminOffre.css';
import trashIcon from '../icons/trash.png';
import ModalAdmin from './ModalAdmin';

const AdminOffer = ({ offers, setOffers, newOffer, setNewOffer, handleAddOffer, handleDeleteOffer, showPreview, setShowPreview }) => {
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
                <button className="preview" type="button" onClick={() => setShowPreview(true)}>Preview</button>
                <button className="add-offer" type="submit">Add Offer</button>
              </div>
            </form>
            {showPreview && (
              <div className="offer-preview">
                <div className="iframe-container">
                  <iframe
                    title="Offer Preview"
                    className="iframe-preview"
                    srcDoc={`
                      <!DOCTYPE html>
                      <html lang="en">
                      <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <style>
                          body {
                            font-family: Arial, sans-serif;
                            padding: 20px;
                            background-color: #f7f7f7;
                          }
                          .mainpage-background {
                            background-color: #f7f7f7;
                          }
                          .offer-section {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                          }
                          .offer-container {
                            max-width: 800px;
                            margin-bottom: 100px;
                            display: flex;
                            flex-direction: column;
                          }
                          .offer-title {
                            text-align: left;
                            margin-bottom: 50px;
                            margin-top: 60px;
                          }
                          .offer-card {
                            position: relative;
                            display: flex;
                            flex-direction: column;
                            padding: 20px;
                            border-radius: 10px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                            width: 90vw;
                            max-width: 600px;
                            margin-bottom: 30px;
                            background-color: #29336F;
                            color: white;
                          }
                          .offer-card h3 {
                            margin-top: 0;
                          }
                          .offer-card-content {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            width: 100%;
                          }
                          .offer-title-description {
                            display: flex;
                            flex-direction: column;
                          }
                          .offer-description {
                            margin-top: 10px;
                          }
                          .offer-divider {
                            border-right: 1px solid #ccc;
                            height: 100%;
                            margin-right: 10px;
                          }
                          .offer-price-quantity {
                            display: flex;
                            align-items: center;
                            margin-left: 20px;
                          }
                          .offer-price {
                            margin-right: 40px;
                          }
                          .quantity-controls-wrapper {
                            display: flex;
                            align-items: center;
                            border: 1px solid #7881AF;
                            border-radius: 25px;
                            padding: 3px;
                            background-color: #7881AF;
                          }
                          .quantity-controls-wrapper button {
                            width: 35px;
                            height: 25px;
                            font-size: 14px;
                            border-radius: 50%;
                            background-color: #7881AF;
                            color: white;
                            border: none;
                            cursor: pointer;
                          }
                          .quantity-controls-wrapper input {
                            width: 20px;
                            height: 20px;
                            text-align: center;
                            font-size: 14px;
                            border-radius: 15px;
                            border: none;
                            background-color: #7881AF;
                            color: white;
                          }
                          .quantity-controls-wrapper input:focus {
                            outline: none;
                          }
                          .add-to-basket {
                            height: 30px;
                            width: 120px;
                            font-size: 14px;
                            border-radius: 10px;
                            background-color: #fddb32;
                            border: #c6c6c6;
                            cursor: pointer;
                            margin-left: 35px;
                          }
                          .add-to-basket:hover {
                            background-color: #e9ca2b;
                          }
                          .add-to-basket:active {
                            background-color: #e9ca2b;
                            border: 1px solid blue;
                          }
                          .add-to-basket:disabled {
                            background-color: #ccc;
                            color: #666;
                            cursor: not-allowed;
                            border: 1px solid rgb(209, 209, 209);
                          }
                        </style>
                      </head>
                      <body>
                        <div class="mainpage-background">
                          <div class="offer-section">
                            <h1 class="offer-title">Ticket Offers</h1>
                            <div class="offer-container">
                              <div class="offer-card">
                                <div class="offer-card-content">
                                  <div class="offer-title-description">
                                    <h3>${newOffer.title}</h3>
                                    <p class="offer-description">${newOffer.description}</p>
                                  </div>
                                  <div class="offer-divider"></div>
                                  <div class="offer-price-quantity">
                                    <p class="offer-price">${parseFloat(newOffer.price).toFixed(2)}€</p>
                                    <div class="quantity-controls-wrapper">
                                      <button class="subtract" disabled>-</button>
                                      <input type="number" value="0" disabled />
                                      <button class="add" disabled>+</button>
                                    </div>
                                    <button class="add-to-basket" disabled>Add to Cart</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </body>
                      </html>
                    `}
                  />
                  <button className="close-iframe" onClick={() => setShowPreview(false)}>X</button>
                </div>
              </div>
            )}
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
