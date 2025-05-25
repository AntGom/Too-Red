import { useState, useRef, useContext } from "react";
import { Global } from "../../../helpers/Global";
import useForm from "../../../hooks/UseForm";
import { useAuth } from "../../../hooks/UseAuth";
import Modal from "./ModalNewPublication";
import FileInput from "./FileInput";
import { CountersContext } from "../../../context/CountersContext";
import {
  MegaphoneIcon,
  TagIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/solid";
import { useToast } from "../../../hooks/useToast";
import TagUserModal from "../TagUser/TagUserModal";

const NewPublicationForm = () => {
  const { auth } = useAuth();
  const { form, changed, setForm } = useForm({});
  const [showForm, setShowForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [showTagModal, setShowTagModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const formRef = useRef(null);
  const { showToast } = useToast();

  const { updateCounters } = useContext(CountersContext);

  const resetForm = () => {
    if (formRef.current) formRef.current.reset();
    setSelectedFile(null);
    setCharCount(0);
    setSelectedTags([]);
    setForm({});
  };

  const handleTextChange = (e) => {
    const value = e.target.value;
    changed(e);
    setCharCount(value.length);
  };

  const handleTagUsers = (users) => {
    setSelectedTags(users);
  };

  const savePublication = async (e) => {
    e.preventDefault();

    if (!form.text?.trim()) {
      showToast({ message: "El texto no puede estar vacío", type: "error" });
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      // Crear publicación sin imagen
      const newPublication = { ...form, user: auth._id };

      const request = await fetch(Global.url + "publication/save/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(newPublication),
      });

      const data = await request.json();

      if (data.status === "success") {
        updateCounters("publications", 1);

        const publicationId = data.publicationStored._id;

        // Añadir etiquetas
        const tagPromises = selectedTags.map((tag) =>
          fetch(`${Global.url}publication/${publicationId}/tag/${tag._id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }).then((res) => res.json())
        );

        // Esperar a que se completen todas las etiquetas
        await Promise.all(tagPromises);

        // Subir archivo si existe
        if (selectedFile) {
          const formData = new FormData();
          formData.append("file", selectedFile);

          const uploadRequest = await fetch(
            Global.url + "publication/upload/" + publicationId,
            {
              method: "POST",
              body: formData,
              headers: { Authorization: token },
            }
          );

          const uploadData = await uploadRequest.json();
          if (uploadData.status !== "success") {
            showToast({ message: "Error al subir la imagen", type: "error" });
          }
        }

        // Disparar evento de nueva publicación
        const publicationCreatedEvent = new CustomEvent("publicationCreated", {
          detail: { userId: auth._id },
        });
        window.dispatchEvent(publicationCreatedEvent);

        showToast({
          message: "Publicación realizada con éxito",
          type: "success",
        });
        resetForm();
        setTimeout(() => {
          setShowForm(false);
        }, 1000);
      } else {
        showToast({
          message: "Error al realizar la publicación",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error al guardar la publicación:", error);
      showToast({ message: "Error al realizar la publicación", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className=" flex items-center justify-center w-full gap-1 px-2 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
      >
        <MegaphoneIcon className="w-5 h-5"/>
        <span className="text-md"> Nueva publicación</span>
      </button>

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Nueva publicación"
      >
        <form ref={formRef} onSubmit={savePublication} className="space-y-4">
          <div className="relative">
            <textarea
              name="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none min-h-[120px] text-gray-800"
              placeholder="¿Qué estás pensando?"
              onChange={handleTextChange}
              value={form.text || ""}
              maxLength={1000}
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
              {charCount}/1000
            </div>
          </div>

          {/* Mostrar usuarios etiquetados */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-1 items-center">
              <TagIcon className="h-5 w-5 text-blue-600" />
              {selectedTags.map((user) => (
                <span
                  key={user._id}
                  className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"
                >
                  @{user.nick}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileInput onFileSelect={setSelectedFile} />

              <button
                type="button"
                onClick={() => setShowTagModal(true)}
                className="inline-flex items-center p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-all"
              >
                <TagIcon className="h-5 w-5 text-blue-600" />
                <span className="ml-1 text-gray-700 text-sm">Etiquetar</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`p-2 text-gray-900 font-medium rounded-lg border-2 border-red-600 hover:scale-105 transition-all duration-200 flex items-center gap-2 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></span>
                  <span>Publicando...</span>
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="h-5 w-5" />
                  <span>Publicar</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de etiquetas */}
      {showTagModal && (
        <TagUserModal
          isOpen={showTagModal}
          onClose={() => setShowTagModal(false)}
          initialTags={selectedTags}
          onTagUsers={handleTagUsers}
        />
      )}
    </>
  );
};

export default NewPublicationForm;
