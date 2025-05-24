import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Global } from "../../helpers/Global";
import FileInput from "./NewPublication/FileInput";
import Modal from "./NewPublication/ModalNewPublication";
import { useToast } from "../../hooks/useToast";
import { TagIcon } from "@heroicons/react/24/solid";
import TagUserModal from "./TagUser/TagUserModal";

const EditPublication = ({ publication, onSave, onCancel }) => {
  const [editText, setEditText] = useState(publication.text);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [showTagModal, setShowTagModal] = useState(false);
  const token = localStorage.getItem("token") || "";
  const { showToast } = useToast();

  // Cargar etiquetas al montar el componente
  useEffect(() => {
    if (publication.tags) {
      setTags(publication.tags);
    }
  }, [publication.tags]);

  const handleTagUsers = (newTags) => {
    setTags(newTags);
  };

  const saveEdit = async () => {
    if (!editText.trim()) {
      showToast({
        message: "El texto no puede estar vacío",
        type: "error",
      });
      return;
    }

    setLoading(true);

    try {
      //Editar texto de publicación
      const response = await fetch(
        `${Global.url}publication/edit/${publication._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ text: editText }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        if (selectedFile) {
          // Si hay archivo seleccionado, subimos a Cloudinary
          const formData = new FormData();
          formData.append("file", selectedFile);

          const uploadResponse = await fetch(
            `${Global.url}publication/upload/${publication._id}`,
            {
              method: "POST",
              body: formData,
              headers: {
                Authorization: token,
              },
            }
          );

          const uploadData = await uploadResponse.json();

          if (uploadData.status !== "success") {
            showToast({
              message: "Error al subir la imagen",
              type: "error",
            });
          }
        }

        // Procesar etiquetas
        const existingTagIds = publication.tags
          ? publication.tags.map((tag) => tag._id)
          : [];

        // Etiquetas a añadir
        const tagsToAdd = tags.filter(
          (tag) => !existingTagIds.includes(tag._id)
        );

        // Añadir nuevas etiquetas
        const tagPromises = tagsToAdd.map((tag) =>
          fetch(`${Global.url}publication/${publication._id}/tag/${tag._id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }).then((res) => res.json())
        );

        await Promise.all(tagPromises);

        showToast({
          message: "¡Publicación actualizada con éxito!",
          type: "success",
        });

        setTimeout(() => {
          onSave();
        }, 1500);
      } else {
        showToast({
          message: "Error al actualizar la publicación.",
          type: "error",
        });
      }
    } catch (error) {
      showToast({
        message: "Error al actualizar la publicación.",
        type: "error",
      });
      console.error("Error en la solicitud de edición:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onCancel} title="Editar publicación">
      <textarea
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none min-h-[120px]"
      />

      {/* Mostrar etiquetas actuales y botón para abrir modal */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex flex-wrap items-center gap-2">
          {tags.length > 0 && (
            <button
              type="button"
              onClick={() => setShowTagModal(true)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              <TagIcon className="h-5 w-5 inline mr-1" />
              <span>Etiquetar</span>
            </button>
          )}

          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag._id}
                className="inline-flex items-center bg-blue-50 rounded-full px-2.5 py-1 text-xs font-medium text-blue-700"
              >
                @{tag.nick}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center gap-2">

        <div className="mt-4">
          <FileInput onFileSelect={setSelectedFile} />
        </div>

        <div className="flex justify-end mt-6 gap-2">
          <button
            onClick={saveEdit}
            disabled={loading}
            className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
          >
            Cancelar
          </button>
        </div>
      </div>

      {/* Modal de etiquetas */}
      {showTagModal && (
        <TagUserModal
          isOpen={showTagModal}
          onClose={() => setShowTagModal(false)}
          initialTags={tags}
          onTagUsers={handleTagUsers}
          publicationId={publication._id}
        />
      )}
    </Modal>
  );
};

EditPublication.propTypes = {
  publication: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default EditPublication;
