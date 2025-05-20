import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

const Toast = ({ message, type, show, onClose }) => {
  // Bloquear scroll cuando salta
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  if (!show) return null;

  // Estilos según tipo de notificación
  const typeStyles = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white',
  };

  // Contenido
  const toastContent = (
    <div className="fixed top-4 right-4 z-[9999]">

      <div className={clsx(
        'p-4 rounded-lg shadow-lg max-w-md w-auto mx-4',
        typeStyles[type] || typeStyles.info
      )}>
        <div className="flex justify-between items-center">
          <p className="font-medium">{message}</p>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Cerrar"
          >
            <XCircleIcon className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );

  //Portal para renderizar fuera de jerarquía normal
  return createPortal(toastContent, document.body);
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Toast;