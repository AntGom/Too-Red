/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import Modal from "../NewPublication/ModalNewPublication";
import { Global } from "../../../helpers/Global";
import PropTypes from "prop-types";
import { useToast } from "../../../hooks/useToast";
import { XMarkIcon } from "@heroicons/react/24/solid";
import avatar from "../../../assets/img/user.png";

const TagUserModal = ({
  isOpen,
  onClose,
  initialTags = [],
  onTagUsers,
  publicationId,
}) => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const { showToast } = useToast();

  // Inicializar con etiquetas existentes
  useEffect(() => {
    if (isOpen) {
      setSelectedUsers(initialTags);
    }
  }, [initialTags, isOpen]);

  const searchUsers = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${Global.url}publication/search-users?query=${query}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        // Filtrar usuarios ya seleccionados
        const filteredUsers = data.users.filter(
          (user) => !selectedUsers.some((selected) => selected._id === user._id)
        );
        setSearchResults(filteredUsers);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error al buscar usuarios:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Manejar búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.length >= 2) {
        searchUsers(search);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const handleUserSelect = (user) => {
    setSelectedUsers((prev) => {
      // Verificar si existe usuario
      if (prev.some((u) => u._id === user._id)) {
        return prev;
      }
      return [...prev, user];
    });
    setSearch("");
    setSearchResults([]);
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers((prev) => prev.filter((user) => user._id !== userId));
  };

  const handleSave = async () => {
    if (selectedUsers.length === 0) {
      onClose();
      return;
    }

    try {
      setLoading(true);

      // Si hay ID de publicación-> modo edición
      if (publicationId) {
        // Primero, obtenemos etiquetas actuales para saber cuáles añadir/quitar
        const tagsToAdd = selectedUsers.filter(
          (user) => !initialTags.some((tag) => tag._id === user._id)
        );

        // Promesas para añadir etiquetas nuevas
        const tagPromises = tagsToAdd.map((user) =>
          fetch(`${Global.url}publication/${publicationId}/tag/${user._id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }).then((res) => res.json())
        );

        await Promise.all(tagPromises);
      }

      onTagUsers(selectedUsers);
      showToast({
        message: "Usuarios etiquetados correctamente",
        type: "success",
      });
    } catch (error) {
      console.error("Error al guardar etiquetas:", error);
      showToast({
        message: "Error al guardar etiquetas",
        type: "error",
      });
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Etiquetar usuarios">
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar usuarios..."
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          {loading && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Resultados de búsqueda */}
        {searchResults.length > 0 && (
          <div className="border rounded-md max-h-40 overflow-y-auto">
            {searchResults.map((user) => (
              <div
                key={user._id}
                onClick={() => handleUserSelect(user)}
                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center border-b last:border-b-0"
              >
                <img
                  src={
                    user.image && user.image !== "default.png"
                      ? user.image
                      : avatar
                  }
                  alt={user.name}
                  className="w-8 h-8 rounded-full mr-2 object-cover"
                />
                <div>
                  <div className="font-medium text-sm">
                    {user.name} {user.surname}
                  </div>
                  <div className="text-xs text-gray-500">@{user.nick}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Usuarios seleccionados */}
        {selectedUsers.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Usuarios etiquetados:
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <div
                  key={user._id}
                  className="inline-flex items-center bg-blue-50 rounded-full px-2.5 py-1.5 text-xs font-medium text-blue-700"
                >
                  <img
                    src={
                      user.image && user.image !== "default.png"
                        ? user.image
                        : avatar
                    }
                    alt={user.name}
                    className="w-4 h-4 rounded-full mr-1.5 object-cover"
                  />
                  @{user.nick}
                  <button
                    onClick={() => handleRemoveUser(user._id)}
                    className="ml-1.5 text-blue-400 hover:text-blue-700"
                    title="Eliminar etiqueta"
                  >
                    <XMarkIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end mt-4 gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar etiquetas"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

TagUserModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initialTags: PropTypes.array,
  onTagUsers: PropTypes.func.isRequired,
  publicationId: PropTypes.string,
};

export default TagUserModal;
