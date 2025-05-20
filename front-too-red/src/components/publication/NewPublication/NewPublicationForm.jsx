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
  const formRef = useRef(null);
  const { showToast } = useToast();

  const { updateCounters } = useContext(CountersContext);

  const resetForm = () => {
    if (formRef.current) formRef.current.reset();
    setSelectedFile(null);
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
        className="flex items-center gap-2 w-4/5 text-gray-900 font-bold text-xl rounded-lg hover:bg-gray-200 p-2 -mb-2 transition-all duration-300 hover:scale-110 text-left"
      >
        <MegaphoneIcon className="w-6 h-6 text-gray-900" />
        Publicar
      </button>

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Nueva publicación"
      >
        <form ref={formRef} onSubmit={savePublication} className="space-y-4">
          <textarea
            name="text"
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none min-h-[120px]"
            placeholder="¿Qué estás pensando?"
            onChange={changed}
          />

          <div className="flex items-center justify-around">
            <FileInput onFileSelect={setSelectedFile} />
            <button
              type="submit"
              className="p-2 text-gray-900 font-medium rounded-lg border-2 border-red-600 hover:scale-105 transition-all duration-200"
              disabled={loading}
            >
              {loading ? "Publicando..." : "Publicar"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default NewPublicationForm;