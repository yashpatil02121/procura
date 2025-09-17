import React from 'react';

const ConfirmationDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel', 
  type = 'info' 
}) => {
  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    dialog: {
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      padding: '2rem',
      width: '100%',
      maxWidth: '24rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
    header: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: type === 'warning' ? '#dc2626' : '#1f2937',
    },
    message: {
      marginBottom: '1.5rem',
      color: '#6b7280',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '1rem',
    },
    cancelButton: {
      padding: '0.5rem 1rem',
      backgroundColor: '#f3f4f6',
      color: '#374151',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    confirmButton: {
      padding: '0.5rem 1rem',
      backgroundColor: type === 'warning' ? '#ef4444' : '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    buttonHover: {
      opacity: 0.9,
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.dialog}>
        <h2 style={styles.header}>{title}</h2>
        <p style={styles.message}>{message}</p>
        <div style={styles.buttonContainer}>
          <button 
            onClick={onClose}
            style={{
              ...styles.cancelButton,
              ':hover': styles.buttonHover
            }}
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            style={{
              ...styles.confirmButton,
              ':hover': styles.buttonHover
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
