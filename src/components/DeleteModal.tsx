import React from 'react';
import styles from './DeleteModal.module.css';

interface Props {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteModal: React.FC<Props> = ({ id, isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <h2 className="heading-m">Confirm Deletion</h2>
        <p className="body-text">
          Are you sure you want to delete invoice #{id}? This action cannot be undone.
        </p>
        <div className={styles.actions}>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
