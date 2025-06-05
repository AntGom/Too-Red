import PropTypes from "prop-types";
import { useState } from "react";
import { Global } from "../../../../helpers/Global";
import Modal from "../../../publication/NewPublication/ModalNewPublication";
import { useToast } from "../../../../hooks/useToast";

const DeleteProfileModal = ({ authId, token, onDeleteSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const deleteProfile = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${Global.url}user/delete/${authId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      const data = await response.json();

      if (data.message === "Usuario eliminado correctamente (soft delete)") {
        showToast({
          message: "¡Perfil eliminado con éxito!",
          type: "success",
        });

        setTimeout(() => {
          onDeleteSuccess();
        }, 1000);
      } else {
        showToast({
          message: "Error al eliminar el perfil.",
          type: "error",
        });
        console.error("Error al eliminar el perfil:", data.message);
      }
    } catch (error) {
      showToast({
        message: "Error al eliminar el perfil.",
        type: "error",
      });
      console.error("Error al eliminar el perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onCancel} title="Eliminar perfil">
      <p className="text-gray-700 font-semibold text-start">
        ¿Estás seguro de que deseas{" "}
        <span className="text-red-500">eliminar tu perfil</span>?
      </p>
      <p className="text-gray-700 font-medium text-start">
        Tienes <span className="font-semibold">30 días</span> para cancelar esta
        acción. Después de este período, tu cuenta será{" "}
        <span className="text-red-500">eliminada de forma permanente</span>.
      </p>

      <div className="flex justify-end mt-6 gap-4">
        <button
          onClick={deleteProfile}
          className={`px-4 py-2 text-white font-medium rounded-lg bg-red-600 hover:bg-red-700 transition-all ${
            loading ? "bg-gray-400 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Eliminando..." : "Eliminar"}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
        >
          Cancelar
        </button>
      </div>
    </Modal>
  );
};

DeleteProfileModal.propTypes = {
  authId: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  onDeleteSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default DeleteProfileModal;
