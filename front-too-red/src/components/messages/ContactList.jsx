import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Global } from "../../helpers/Global";

export default function ContactList({
  userId,
  selectedUser,
  setSelectedUser,
  onlineUsers,
}) {
  const [contacts, setContacts] = useState([]);
  const [unreadSenders, setUnreadSenders] = useState([]);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const token = localStorage.getItem("token");

  // Obtener contactos
  useEffect(() => {
    if (!userId || contacts.length > 0) return;

    const getContacts = async () => {
      try {
        const response = await fetch(
          `${Global.url}follow/following/${userId}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.status === "success" && Array.isArray(data.follows)) {
          const sortedContacts = data.follows
            .map((follow) => follow.followed)
            .filter((user) => user._id !== userId)
            .sort((a, b) =>
              a.name.localeCompare(b.name, "es", { sensitivity: "base" })
            );

          setContacts(sortedContacts);
        } else {
          setContacts([]);
        }
      } catch (err) {
        console.error("Error obteniendo contactos:", err);
      }
    };

    getContacts();
  }, [userId, contacts.length, token]);

  // Obtener mensajes no leídos
  useEffect(() => {
    if (!userId || !token) return;

    const fetchUnreadMessages = async () => {
      try {
        const response = await fetch(`${Global.url}messages/unread`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          if (data.status === "success") {
            setHasUnreadMessages(data.hasUnread);
            setUnreadSenders(data.sendersWithUnread || []);
          }
        } else {
          const text = await response.text();
          console.error("Respuesta no JSON recibida:", text);
        }
      } catch (error) {
        console.error("Error al obtener mensajes no leídos:", error);
      }
    };

    fetchUnreadMessages();
  }, [userId, token]);

  // Escuchar eventos de socket para actualizar mensajes NO leídos
  useEffect(() => {
    if (!userId) return;

    const handleNewMessage = (event) => {
      const data = event.detail;
      if (
        data.receiver === userId &&
        (!selectedUser || data.sender !== selectedUser._id)
      ) {
        setUnreadSenders((prev) => [...new Set([...prev, data.sender])]);
        setHasUnreadMessages(true);
      }
    };

    window.addEventListener("newMessageReceived", handleNewMessage);

    return () => {
      window.removeEventListener("newMessageReceived", handleNewMessage);
    };
  }, [userId, selectedUser]);

  // Marcar mensajes como leídos al seleccionar un contacto
  const handleSelectUser = async (user) => {
    if (user._id === selectedUser?._id) return;

    setSelectedUser(user);

    // Marcar mensajes como leídos si hay NO leídos de este usuario
    if (unreadSenders.includes(user._id)) {
      try {
        await fetch(`${Global.url}messages/markAsRead/${user._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        // Actualizar estado local
        setUnreadSenders((prev) => prev.filter((id) => id !== user._id));
        if (unreadSenders.length === 1) {
          setHasUnreadMessages(false);
        }
      } catch (error) {
        console.error("Error al marcar mensajes como leídos:", error);
      }
    }
  };

  return (
    <div className="h-full w-full max-w-md flex flex-col bg-white rounded-md overflow-hidden  border-red-600 border-2">
      <div className="bg-gray-200 text-gray-900 text-md font-bold py-3 text-center rounded-t-md">
        CONTACTOS {hasUnreadMessages && "•"}
      </div>

      <div className="flex flex-col gap-2 p-3 max-h-full overflow-y-auto">
        {contacts.length > 0 ? (
          contacts.map((user) => (
            <div
              key={user._id}
              className={`cursor-pointer p-3 rounded-md text-center transition duration-300 flex justify-between items-center ${
                selectedUser?._id === user._id
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200 focus:ring-2 focus:ring-blue-300"
              }`}
              onClick={() => handleSelectUser(user)}
              tabIndex={0}
            >
              <div className="flex items-center">
                <span className="text-lg font-semibold">{user.name}</span>
                {onlineUsers[user._id] && (
                  <span className="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
                )}
              </div>

              {/* Indicador de mensajes no leídos (punto rojo) */}
              {unreadSenders.includes(user._id) && (
                <span
                  className={`${
                    selectedUser?._id === user._id ? "bg-white" : "bg-red-500"
                  } w-2 h-2 rounded-full`}
                ></span>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No sigues a nadie aún.</p>
        )}
      </div>
    </div>
  );
}

ContactList.propTypes = {
  userId: PropTypes.string.isRequired,
  selectedUser: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
  }),
  setSelectedUser: PropTypes.func.isRequired,
  onlineUsers: PropTypes.object,
};
