import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import {
  PaperAirplaneIcon,
  PaperClipIcon,
  TrashIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/solid";
import MediaPreviewModal from "./MediaPreviewModal";

export default function ChatWindow({
  selectedUser,
  messages,
  newMessage,
  setNewMessage,
  sendMessage,
  deleteMessage,
  userId,
  isOnline,
  setShowContacts,
}) {
  const messagesEndRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  }, [messages]);

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);

    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return `${formatDistanceToNow(date, { locale: es, addSuffix: true })}`;
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (newMessage.trim() !== "") sendMessage();
    }
  };

  const openMedia = (url) => {
    setSelectedMedia(url);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMedia(null);
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-50 rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {selectedUser ? (
        <>
          {/* Header del chat */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white z-10 p-2 flex items-center rounded-t-lg shadow-sm w-[91%] md:w-full fixed top-16 md:sticky md:top-0">
            <button
              onClick={() => setShowContacts(true)}
              className="md:hidden text-white mr-2"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-red-600 font-bold mr-3 border-2 border-white shadow-sm">
              {selectedUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-md font-semibold">{selectedUser.name}</h2>
              <p className="text-xs text-white text-opacity-90">
                @{selectedUser.nick}
              </p>
            </div>
            <p className="text-xs">
              {isOnline ? "🟢 En línea" : "⚫️ Desconectado"}
            </p>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-2 bg-opacity-5 mt-14 md:mt-0">
            {messages.length > 0 ? (
              <div className="space-y-2">
                {messages.map((msg) => {
                  const isSentByMe = msg.sender === userId;

                  return (
                    <div
                      key={msg._id || Math.random().toString()}
                      className={`flex ${
                        isSentByMe ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`group relative max-w-[70%] flex flex-col rounded-2xl px-4 py-2 shadow-sm ${
                          isSentByMe
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-white rounded-bl-none"
                        }`}
                      >
                        {isSentByMe && (
                          <button
                            onClick={() => deleteMessage(msg._id)}
                            className="absolute top-1 right-1 p-1 text-white text-opacity-60 hover:text-red-700 transition-colors hidden group-hover:block"
                            title="Borrar mensaje"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}

                        {msg.text && (
                          <p
                            className={
                              isSentByMe ? "text-white" : "text-gray-800"
                            }
                          >
                            {msg.text}
                          </p>
                        )}

                        {msg.file && (
                          <>
                            {msg.file.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                              <img
                                src={msg.file}
                                alt="imagen"
                                onClick={() => openMedia(msg.file)}
                                className="w-[85%] mt-2 rounded self-center cursor-pointer hover:brightness-90 transition"
                              />
                            ) : (
                              <video
                                controls
                                onClick={() => openMedia(msg.file)}
                                className="max-w-xs mt-2 rounded self-center cursor-pointer hover:brightness-90 transition"
                              >
                                <source src={msg.file} type="video/mp4" />
                                Tu navegador no soporta el vídeo.
                              </video>
                            )}
                          </>
                        )}

                        <div
                          className={`flex items-center justify-end mt-1 space-x-1 ${
                            isSentByMe
                              ? "text-white text-opacity-80"
                              : "text-gray-500"
                          }`}
                        >
                          <span className="text-xs">
                            {formatMessageTime(msg.createdAt)}
                          </span>
                          {isSentByMe && (
                            <span className="flex items-center ml-1 text-xs">
                              {msg.isRead ? (
                                <span className="text-green-400">✓✓</span>
                              ) : (
                                <span className="text-gray-300">✓</span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="bg-white bg-opacity-90 p-6 rounded-xl shadow-sm text-center max-w-sm">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-700 font-medium text-lg">
                    No hay mensajes aún
                  </p>
                  <p className="text-gray-500 mt-1 text-sm">
                    ¡Inicia la conversación con {selectedUser.name}!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Área de escritura */}
          <div className="p-3 bg-white sticky bottom-0 border-t border-gray-200 rounded-b-lg">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex items-center bg-gray-100 rounded-full px-4 py-1"
              encType="multipart/form-data"
            >
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    sendMessage(e.target.files[0]);
                  }
                }}
                className="hidden"
                id="fileInput"
              />
              <label
                htmlFor="fileInput"
                className="cursor-pointer text-blue-600"
              >
                <PaperClipIcon className="h-5 w-5 mr-1" />
              </label>

              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Escribe un mensaje..."
                className="flex-1 bg-transparent py-2 outline-none text-gray-800 placeholder-gray-500"
                rows={1}
              />
              <button
                type="submit"
                className="p-2 text-red-600 hover:text-red-700 transition-colors"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* Modal para previsualizar imágenes/videos */}
          {modalOpen && selectedMedia && (
            <MediaPreviewModal
              fileUrl={selectedMedia}
              isOpen={modalOpen}
              onClose={closeModal}
            />
          )}
        </>
      ) : (
        <div className="h-full flex items-center justify-center bg-gray-50 p-8">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>

            <p className="text-gray-700 font-medium text-lg">
              Selecciona un contacto
            </p>
            <p className="text-gray-500 mt-1 text-sm">
              Elige a alguien con quien chatear.
            </p>
            <button
              className="md:hidden p-2 bg-blue-500 text-white m-4 rounded"
              onClick={() => setShowContacts(true)}
            >
              Ver Contactos
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

ChatWindow.propTypes = {
  selectedUser: PropTypes.object,
  messages: PropTypes.array.isRequired,
  newMessage: PropTypes.string.isRequired,
  setNewMessage: PropTypes.func.isRequired,
  sendMessage: PropTypes.func.isRequired,
  deleteMessage: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  isOnline: PropTypes.bool,
  setShowContacts: PropTypes.func.isRequired,
};
