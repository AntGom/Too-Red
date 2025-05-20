import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { PencilIcon, TrashIcon, FlagIcon } from "@heroicons/react/24/solid";
import ReactTimeAgo from "react-time-ago";
import avatar from "../../../assets/img/user.png";
import { useAuth } from "../../../hooks/UseAuth";

//Usamos URL de BBDD
const getUserImage = (image) => {
  //Si image no contiene URL completa, entonces por defecto
  return image && image !== "default.png" ? image : avatar;
};

const PublicationHeader = ({ publication, onEdit, onDelete, onReport }) => {
  const { auth } = useAuth();

  //Usuario propietario o admin
  const isUserOwnerOrAdmin =
    auth?._id === publication.user?._id || auth?.role === "admin";

  return (
    <section className="flex items-center justify-between">
      <article className="flex text-sm text-gray-800">
        <NavLink to={`/social/profile/${publication.user?._id}`}>
          <img
            src={getUserImage(publication.user?.image)}
            alt="Foto de Perfil"
            className="w-11 h-11 rounded-full object-cover transition-all border border-red-600 duration-300 hover:scale-110"
          />
        </NavLink>
        <div className="ml-4">
          <p className="font-bold">{`${publication.user?.name} ${publication.user?.surname}`}</p>
          <p className="text-gray-600">
            <ReactTimeAgo
              date={new Date(publication.createdAt).getTime()}
              locale="es-ES"
            />
          </p>
        </div>
      </article>
      <article className="flex items-center space-x-4">
        {!isUserOwnerOrAdmin && (
          <button
            onClick={() => onReport(publication._id)}
            className="text-gray-600 hover:text-red-700 transition-all duration-300"
          >
            <FlagIcon className="h-6 w-6" />
          </button>
        )}
        {isUserOwnerOrAdmin && (
          <>
            <button
              onClick={() => onEdit(publication._id)}
              className="text-blue-600 hover:text-blue-800 hover:scale-125 transition-all duration-300"
            >
              <PencilIcon className="h-6 w-6" />
            </button>
            <button
              onClick={() => onDelete(publication._id)}
              className="text-red-600 hover:text-red-800 hover:scale-125 transition-all duration-300"
            >
              <TrashIcon className="h-6 w-6" />
            </button>
          </>
        )}
      </article>
    </section>
  );
};

PublicationHeader.propTypes = {
  publication: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onReport: PropTypes.func.isRequired,
};

export default PublicationHeader;
