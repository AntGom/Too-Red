import { UserPlusIcon, UserMinusIcon } from "@heroicons/react/24/solid";
import PropTypes from "prop-types";
import { Global } from "../../../../helpers/Global";
import { useToast } from "../../../../hooks/useToast";

const FollowButton = ({ userId, iFollow, setIFollow, token }) => {
  const { showToast } = useToast();
  
  const follow = async () => {
    try {
      const response = await fetch(`${Global.url}follow/save`, {
        method: "POST",
        body: JSON.stringify({ followed: userId }),
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const data = await response.json();
      if (data.status === "success") {
        setIFollow(true);
        showToast({
          message: "¡Ahora sigues a este usuario!",
          type: "success"
        });
      } else {
        showToast({
          message: data.message || "Error al seguir al usuario",
          type: "error"
        });
      }
    } catch (error) {
      showToast({
        message: error.message || "Error de conexión. Inténtalo más tarde.",
        type: "error"
      });
    }
  };

  const unFollow = async () => {
    try {
      const response = await fetch(`${Global.url}follow/unfollow/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const data = await response.json();
      if (data.status === "success") {
        setIFollow(false);
        showToast({
          message: "Has dejado de seguir a este usuario.",
          type: "success"
        });
      } else {
        showToast({
          message: data.message || "Error al dejar de seguir al usuario",
          type: "error"
        });
      }
    } catch (error) {
      showToast({
        message: error.message || "Error de conexión. Inténtalo más tarde.",
        type: "error"
      });
    }
  };

  return (
    <button
      onClick={iFollow ? unFollow : follow}
      className={`flex items-center border-2 ${
        iFollow ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-gray-300 text-gray-900 hover:bg-gray-400"
      } font-semibold px-2 py-2 rounded-full shadow-md hover:scale-110 duration-300 transition-all w-auto h-10`}
    >
      {iFollow ? (
        <>
          <UserMinusIcon className="w-5 h-5 md:mr-2 text-white" />
          <span className="hidden md:inline">Dejar de seguir</span>
        </>
      ) : (
        <>
          <UserPlusIcon className="w-5 h-5 md:mr-2" />
          <span className="hidden md:inline">Seguir</span>
        </>
      )}
    </button>
  );
};

FollowButton.propTypes = {
  userId: PropTypes.string.isRequired,
  iFollow: PropTypes.bool.isRequired,
  setIFollow: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
};

export default FollowButton;