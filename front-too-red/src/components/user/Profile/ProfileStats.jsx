import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

const ProfileStats = ({ user, counters }) => (
  <div className="mt-3 flex gap-4">
    <NavLink
      to={`/social/siguiendo/${user._id}`}
      className="flex flex-row justify-center items-center border-2 border-red-600 p-1 rounded-xl hover:scale-105 transition-all gap-1"
    >
      <span className="text-xl font-bold text-red-600">
        {counters.following || 0}
      </span>
      <span className="text-sm font-medium text-gray-900">Siguiendo</span>
    </NavLink>
    <NavLink
      to={`/social/seguidores/${user._id}`}
      className="flex flex-row justify-center items-center border-2 border-red-600 p-1 rounded-xl hover:scale-105 transition-all gap-1"
    >
      <span className="text-xl font-bold text-red-600">
        {counters.followers || 0}
      </span>
      <span className="text-sm font-medium text-gray-900">Seguidores</span>
    </NavLink>
  </div>
);

ProfileStats.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
  counters: PropTypes.shape({
    following: PropTypes.number,
    followers: PropTypes.number,
  }).isRequired,
};

export default ProfileStats;
