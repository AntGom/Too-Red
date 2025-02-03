import { useNavigate } from "react-router-dom";
import {
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/solid";
import {
  ArrowLeftStartOnRectangleIcon,
  FlagIcon,
  PencilSquareIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import avatar from "../../../assets/img/user.png";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../hooks/UseAuth";
import UserCounters from "../../user/UserCounters";
import NewPublicationForm from "../../publication/NewPublication/NewPublicationForm";

const NewSidebar = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  //Redirigir al chat
  const handleOpenChat = () => {
    navigate("/social/messages");
  };

  return (
    <aside className="bg-neutral-200 relative">
      <section className="flex flex-col h-full">
        <article className="flex flex-col gap-4 items-center">
          <NavLink to="/social/feed" className="p-4">
            <img
              src="/copialogo.webp"
              alt="Logo de la Red Social"
              className="h-20 rounded-full object-cover border-2 border-red-600 hover:scale-110 transition-all duration-300"
            />
          </NavLink>

          <NavLink
            to={"/social/profile/" + auth._id}
            className="rounded-lg w-4/5 hover:bg-gray-200 transition-all duration-300 hover:scale-110"
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

          <NavLink
            to="/social/people"
            className="w-4/5 p-2 flex items-center justify-start gap-2 -mb-2 hover:bg-gray-200 transition-all duration-300 hover:scale-110 rounded-xl"
          >
            <UsersIcon className="h-6 w-6" />
            <div className="font-bold text-xl">Gente</div>
          </NavLink>

          {auth.role !== "admin" ? (
            <UserCounters />
          ) : (
            <>
              <NavLink
                to="/social/admin/reported-publications"
                className="w-4/5 p-2 flex items-center justify-start hover:bg-gray-200 transition-all duration-300 hover:scale-110 rounded-xl gap-2"
              >
                <FlagIcon className="h-6 w-6 font-bold" />
                <p className="font-bold text-xl">Publicac.</p>
              </NavLink>
              <NavLink
                to="/social/admin/reported-users"
                className="w-4/5 p-2 flex items-center justify-start hover:bg-gray-200 transition-all duration-300 hover:scale-110 rounded-xl gap-2"
              >
                <FlagIcon className="h-6 w-6 font-bold" />
                <p className="font-bold text-xl">Usuarios</p>
              </NavLink>
            </>
          )}

          <NewPublicationForm />

          <NavLink
            to="/social/config"
            className="h-auto w-4/5 flex items-center justify-start gap-2 hover:bg-gray-200 p-2 -mt-2 -mb-2 transition-all duration-300 hover:scale-110 rounded-xl"
          >
            <PencilSquareIcon className="h-6 w-6" />
            <p className="font-bold text-xl">Editar</p>
          </NavLink>

          <div>
            <NavLink
              to="/social/logout"
              className="text-gray-900 font-bold border-2 border-red-600 rounded-lg p-2 flex transition-all duration-300 hover:scale-125"
            >
              <ArrowLeftStartOnRectangleIcon className="h-6 w-6 text-sm" />
              Salir
            </NavLink>
          </div>

          {/* Botón para redirigir al chat */}
          <button
            className="fixed bottom-6 right-3 bg-red-600 p-2 rounded-full text-white shadow-lg hover:bg-red-500 transition-all duration-300 z-10"
            onClick={handleOpenChat}
          >
            <ChatBubbleLeftEllipsisIcon className="h-6 w-6" />
          </button>
        </article>
      </section>
    </aside>
  );
};

export default NewSidebar;
