import { useState } from "react";
import PropTypes from "prop-types";
import avatar from "../../../assets/img/user.png";

const ProfileImage = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const imageUrl =
    user.image && user.image !== "default.png" ? `${user.image}` : avatar;

  return (
    <>
      {/* Imagen de perfil */}
      <div className="relative">
        <div className="w-28 h-28 rounded-full border-4 ml-1 mb-2 lg:ml-4 border-white shadow-md overflow-hidden bg-white">
          <img
            src={imageUrl}
            className="w-full h-full object-cover transition-all duration-300 hover:scale-110 cursor-pointer"
            alt={`Foto de perfil de ${user.name}`}
            onClick={handleImageClick}
          />
        </div>
        {user.isBanned && (
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-white">
            🚫
          </div>
        )}
      </div>

      {/* Modal para ver la imagen ampliada */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div className="relative max-w-xl w-full mx-4 p-2">
            <div className="bg-white rounded-2xl overflow-hidden">
              {/* Imagen ampliada */}
              <img
                src={imageUrl}
                className="w-full object-cover"
                alt={`Foto de perfil de ${user.name}`}
              />
            </div>
            {/* Botón para cerrar */}
            <button
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition-all"
              onClick={closeModal}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  );
};

ProfileImage.propTypes = {
  user: PropTypes.shape({
    image: PropTypes.string,
    name: PropTypes.string.isRequired,
    isBanned: PropTypes.bool,
  }).isRequired,
};

export default ProfileImage;
