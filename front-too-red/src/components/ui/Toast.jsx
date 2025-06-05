import { useEffect } from "react";
import PropTypes from "prop-types";
import {
  XCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { createPortal } from "react-dom";
import clsx from "clsx";

const Toast = ({ message, type, show, onClose }) => {
  // Bloquear scroll cuando salta
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [show]);

  if (!show) return null;

  // Iconos según tipo
  const icons = {
    success: <CheckCircleIcon className="w-6 h-6" />,
    error: <XCircleIcon className="w-6 h-6" />,
    warning: <ExclamationTriangleIcon className="w-6 h-6" />,
    info: <InformationCircleIcon className="w-6 h-6" />,
  };

  // Estilos según tipo de notificación
  const typeStyles = {
    success: "bg-gradient-to-r from-green-500 to-green-600 text-white",
    error: "bg-gradient-to-r from-red-500 to-red-600 text-white",
    warning: "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white",
    info: "bg-gradient-to-r from-blue-400 to-blue-500 text-white",
  };

  // Contenido
  const toastContent = (
    <div className="fixed top-4 right-4 z-[9999] animate-fade-in">
      <div
        className={clsx(
          "p-4 rounded-lg shadow-lg max-w-md w-auto mx-4 border border-white border-opacity-20",
          typeStyles[type] || typeStyles.info
        )}
      >
        <div className="flex items-center">
          <div className="flex-shrink-0">{icons[type] || icons.info}</div>
          <div className="ml-3 flex-1">
            <p className="font-medium">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={onClose}
              className="inline-flex text-white hover:text-gray-200 focus:outline-none focus:text-gray-200 transition-colors"
              aria-label="Cerrar"
            >
              <XCircleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  //Portal para renderizar fuera de jerarquía normal
  return createPortal(toastContent, document.body);
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error", "warning", "info"]),
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Toast;
