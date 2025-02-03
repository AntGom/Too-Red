import PropTypes from "prop-types";

export default function ContactList({ contacts, selectedUser, setSelectedUser }) {
  return (
    <div className="w-1/4 bg-gray-200 p-4 md:order-last md:w-1/4">
      <h2 className="text-lg font-bold mb-4">CONTACTOS</h2>
      {contacts.length > 0 ? (
        contacts.map((user) => (
          <div
            key={user._id}
            className={`cursor-pointer p-2 rounded-md ${
              selectedUser?._id === user._id ? "bg-blue-300" : "hover:bg-gray-300"
            }`}
            onClick={() => setSelectedUser(user)}
          >
            <span className="text-lg font-semibold text-gray-800">{user.name}</span>
          </div>
        ))
      ) : (
        <p>No sigues a nadie aún.</p>
      )}
    </div>
  );
}

ContactList.propTypes = {
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedUser: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
  }),
  setSelectedUser: PropTypes.func.isRequired,
};
