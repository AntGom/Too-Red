import PropTypes from "prop-types";
import { UserPlusIcon, UserMinusIcon } from "@heroicons/react/24/solid";

const FollowButton = ({ userId, isFollowing, onFollow, onUnfollow }) => {
  return (
    <button
      onClick={() => (isFollowing ? onUnfollow(userId) : onFollow(userId))}
      className={`min-w-28 px-2 py-2 font-semibold text-sm ${
        isFollowing
          ? "flex items-center justify-center bg-white border-2 text-red-600 border-gray-900  rounded-lg shadow-md hover:scale-110 duration-300 transition-all w-38 h-10"
          : "flex items-center justify-center bg-white border-2 border-red-600 text-gray-900 px-4 py-2 rounded-lg shadow-md hover:scale-110 duration-300 transition-all w-38 h-10"
      }`}
    >
      {isFollowing ? (
        <>
          <UserMinusIcon className="w-5 h-5 mr-2 text-red-600" />
          Dejar de seguir
        </>
      ) : (
        <>
          <UserPlusIcon className="w-5 h-5 mr-2 " />
          Seguir
        </>
      )}
    </button>
  );
};

FollowButton.propTypes = {
  userId: PropTypes.string.isRequired,
  isFollowing: PropTypes.bool.isRequired,
  onFollow: PropTypes.func.isRequired,
  onUnfollow: PropTypes.func.isRequired,
};

export default FollowButton;
