import { useState, useEffect, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import ContactList from "./ContactList";
import ChatWindow from "./ChatWindow";
import { Global } from "../../helpers/Global";

export default function Chat() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showContacts, setShowContacts] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState({});

  const socketRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user.id : null;

  // Borrar un mensaje
  const deleteMessage = async (messageId) => {
    if (!messageId) return;
    try {
      const response = await fetch(`${Global.url}messages/${messageId}`, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      if (response.ok) {
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      } else {
        console.error("❌ No se pudo borrar el mensaje");
      }
    } catch (err) {
      console.error("❌ Error al borrar mensaje:", err);
    }
  };

  // Inicializar socket
  useEffect(() => {
    const socketUrl = Global.url.replace("/api/", "");
    socketRef.current = io(socketUrl, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on("connect", () => {
      setIsConnected(true);
    });

    socketRef.current.on("connect_error", (error) => {
      setIsConnected(false);
      console.error("❌ Socket error:", error);
    });

    if (userId) {
      socketRef.current.emit("joinRoom", userId);
    }

    const handleStatusChange = (data) => {
      setOnlineUsers((prev) => ({
        ...prev,
        [data.userId]: data.isOnline,
      }));
    };

    const handleMessageRead = (data) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.sender === data.sender &&
          msg.receiver === data.receiver &&
          !msg.isRead
            ? { ...msg, isRead: true, readAt: data.readAt }
            : msg
        )
      );
    };

    socketRef.current.on("onlineUsers", (onlineUserIds) => {
      const statusMap = {};
      onlineUserIds.forEach((id) => {
        statusMap[id] = true;
      });
      setOnlineUsers(statusMap);
    });

    socketRef.current.on("userStatusChange", handleStatusChange);
    socketRef.current.on("messageRead", handleMessageRead);

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    const getMessages = async () => {
      if (!selectedUser || !userId) return;

      try {
        const response = await fetch(
          `${Global.url}messages/${userId}/${selectedUser._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        const data = await response.json();
        setMessages(data.messages || []);
      } catch (err) {
        console.error("❌ Error obteniendo mensajes:", err);
      }
    };

    getMessages();
  }, [selectedUser, userId]);

  const markMessageAsRead = useCallback(
    async (senderId) => {
      if (!senderId || !userId) return;

      try {
        const response = await fetch(
          `${Global.url}messages/markAsRead/${senderId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        if (response.ok) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.sender === senderId && !msg.isRead
                ? { ...msg, isRead: true, readAt: new Date() }
                : msg
            )
          );
        }
      } catch (err) {
        console.error("❌ Error marcando mensajes como leídos:", err);
      }
    },
    [userId]
  );

  const handleNewMessage = useCallback(
    (data) => {
      const newMessageEvent = new CustomEvent("newMessageReceived", {
        detail: data,
      });
      window.dispatchEvent(newMessageEvent);

      if (
        data.sender === selectedUser?._id ||
        data.receiver === selectedUser?._id
      ) {
        setMessages((prev) => {
          if (prev.some((msg) => msg._id === data._id)) return prev;
          return [...prev, data];
        });

        if (data.sender === selectedUser?._id) {
          markMessageAsRead(data.sender);
        }
      }
    },
    [selectedUser, markMessageAsRead]
  );

  useEffect(() => {
    if (!socketRef.current) return;
    socketRef.current.on("newMessage", handleNewMessage);

    return () => {
      socketRef.current.off("newMessage", handleNewMessage);
    };
  }, [handleNewMessage]);

  const sendMessage = useCallback(
    async (file = null) => {
      if ((!newMessage.trim() && !file) || !selectedUser || !userId) return;

      const formData = new FormData();
      formData.append("sender", userId);
      formData.append("receiver", selectedUser._id);
      if (newMessage.trim()) formData.append("text", newMessage);
      if (file) formData.append("file", file);

      try {
        const response = await fetch(`${Global.url}messages/new`, {
          method: "POST",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
          body: formData,
        });

        const data = await response.json();
        const newMsg = data.data;

        socketRef.current.emit("newMessage", newMsg);
        setMessages((prev) => [...prev, newMsg]);
      } catch (err) {
        console.error("❌ Error enviando mensaje:", err);
      }

      setNewMessage("");
    },
    [newMessage, selectedUser, userId]
  );

  return (
    <div className="flex h-screen gap-4 flex-col md:flex-row mb-">
      {!isConnected && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full">
          <p>
            ❌ No hay conexión con el servidor de chat. Los mensajes pueden no
            enviarse en tiempo real.
          </p>
        </div>
      )}

      <ChatWindow
        selectedUser={selectedUser}
        messages={messages}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        sendMessage={sendMessage}
        deleteMessage={deleteMessage}
        userId={userId}
        isOnline={selectedUser ? onlineUsers[selectedUser._id] : false}
        setShowContacts={setShowContacts}
      />

      {showContacts && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center md:hidden z-20"
          onClick={() => setShowContacts(false)}
        >
          <div
            className="bg-white w-3/4 h-3/4 rounded-lg p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <ContactList
              userId={userId}
              selectedUser={selectedUser}
              setSelectedUser={(user) => {
                setSelectedUser(user);
                setShowContacts(false);
              }}
              onlineUsers={onlineUsers}
            />
          </div>
        </div>
      )}

      <div className="hidden md:block md:w-1/6">
        <ContactList
          userId={userId}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          onlineUsers={onlineUsers}
        />
      </div>
    </div>
  );
}
