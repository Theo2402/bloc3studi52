import React from 'react';
import '../css/Modal.css';

const Modal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onConfirm} className="modal-confirm">Confirm</button>
          <button onClick={onClose} className="modal-cancel">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
