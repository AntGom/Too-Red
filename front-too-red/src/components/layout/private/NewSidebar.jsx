import { useNavigate } from "react-router-dom";
import {
  ArrowLeftStartOnRectangleIcon,
  FlagIcon,
  PencilSquareIcon,
  UserGroupIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/outline";
import avatar from "../../../assets/img/user.png";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../hooks/UseAuth";
import UserCounters from "../../user/UserCounters";
import NewPublicationForm from "../../publication/NewPublication/NewPublicationForm";
import PrivateFooter from "./PrivateFooter";
import PropTypes from "prop-types";

const NewSidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  // Redirigir a chat + cerrar menú
  const handleOpenChat = () => {
    navigate("/social/messages");
    onClose?.();
  };

  return (
    <aside className="flex flex-col items-center bg-gray-50 relative pt-2 md:p-2 h-full overflow-y-auto">
      {/* Enlace al feed */}
      <NavLink 
      to="/social/feed" 
      className="md:px-1 mb-4" 
      onClick={onClose}>
        {/* Imagen solo para móvil */}
        <img
          src="/logoCorto.webp"
          alt="Logo móvil"
          className="h-12 rounded-xl hover:scale-110 transition-all duration-300 md:hidden"
        />
        {/* Imagen solo para desktop */}
        <img
          src="/nuevoLogoLargo.webp"
          alt="Logo desktop"
          className="h-14 rounded-xl hover:scale-110 transition-all duration-300 hidden md:block"
        />
      </NavLink>

      <section className="flex flex-col h-3/4 items-center justify-around mb-2 md:mb-6 md:gap-4">
        {/* Enlace al perfil */}
        <NavLink
          to={"/social/profile/" + auth._id}
          className="rounded-xl w-full hover:bg-gray-200 transition-all duration-300 hover:scale-105"
          onClick={onClose}
        >
          <div className="flex gap-1 items-center">
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
                className="rounded-lg w-12 h-12 border-2 border-gray-500"
              />
            )}
            <div className="flex flex-col items-start">
              <h1 className="text-xl font-bold text-gray-900">{auth.name}</h1>
              <p className="text-md text-gray-800">@{auth.nick}</p>
            </div>
          </div>
        </NavLink>

        {/* Editar perfil */}
        <NavLink
          to="/social/config"
          className="w-4/5 flex items-center -mt-4 md:-mt-0 justify-start hover:bg-gray-200 transition-all duration-300 hover:scale-110 rounded-xl"
          onClick={onClose}
        >
          <PencilSquareIcon className="h-7 w-7 md:h-6 md:w-6" />
          <p className="text-2xl md:text-xl font-bold ml-2">Editar</p>
        </NavLink>

        {/* Contenido adicional según el rol */}
        {auth.role !== "admin" ? (
          <UserCounters onClose={onClose} />
        ) : (
          <>
            <NavLink
              to="/social/admin/reported-publications"
              className="w-4/5 flex items-center justify-start hover:bg-gray-200 transition-all duration-300 hover:scale-110 rounded-xl"
              onClick={onClose}
            >
              <FlagIcon className="h-7 w-7 md:h-6 md:w-6 font-bold" />
              <p className="font-bold text-xl md:text-xl">Publicac.</p>
            </NavLink>
            <NavLink
              to="/social/admin/reported-users"
              className="w-4/5 flex items-center justify-start hover:bg-gray-200 transition-all duration-300 hover:scale-110 rounded-xl"
              onClick={onClose}
            >
              <FlagIcon className="h-7 w-7 md:h-6 md:w-6 font-bold" />
              <p className="font-bold text-xl md:text-xl">Usuarios</p>
            </NavLink>
          </>
        )}

        {/* Enlace a gente */}
        <NavLink
          to="/social/people"
          className="w-4/5 flex items-center justify-start hover:bg-gray-200 transition-all duration-300 hover:scale-110 rounded-xl"
          onClick={onClose}
        >
          <UserGroupIcon className="h-7 w-7 md:h-6 md:w-6" />
          <div className="font-bold text-2xl md:text-xl ml-2">Gente</div>
        </NavLink>

        {/* Formulario de nueva publicación */}
        <NewPublicationForm />

        {/* Enlace al chat */}
        <NavLink
          to="/social/messages"
          className="w-4/5 flex items-center justify-start hover:bg-gray-200 transition-all duration-300 hover:scale-110 rounded-xl"
          onClick={handleOpenChat}
        >
          <ChatBubbleLeftEllipsisIcon className="h-7 w-7 md:h-6 md:w-6" />
          <p className="font-bold text-2xl md:text-xl ml-2">Chat</p>
        </NavLink>
      </section>

      {/* Botón de logout + Footer */}
      <div className="flex flex-col w-full  items-center justify-center border-t border-gray-500">
        <NavLink
          to="/social/logout"
          className="font-bold border-2 mt-4 md:mt-4 border-red-600 rounded-lg p-1 w-fit flex items-center transition-all duration-300 hover:scale-125"
          onClick={onClose}
        >
          <ArrowLeftStartOnRectangleIcon className="h-6 w-6" />
          <p className="font-bold text-xl">Salir</p>
        </NavLink>
        <PrivateFooter />
      </div>
    </aside>
  );
};

NewSidebar.propTypes = {
  onClose: PropTypes.func,
};

export default NewSidebar;
