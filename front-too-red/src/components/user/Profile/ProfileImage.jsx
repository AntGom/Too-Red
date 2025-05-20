import { useState } from "react";
import PropTypes from "prop-types";
import avatar from "../../../assets/img/user.png";

const ProfileImage = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const imageUrl =
    user.image && user.image !== "default.png"
      ? `${user.image}`
      : avatar;

  return (
    <>
      {/* Imagen de perfil */}
      <div className="relative flex-shrink-0">
        <img
          src={imageUrl}
          className="w-28 h-28 ml-2 mb-4 border-2 border-red-600 rounded-full object-cover transition-all duration-300 hover:scale-110 cursor-pointer"
          alt={`Foto de perfil de ${user.name}`}
          onClick={handleImageClick}
        />
      </div>

      {/* Modal para ver la imagen ampliada */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={closeModal}
        >
          <div className="relative">
            {/* Imagen ampliada */}
            <img
              src={imageUrl}
              className=" h-72 object-cover rounded-full border-4 border-white"
              alt={`Foto de perfil ampliada de ${user.name}`}
            />
            {/* Botón para cerrar */}
            <button
              className="absolute top-2 right-2 text-red-600 text-2xl font-bold hover:scale-125 transition-all"
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
  }).isRequired,
};

export default ProfileImage;
