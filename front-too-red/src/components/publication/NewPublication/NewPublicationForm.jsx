/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useContext, useEffect } from "react";
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
  XMarkIcon
} from "@heroicons/react/24/solid";
import { useToast } from "../../../hooks/useToast";
import debounce from "lodash.debounce";
import UserTagMenu from "./UserTagMenu";

const NewPublicationForm = () => {
  const { auth } = useAuth();
  const { form, changed, setForm } = useForm({});
  const [showForm, setShowForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [tagSearch, setTagSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(null);
  const textareaRef = useRef(null);
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

    // Detectar menciones con @
    const cursorPos = e.target.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPos);
    const lastAtSignIndex = textBeforeCursor.lastIndexOf("@");

    if (lastAtSignIndex !== -1) {
      const textAfterAtSign = textBeforeCursor.substring(lastAtSignIndex + 1);
      // Verificar que no haya espacios después del @
      if (!textAfterAtSign.includes(" ") && textAfterAtSign.length > 0) {
        setTagSearch(textAfterAtSign);
        setCursorPosition({
          startPos: lastAtSignIndex,
          endPos: cursorPos,
        });
        setShowTagMenu(true);
        return;
      }
    }

    setShowTagMenu(false);
  };

  const searchUsers = debounce(async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `${Global.url}publication/search-users?query=${query}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        setSearchResults(data.users);
      }
    } catch (error) {
      console.error("Error buscando usuarios:", error);
    }
  }, 300);

  useEffect(() => {
    if (tagSearch) {
      searchUsers(tagSearch);
    } else {
      setSearchResults([]);
    }
  }, [tagSearch]);

  const selectUser = (user) => {
    // Reemplazar la @query con el @nick
    if (textareaRef.current && cursorPosition) {
      const currentText = form.text || "";
      const beforeMention = currentText.substring(0, cursorPosition.startPos);
      const afterMention = currentText.substring(cursorPosition.endPos);

      const newText = beforeMention + "@" + user.nick + " " + afterMention;

      setForm({
        ...form,
        text: newText,
      });

      setCharCount(newText.length);

      // Añadir usuario a las etiquetas seleccionadas si no existe ya
      if (!selectedTags.some((tag) => tag._id === user._id)) {
        setSelectedTags([...selectedTags, user]);
      }

      // Cerrar menú de etiquetas
      setShowTagMenu(false);
      setSearchResults([]);

      // Enfocar de nuevo el textarea y establecer el cursor
      setTimeout(() => {
        if (textareaRef.current) {
          const newCursorPosition = beforeMention.length + user.nick.length + 2;
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(
            newCursorPosition,
            newCursorPosition
          );
        }
      }, 0);
    }
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
        className="flex items-center gap-1 px-2 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-sm hover:shadow-md hover:scale-110 transition-all duration-300 my-3 self-start mx-5"
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
              ref={textareaRef}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none min-h-[120px] text-gray-800"
              placeholder="¿Qué estás pensando? Usa @ para etiquetar usuarios"
              onChange={handleTextChange}
              value={form.text || ""}
              maxLength={1000}
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
              {charCount}/1000
            </div>

            {/* Menú de etiquetas */}
            {showTagMenu && searchResults.length > 0 && (
              <UserTagMenu
                users={searchResults}
                onSelectUser={selectUser}
                onClose={() => setShowTagMenu(false)}
              />
            )}
          </div>

          {/* Mostrar usuarios etiquetados */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              <TagIcon className="h-5 w-5 text-blue-600" />
              {selectedTags.map((tag) => (
                <span
                  key={tag._id}
                  className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs flex items-center"
                >
                  @{tag.nick}
                  <button
                    className="ml-1 text-blue-400 hover:text-blue-700"
                    onClick={() =>
                      setSelectedTags(
                        selectedTags.filter((t) => t._id !== tag._id)
                      )
                    }
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

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
                className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Publicando...</span>
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="w-5 h-5" />
                    <span>Publicar</span>
                  </>
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
