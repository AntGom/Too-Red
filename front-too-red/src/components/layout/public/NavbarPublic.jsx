import { NavLink } from "react-router-dom";

const NavbarPublic = () => {
  return (
    <nav className=" p-2 flex justify-around border-2 border-red-600 shadow-md">
      <NavLink to="/social/feed" className="p-4 ">
        <img
          src="/copialogo.webp"
          alt="Logo de la Red Social"
          className=" h-20 rounded-xl border-2 border-red-600 hover:scale-110 transition-all duration-300"
        />
      </NavLink>

      <ul className="flex gap-4 items-center ">
        <li className=" hover:scale-110 transition-all duration-300">
          <NavLink to="/login"
            className="text-gray-900 font-bold border-2 border-red-600 rounded-lg p-2">
            <span>Entrar</span>
          </NavLink>
        </li>
        <li className=" hover:scale-110 transition-all duration-300">
          <NavLink to="/register"
            className="text-wgray-900  font-bold  border-2 border-red-600 rounded-lg p-2">
            <span>Registro</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavbarPublic;
