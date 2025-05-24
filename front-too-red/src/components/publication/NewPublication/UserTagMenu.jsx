import PropTypes from "prop-types";

const UserTagMenu = ({ users, onSelectUser, onClose }) => {
  return (
    <div 
      className="absolute z-10 mt-1 bg-white rounded-md shadow-lg max-h-60 w-full overflow-auto border border-gray-300"
    >
      {users.length === 0 ? (
        <div className="py-2 px-3 text-sm text-gray-500">
          No se encontraron usuarios
        </div>
      ) : (
        <ul className="py-1">
          {users.map(user => (
            <li key={user._id}>
              <button
                type="button"
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 flex items-center"
                onClick={() => {
                  onSelectUser(user);
                  onClose();
                }}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                  <img 
                    src={user.image} 
                    alt={user.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/40";
                    }}
                  />
                </div>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-gray-500">@{user.nick}</div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

UserTagMenu.propTypes = {
  users: PropTypes.array.isRequired,
  onSelectUser: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default UserTagMenu;