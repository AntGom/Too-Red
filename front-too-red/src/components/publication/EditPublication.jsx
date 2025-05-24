import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Global } from "../../helpers/Global";
import FileInput from "./NewPublication/FileInput";
import Modal from "./NewPublication/ModalNewPublication";
import { useToast } from "../../hooks/useToast";
import { TagIcon, XMarkIcon } from "@heroicons/react/24/solid";

const EditPublication = ({ publication, onSave, onCancel }) => {
  const [editText, setEditText] = useState(publication.text);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const token = localStorage.getItem("token") || "";
  const { showToast } = useToast();
  
  // Cargar etiquetas al montar el componente
  useEffect(() => {
    if (publication.tags) {
      setTags(publication.tags);
    }
  }, [publication.tags]);

  const saveEdit = async () => {
    if (!editText.trim()) {
      showToast({ 
        message: "El texto no puede estar vacío", 
        type: "error" 
      });
      return;
    }

    setLoading(true);

    try {
      //Editar texto de publicación
      const response = await fetch(`${Global.url}publication/edit/${publication._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ text: editText }),
      });

      const data = await response.json();

      if (data.status === "success") {
        if (selectedFile) {
          // Si hay archivo seleccionado, subimos a Cloudinary
          const formData = new FormData();
          formData.append("file", selectedFile);

          const uploadResponse = await fetch(`${Global.url}publication/upload/${publication._id}`, {
            method: "POST",
            body: formData,
            headers: {
              Authorization: token,
            },
          });

          const uploadData = await uploadResponse.json();

          if (uploadData.status !== "success") {
            showToast({
              message: "Error al subir la imagen",
              type: "error"
            });
          }
        }

        showToast({
          message: "¡Publicación actualizada con éxito!",
          type: "success"
        });

        setTimeout(() => {
          onSave(); // Notificar que edición exitosa
        }, 1500);
      } else {
        showToast({
          message: "Error al actualizar la publicación.",
          type: "error"
        });
      }
    } catch (error) {
      showToast({
        message: "Error al actualizar la publicación.",
        type: "error"
      });
      console.error("Error en la solicitud de edición:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const removeTag = async (userId) => {
    try {
      const response = await fetch(
        `${Global.url}publication/${publication._id}/tag/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token,
          },
        }
      );
      
      const data = await response.json();
      
      if (data.status === "success") {
        setTags(tags.filter(tag => tag._id !== userId));
        showToast({
          message: "Etiqueta eliminada correctamente",
          type: "success"
        });
      }
    } catch (error) {
      console.error("Error al eliminar etiqueta:", error);
      showToast({
        message: "Error al eliminar la etiqueta",
        type: "error"
      });
    }
  };

  return (
    <Modal isOpen={true} onClose={onCancel} title="Editar publicación">
      <textarea
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none min-h-[120px]"
      />
      
      {/* Mostrar etiquetas actuales */}
      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1 items-center">
          <TagIcon className="h-5 w-5 text-blue-600" />
          {tags.map(tag => (
            <div 
              key={tag._id} 
              className="inline-flex items-center bg-blue-50 rounded-full px-2 py-1 text-xs font-medium text-blue-700"
            >
              @{tag.nick}
              <button
                onClick={() => removeTag(tag._id)}
                className="ml-1 text-blue-400 hover:text-blue-700"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <FileInput onFileSelect={setSelectedFile} />

      <div className="flex justify-end mt-4 gap-4">
        <button
          onClick={saveEdit}
          disabled={loading}
          className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all ${
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
    </Modal>
  );
};

EditPublication.propTypes = {
  publication: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default EditPublication;