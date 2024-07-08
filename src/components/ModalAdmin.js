import React from 'react';
import '../css/ModalAdmin.css';



const ModalAdmin = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onConfirm} className="modal-confirm">Oui</button>
          <button onClick={onClose} className="modal-cancel">Non</button>
        </div>
      </div>
    </div>
  );
};

export default ModalAdmin;


