import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export default function ChatWindow({
  selectedUser,
  messages,
  newMessage,
  setNewMessage,
  sendMessage,
  userId,
}) {
  const messagesEndRef = useRef(null);
  
  // Auto-scroll al último mensaje
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Función para formatear la fecha
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    return `${formatDistanceToNow(date, { locale: es, addSuffix: true })}`;
  };

return (
  <div className="w-full flex flex-col h-full bg-gray-100">
    {selectedUser ? (
      <>
        {/* Cabecera */}
        <div className="bg-blue-600 text-white p-3 flex items-center sticky top-0 z-10 shadow-sm rounded-lg rounded-b-none">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-red-600 font-bold mr-3">
            {selectedUser.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">Chat con {selectedUser.name}</h2>
          </div>
        </div>

        {/* Área de mensajes */}
        <div className="flex-1 overflow-y-auto p-2 bg-gary-200 bg-opacity-70 ]">
          {messages.length > 0 ? (
            <div className="space-y-1.5">
              {messages.map((msg) => {
                const isSentByMe = msg.sender === userId;
                
                return (
                  <div
                    key={msg._id || Math.random().toString()}
                    className={`flex ${isSentByMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-1.5 ${
                        isSentByMe 
                          ? "bg-blue-100 rounded-tr-none" 
                          : "bg-white rounded-tl-none"
                      }`}
                      style={{
                        boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)"
                      }}
                    >
                      {!isSentByMe && (
                        <span className="block text-xs font-semibold text-red-500 mb-0.5">
                          {selectedUser.name}
                        </span>
                      )}
                      <p className="text-[#111b21] text-base">{msg.text}</p>
                      
                      <div className={`flex items-center justify-end mt-0.5 space-x-1 ${
                        isSentByMe ? "text-[#667781]" : "text-[#667781]"
                      }`}>
                        <span className="text-xs" style={{ fontSize: '0.6875rem' }}>
                          {formatMessageTime(msg.createdAt)}
                        </span>
                        {isSentByMe && (
                          <span className="flex items-center" style={{ fontSize: '0.6875rem' }}>
                            {msg.isRead ? (
                              <span className="text-red-500 ml-1">✓✓</span>
                            ) : (
                              <span className="ml-1">✓</span>
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
              <p className="text-gray-500 bg-white bg-opacity-80 p-4 rounded-lg">
                No hay mensajes aún. ¡Comienza la conversación!
              </p>
            </div>
          )}
        </div>

        {/* Área de escritura */}
        <div className="p-2 bg-white sticky bottom-0 border-t border-[#d1d7db]">
          <div className="flex items-center bg-[#f0f2f5] rounded-lg px-3">
            <input
              type="text"
              className="flex-1 bg-transparent py-2 px-3 outline-none text-gray-800 placeholder-gray-500"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Escribe un mensaje..."
            />
            <button
              onClick={sendMessage}
              className="p-2 text-gray-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
            </div>
          </div>
        </>
      ) : (
        <div className="h-full flex items-center justify-center bg-gray-50 p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg font-medium">Selecciona un contacto para chatear</p>
            <p className="text-gray-500 text-sm mt-2">Tus conversaciones aparecerán aquí</p>
          </div>
        </div>
      )}
    </div>
  );
}

ChatWindow.propTypes = {
  selectedUser: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
  }),
  messages: PropTypes.array.isRequired,
  newMessage: PropTypes.string.isRequired,
  setNewMessage: PropTypes.func.isRequired,
  sendMessage: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
};