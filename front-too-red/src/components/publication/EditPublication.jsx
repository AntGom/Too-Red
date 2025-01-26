import PropTypes from "prop-types";
import { useState } from "react";
import { Global } from "../../helpers/Global";
import NotificationMessage from "./NewPublication/NotificationMessage";
import FileInput from "./NewPublication/FileInput";
import Modal from "./NewPublication/ModalNewPublication";

const EditPublication = ({ publication, onSave, onCancel }) => {
  const [editText, setEditText] = useState(publication.text);
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState("not_stored");
  const token = localStorage.getItem("token") || "";

  const saveEdit = async () => {
    if (!editText.trim()) {
      alert("El texto no puede estar vacío");
      return;
    }

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
          //Si hay archivo seleccionado, subimos a Cloudinary
          const formData = new FormData();
          formData.append("file0", selectedFile);

          const uploadResponse = await fetch(`${Global.url}publication/upload/${publication._id}`, {
            method: "POST",
            body: formData,
            headers: {
              Authorization: token,
            },
          });

          const uploadData = await uploadResponse.json();

          if (uploadData.status === "success") {
            setStatus("stored"); //Indicar imagen subida exitosamente
          } else {
            setStatus("error"); //Error si carga falla
          }
        } else {
          setStatus("stored"); //Si no hay archivo, solo actualiza texto
        }

        setTimeout(() => {
          onSave(); // Notificar que edición exitosa
        }, 1500);
      } else {
        setStatus("error"); //Error si edición texto falla
      }
    } catch (error) {
      setStatus("error");
      console.error("Error en la solicitud de edición:", error);
    }
  };

  return (
    <Modal isOpen={true} onClose={onCancel} title="Editar publicación">
      <textarea
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none min-h-[120px]"
      />

      <FileInput onFileSelect={setSelectedFile} /> {/* Componente para seleccionar archivo */}

      <div className="flex justify-end mt-4 gap-4">
        <button
          onClick={saveEdit}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
        >
          Guardar
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
        >
          Cancelar
        </button>
      </div>

      <NotificationMessage
        status={status}
        setStatus={setStatus}
        successMessage="¡Publicación actualizada con éxito!"
        errorMessage="Error al actualizar la publicación."
      />
    </Modal>
  );
};

EditPublication.propTypes = {
  publication: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default EditPublication;
