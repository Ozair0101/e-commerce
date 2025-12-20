import React from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, onConfirm, onCancel, confirmLabel = 'Yes', cancelLabel = 'No' }) => {
  // Define colors based on toast type
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Define icon based on toast type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg ${getTypeStyles()} animate-fade-in`}>
      <span className="material-symbols-outlined mr-2">{getIcon()}</span>
      <span className="text-sm font-medium mr-4">{message}</span>

      {onConfirm && onCancel ? (
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={onCancel}
            className="px-3 py-1 text-xs font-semibold rounded bg-white/10 hover:bg-white/20 text-white border border-white/30"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1 text-xs font-semibold rounded bg-white text-gray-900 hover:bg-gray-100"
          >
            {confirmLabel}
          </button>
          <button 
            onClick={onClose}
            className="ml-1 text-white hover:text-gray-200 focus:outline-none"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      ) : (
        <button 
          onClick={onClose}
          className="ml-auto text-white hover:text-gray-200 focus:outline-none"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      )}
    </div>
  );
};

export default Toast;