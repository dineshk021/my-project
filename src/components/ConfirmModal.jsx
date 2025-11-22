import React from "react";
import "./styles.css";

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmBtnText = "Confirm", cancelBtnText = "Cancel" }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="modal-confirm-btn">
            {confirmBtnText}
          </button>
          <button onClick={onCancel} className="modal-cancel-btn">
            {cancelBtnText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
