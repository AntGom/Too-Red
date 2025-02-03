/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import ContactList from "./ContactList";
import ChatWindow from "./ChatWindow";
import { Global } from "../../helpers/Global";

const socket = io("http://localhost:3900");

export default function Chat() {
  const [contacts, setContacts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user.id : null;

  useEffect(() => {
    const getContacts = async () => {
      try {
        const response = await fetch(
          `${Global.url}follow/following/${userId}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        const data = await response.json();
        setContacts(data.follows.map((follow) => follow.followed));
      } catch (err) {
        console.error("Error obteniendo contactos:", err);
      }
    };

    getContacts();
  }, []);

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
    <div className="flex h-screen">
      <ContactList
        contacts={contacts}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />
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
