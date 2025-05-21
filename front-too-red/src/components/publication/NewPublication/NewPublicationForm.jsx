import { useState, useRef, useContext } from "react";
import { Global } from "../../../helpers/Global";
import useForm from "../../../hooks/UseForm";
import { useAuth } from "../../../hooks/UseAuth";
import Modal from "./ModalNewPublication";
import FileInput from "./FileInput";
import { CountersContext } from "../../../context/CountersContext";
import { MegaphoneIcon } from "@heroicons/react/24/solid";
import { useToast } from "../../../hooks/useToast";

const NewPublicationForm = () => {
  const { auth } = useAuth();
  const { form, changed } = useForm({});
  const [showForm, setShowForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const formRef = useRef(null);
  const { showToast } = useToast();

  const { updateCounters } = useContext(CountersContext);

  const resetForm = () => {
    if (formRef.current) formRef.current.reset();
    setSelectedFile(null);
    setCharCount(0);
  };

  const handleTextChange = (e) => {
    changed(e);
    setCharCount(e.target.value.length);
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

        // Disparar evento de nueva publicación
        const publicationCreatedEvent = new CustomEvent('publicationCreated', {
          detail: { userId: auth._id }
        });
        window.dispatchEvent(publicationCreatedEvent);

        if (selectedFile) {
          // Subir el archivo al backend después de crear la publicación
          const formData = new FormData();
          formData.append("file", selectedFile);

          const uploadRequest = await fetch(
            Global.url + "publication/upload/" + data.publicationStored._id,
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

        showToast({ message: "Publicación realizada con éxito", type: "success" });
        resetForm();
        setTimeout(() => {
          setShowForm(false);
        }, 1000);
      } else {
        showToast({ message: "Error al realizar la publicación", type: "error" });
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
        className="flex items-center gap-1 px-2 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 my-3 self-start mx-5"
      >
        <MegaphoneIcon className="w-5 h-5" />
        <span className="text-sm"> Nueva publicación</span>
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
              maxLength={1000}
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
              {charCount}/1000
            </div>
          </div>

          <div className="flex items-center justify-between">
            <FileInput onFileSelect={setSelectedFile} />
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Publicando...</span>
                  </>
                ) : (
                  <span>Publicar</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default NewPublicationForm;