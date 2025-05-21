import { useNavigate } from "react-router-dom";
import {
  ArrowLeftStartOnRectangleIcon,
  FlagIcon,
  PencilSquareIcon,
  UsersIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/solid";
import avatar from "../../../assets/img/user.png";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../hooks/UseAuth";
import UserCounters from "../../user/UserCounters";
import NewPublicationForm from "../../publication/NewPublication/NewPublicationForm";
import PropTypes from "prop-types";

const NewSidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  // Redirigir al chat y cerrar menú
  const handleOpenChat = () => {
    navigate("/social/messages");
    onClose?.();
  };

  return (
    <aside className="bg-gray-50 relative">
      <section className="flex flex-col h-screen">
        <article className="flex flex-col gap-3 items-center ">
          {/* Enlace al feed */}
          <NavLink
            to="/social/feed"
            className="py-4 px-1 w-5/6"
            onClick={onClose}
          >
            <img
              src="/nuevoLogoLargo.webp"
              alt="Logo de Too Red"
              className="h-12 rounded-xl w-full object-contain border-2 border-red-600 hover:scale-110 transition-all duration-300"
            />
          </NavLink>

          {/* Enlace al perfil */}
          <NavLink
            to={"/social/profile/" + auth._id}
            className="rounded-lg w-4/5 hover:bg-gray-200 transition-all duration-300 hover:scale-110"
            onClick={onClose} // Cerrar con clic
          >
            <div className="flex justify-start gap-2 items-center">
              {auth.image !== "default.png" ? (
                <img
                  src={auth.image}
                  alt="Foto de Perfil"
                  className="rounded-full w-12 h-12 border border-red-600 object-cover"
                />
              ) : (
                <img
                  src={avatar}
                  alt="Foto de Perfil"
                  className="rounded-lg w-10 h-10 border-2 border-gray-500"
                />
              )}
              <div className="flex flex-col items-center">
                <h1 className="text-xl font-bold text-gray-900">{auth.name}</h1>
                <p className="text-md text-gray-800">@{auth.nick}</p>
              </div>
            </div>
          </NavLink>

          {/* Enlace a gente */}
          <NavLink
            to="/social/people"
            className="w-4/5 p-2 flex items-center justify-start gap-2 -mb-2 hover:bg-gray-200 transition-all duration-300 hover:scale-110 rounded-xl"
            onClick={onClose} 
          >
            <UsersIcon className="h-6 w-6" />
            <div className="font-bold text-xl">Gente</div>
          </NavLink>

          {/* Contenido adicional según el rol */}
          {auth.role !== "admin" ? (
            <UserCounters onClose={onClose} />
          ) : (
            <>
              <NavLink
                to="/social/admin/reported-publications"
                className="w-4/5 p-2 flex items-center justify-start hover:bg-gray-200 transition-all duration-300 hover:scale-110 rounded-xl gap-2"
                onClick={onClose} 
              >
                <FlagIcon className="h-6 w-6 font-bold" />
                <p className="font-bold text-xl">Publicac.</p>
              </NavLink>
              <NavLink
                to="/social/admin/reported-users"
                className="w-4/5 p-2 flex items-center justify-start hover:bg-gray-200 transition-all duration-300 hover:scale-110 rounded-xl gap-2"
                onClick={onClose} 
              >
                <FlagIcon className="h-6 w-6 font-bold" />
                <p className="font-bold text-xl">Usuarios</p>
              </NavLink>
            </>
          )}

          {/* Formulario de nueva publicación */}
          <NewPublicationForm />

          {/* Enlace a configuración */}
          <NavLink
            to="/social/config"
            className="h-auto w-4/5 flex items-center justify-start gap-2 hover:bg-gray-200 p-2 -mt-2 -mb-2 transition-all duration-300 hover:scale-110 rounded-xl"
            onClick={onClose}
          >
            <PencilSquareIcon className="h-6 w-6" />
            <p className="font-bold text-xl">Editar</p>
          </NavLink>

          {/* Enlace al chat */}
          <NavLink
            to="/social/messages"
            className="h-auto w-4/5 flex items-center justify-start gap-2 hover:bg-gray-200 p-2 -mt-2 -mb-2 transition-all duration-300 hover:scale-110 rounded-xl"
            onClick={handleOpenChat}
          >
            <ChatBubbleLeftEllipsisIcon className="h-6 w-6" />
            <p className="font-bold text-xl">Chat</p>
          </NavLink>

          {/* Botón de logout */}
          <div>
            <NavLink
              to="/social/logout"
              className="text-gray-900 font-bold border-2 border-red-600 rounded-lg p-1 flex transition-all duration-300 hover:scale-125 mt-1"
              onClick={onClose} 
            >
              <ArrowLeftStartOnRectangleIcon className="h-6 w-6 text-sm" />
              Salir
            </NavLink>
          </div>
        </article>
      </section>
    </aside>
  );
};

NewSidebar.propTypes = {
  onClose: PropTypes.func,
};

export default NewSidebar;
