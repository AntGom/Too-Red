import { NavLink } from "react-router-dom";

const NavbarPublic = () => {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm py-3 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/social/feed" className="flex items-center">
          <img
            src="/nuevoLogoLargo.webp"
            alt="Logo de Too-Red"
            className="h-12 w-full rounded-lg border-2 border-red-600 transition-all duration-300 hover:scale-105"
          />
        </NavLink>

        {/* Navegación */}
        <div className="flex gap-3">
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-medium transition-all ${
                isActive
                  ? "bg-red-600 text-white"
                  : "text-gray-700 border border-gray-300 hover:bg-gray-100"
              }`
            }
          >
            Entrar
          </NavLink>
          
          <NavLink
            to="/register"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-medium transition-all ${
                isActive
                  ? "bg-red-600 text-white"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              }`
            }
          >
            Registro
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default NavbarPublic;