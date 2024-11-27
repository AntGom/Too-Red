import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Global } from "../../../helpers/Global";
import { TrashIcon } from "@heroicons/react/24/outline";
import Modal from "../NewPublication/ModalNewPublication";
import NotificationMessage from "../NewPublication/NotificationMessage";

const DeleteComment = ({
  publicationId,
  publicationUserId,
  commentId,
  commentUserId,
  onDelete,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Decodificar token para obtener datos del usuario logueado
      try {
        const user = JSON.parse(atob(token.split(".")[1])); // Decodificar payload
        // Compara id de usuario logueado con id usuario que creó el comentario/owner publicacion
        setIsOwner(user.id === commentUserId || user.id === publicationUserId);
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }
  }, [commentUserId, publicationUserId]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setModalMessage("No estás autenticado. Por favor, inicia sesión.");
        return;
      }

      const response = await fetch(
        `${Global.url}publication/${publicationId}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token,
          },
        }
      );

      const data = await response.json();
      if (response.ok && data.status === "success") {
        onDelete(commentId);
        setShowModal(false);
      } else if (response.status === 403) {
        setModalMessage("No tienes permiso para eliminar este comentario.");
      }
    } catch (error) {
      console.error("Error al eliminar comentario:", error.message);
      setModalMessage("Hubo un error. Por favor, inténtalo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOwner) {
    return null; // No mostrar si usuario no es propietario comentario/publicación
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-red-600 hover:text-red-800 hover:scale-125 transition-all duration-300"
        title="Eliminar comentario"
        aria-label="Eliminar comentario"
      >
        <TrashIcon className="h-5 w-5" />
      </button>

      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Eliminar Comentario"
        >
          {modalMessage ? (
            <NotificationMessage
              status="error"
              setStatus={() => {}}
              errorMessage={modalMessage}
            />
          ) : (
            <>
              <p className="text-gray-700 font-semibold text-center">
                ¿Estás seguro de que deseas eliminar este comentario?
              </p>
              <div className="flex justify-end mt-6 gap-4">
                <button
                  onClick={handleDelete}
                  className={`px-4 py-2 text-white font-medium rounded-lg bg-red-600 hover:bg-red-700 transition-all ${
                    loading ? "bg-gray-400 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "Eliminando..." : "Eliminar"}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </>
          )}
        </Modal>
      )}
    </>
  );
};

DeleteComment.propTypes = {
  publicationId: PropTypes.string.isRequired,
  publicationUserId: PropTypes.string,
  commentId: PropTypes.string.isRequired,
  commentUserId: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default DeleteComment;
