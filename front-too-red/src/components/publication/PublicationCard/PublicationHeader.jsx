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
    <section className="flex items-center justify-between mb-4">
      <article className="flex items-center text-sm text-gray-800">
        <NavLink 
          to={`/social/profile/${publication.user?._id}`}
          className="relative group"
        >
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-red-600 group-hover:border-red-500 transition-all">
            <img
              src={getUserImage(publication.user?.image)}
              alt="Foto de Perfil"
              className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
            />
          </div>
        </NavLink>
        <div className="ml-3">
          <div className="flex items-center">
            <p className="font-semibold text-gray-900">{`${publication.user?.name} ${publication.user?.surname}`}</p>
            {isUserOwnerOrAdmin && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                {auth?._id === publication.user?._id ? "Yo" : "Admin"}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500">
            <ReactTimeAgo
              date={new Date(publication.createdAt).getTime()}
              locale="es-ES"
              className="text-gray-500"
            />
          </p>
        </div>
      </article>
      <article className="flex items-center space-x-2">
        {!isUserOwnerOrAdmin && (
          <button
            onClick={() => onReport(publication._id)}
            className="text-gray-500 hover:text-red-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            title="Reportar publicación"
          >
            <FlagIcon className="h-5 w-5" />
          </button>
        )}
        {isUserOwnerOrAdmin && (
          <>
            <button
              onClick={() => onEdit(publication._id)}
              className="text-gray-500 hover:text-blue-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              title="Editar publicación"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(publication._id)}
              className="text-gray-500 hover:text-red-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              title="Eliminar publicación"
            >
              <TrashIcon className="h-5 w-5" />
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