import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/UseAuth";
import useCounters from "../../hooks/useCounters";
import PropTypes from "prop-types";


const UserCounters = ({ onClose }) => {
  const { auth } = useAuth();
  const { counters } = useCounters();

  return (
    <>
      <h1 className="text-xl font-bold -mb-3 w-full ml-16">Mi Red</h1>
      <section className="w-4/5 max-w-4/5 flex flex-col p-2 md:p-0 lg:p-2 rounded-lg border-2 border-red-600">
        {/* Contador de Siguiendo */}
        <article>
          <NavLink
            to={"siguiendo/" + auth._id}
            className="flex flex-row md:flex-col lg:flex-row justify-between items-center p-0.5 hover:bg-gray-200 transition-all duration-300 hover:scale-105 rounded-lg"
            onClick={onClose} // Cerrar el menú al hacer clic
          >
            <div className="text-md font-medium text-gray-900">Siguiendo</div>
            <div className="text-lg font-semibold text-red-600">
              {counters.following}
            </div>
          </NavLink>
        </article>

        {/* Contador de Seguidores */}
        <article>
          <NavLink
            to={"seguidores/" + auth._id}
            className="flex flex-row md:flex-col lg:flex-row justify-between items-center p-0.5 hover:bg-gray-200 transition-all duration-300 hover:scale-105 rounded-lg"
            onClick={onClose} // Cerrar el menú al hacer clic
          >
            <div className="text-md font-medium text-gray-900">Seguidores</div>
            <div className="text-lg font-semibold text-red-600">
              {counters.followers}
            </div>
          </NavLink>
        </article>

        {/* Contador de Publicaciones */}
        <article>
          <NavLink
            to={"publications/" + auth._id}
            className="flex flex-row md:flex-col lg:flex-row justify-between items-center p-0.5 hover:bg-gray-200 transition-all duration-300 hover:scale-105 rounded-lg"
            onClick={onClose} // Cerrar el menú al hacer clic
          >
            <div className="text-md font-medium text-gray-900">Publicaciones</div>
            <div className="text-lg font-semibold text-red-600">
              {counters.publications}
            </div>
          </NavLink>
        </article>
      </section>
    </>
  );
};

// Validación de props con PropTypes (opcional)
UserCounters.propTypes = {
  onClose: PropTypes.func, // onClose debe ser una función
};

export default UserCounters;