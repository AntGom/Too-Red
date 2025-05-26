/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  // Estado para la notificación
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: '',
    duration: 3000,
  });

  // Mostrar la notificación
  const showToast = useCallback(({ message, type = 'info', duration = 3000 }) => {
    setToast({
      show: true,
      message,
      type,
      duration,
    });

    if (duration > 0) {
      setTimeout(() => {
        hideToast();
      }, duration);
    }
  }, []);

  // Ocultar la notificación
  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, showToast, hideToast }}>
      {children}
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};