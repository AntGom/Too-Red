import { ShieldExclamationIcon, ShieldCheckIcon } from "@heroicons/react/24/solid";
import PropTypes from "prop-types";
import { Global } from "../../../../helpers/Global";
import { useToast } from "../../../../hooks/useToast";

const BanButton = ({ user, token }) => {
  const { showToast } = useToast();
  
  const toggleBanStatus = async () => {
    const url = `${Global.url}user/${user.isBanned ? "unban" : "ban"}/${user._id}`;
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const data = await response.json();
      if (data.status === "success") {
        user.isBanned = !user.isBanned;
        showToast({
          message: user.isBanned ? "Usuario baneado con éxito." : "Usuario desbaneado con éxito.",
          type: "success"
        });
      } else {
        showToast({
          message: data.message || "Error al cambiar el estado del usuario",
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
      onClick={toggleBanStatus}
      className="flex items-center justify-center bg-white border-2 border-red-600 text-gray-900 font-semibold px-2 py-2 rounded-lg shadow-md hover:scale-110 duration-300 transition-all w-auto h-10"
    >
      {user.isBanned ? (
        <>
          <ShieldCheckIcon className="w-5 h-5 mr-2 text-green-600" />
          Desbanear
        </>
      ) : (
        <>
          <ShieldExclamationIcon className="w-5 h-5 mr-2 text-red-600" />
          Banear
        </>
      )}
    </button>
  );
};

BanButton.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    isBanned: PropTypes.bool.isRequired,
  }).isRequired,
  token: PropTypes.string.isRequired,
};

export default BanButton;