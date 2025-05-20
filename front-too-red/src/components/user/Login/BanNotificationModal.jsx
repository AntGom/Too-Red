import PropTypes from "prop-types";

const BanNotificationModal = ({ onConfirm }) => {
    return (
      <section className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <article className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Tu cuenta ha sido suspendida
          </h2>
          <p className="text-gray-600 mb-6">
            Por favor, contacta con el soporte de Too-Red si crees que esto es un
            error.
          </p>
          <button
            onClick={onConfirm}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            Aceptar
          </button>
        </article>
      </section>
    );
  };

  BanNotificationModal.propTypes = {
    onConfirm: PropTypes.func.isRequired,
  };
  

  export default BanNotificationModal;