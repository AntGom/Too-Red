import PropTypes from "prop-types";

export default function ChatWindow({
  selectedUser,
  messages,
  newMessage,
  setNewMessage,
  sendMessage,
  userId,
}) {
  return (
    <div className="w-full md:w-3/4 flex flex-col p-4">
      {selectedUser ? (
        <>
          <h2 className="text-lg font-bold mb-4">Conversación con {selectedUser.name}</h2>
          <div className="flex-1 overflow-y-auto border p-2">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`p-2 my-1 rounded max-w-xs ${
                    msg.sender === userId
                      ? "bg-blue-500 text-white self-end ml-auto"
                      : "bg-gray-300"
                  }`}
                >
                  {msg.text}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No hay mensajes aún.</p>
            )}
          </div>

          <div className="flex mt-2">
            <input
              type="text"
              className="flex-1 p-2 border rounded-md"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Escribe un mensaje..."
            />
            <button
              onClick={sendMessage}
              className="ml-2 p-2 bg-blue-500 text-white rounded-md"
            >
              Enviar
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-center">Selecciona un contacto para chatear</p>
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
