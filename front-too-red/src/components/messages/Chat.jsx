/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import ContactList from "./ContactList";
import ChatWindow from "./ChatWindow";
import { Global } from "../../helpers/Global";

const socket = io("http://localhost:3900");

export default function Chat() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showContacts, setShowContacts] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user.id : null;

  useEffect(() => {
    const getMessages = async () => {
      if (!selectedUser) return;

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
        console.error("Error obteniendo mensajes:", err);
      }
    };

    getMessages();
  }, [selectedUser]);

  useEffect(() => {
    const handleNewMessage = (data) => {
      if (data.sender === selectedUser?._id) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [selectedUser]);

  const sendMessage = useCallback(async () => {
    if (newMessage.trim() === "" || !selectedUser) return;

    const messageData = {
      sender: userId,
      receiver: selectedUser._id,
      text: newMessage,
    };

    try {
      const response = await fetch(`${Global.url}messages/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(messageData),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, data.data]);
      socket.emit("newMessage", data.data);
    } catch (err) {
      console.error("Error enviando mensaje:", err);
    }

    setNewMessage("");
  }, [newMessage, selectedUser]);

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <button
        className="md:hidden p-2 bg-blue-500 text-white m-2 rounded"
        onClick={() => setShowContacts(true)}
      >
        Ver Contactos
      </button>

      {showContacts && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center md:hidden"
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
            />
          </div>
        </div>
      )}

      <div className="hidden md:block md:w-1/4 bg-gray-200 border-red-600 border-2 rounded-lg">
        <ContactList
          userId={userId}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      </div>

      <ChatWindow
        selectedUser={selectedUser}
        messages={messages}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        sendMessage={sendMessage}
        userId={userId}
      />
    </div>
  );
}
