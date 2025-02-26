/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Global } from "../../helpers/Global";

export default function ContactList({ userId, selectedUser, setSelectedUser }) {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    if (!userId || contacts.length > 0) return;
  
    const getContacts = async () => {
      try {
        const response = await fetch(`${Global.url}follow/following/${userId}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
  
        const data = await response.json();
  
        if (data.status === "success" && Array.isArray(data.follows)) {
          const sortedContacts = data.follows
            .map((follow) => follow.followed)
            .sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" }));
  
          setContacts(sortedContacts);
        } else {
          setContacts([]);
        }
      } catch (err) {
        console.error("Error obteniendo contactos:", err);
      }
    };
  
    getContacts();
  }, [userId]);
  

  return (
    <div className="h-full w-full max-w-md flex flex-col bg-white rounded-md overflow-hidden">
      <div className="bg-gray-300 text-gray-900 text-md font-bold py-3 text-center rounded-t-md">
        CONTACTOS
      </div>

      <div className="flex flex-col gap-2 p-3 max-h-full overflow-y-auto">
        {contacts.length > 0 ? (
          contacts.map((user) => (
            <div
              key={user._id}
              className={`cursor-pointer p-3 rounded-md text-center transition duration-300 ${
                selectedUser?._id === user._id
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200 focus:ring-2 focus:ring-blue-300"
              }`}
              onClick={() => setSelectedUser(user)}
              tabIndex={0}
            >
              <span className="text-lg font-semibold">{user.name}</span>
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
};
