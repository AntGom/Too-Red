import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/UseAuth";
import useCounters from "../../hooks/useCounters";
import PropTypes from "prop-types";

const UserCounters = ({ onClose }) => {
  const { auth } = useAuth();
  const { counters } = useCounters();

  return (
    <div className="flex flex-col justify-start gap-1 w-4/5">
      <h1 className="text-xl font-bold mx-2 ">Mi Red</h1>
      <section className=" flex flex-col rounded-lg border-2 border-red-600">
        {/* Contador de Siguiendo */}
        <article className="mx-2">
          <NavLink
            to={"siguiendo/" + auth._id}
            className="flex flex-row p-0.5 hover:bg-gray-200 transition-all duration-300 hover:scale-105 rounded-lg"
            onClick={onClose}
          >
            <div className="flex items-center gap-2">
              <p className="text-lg font-semibold text-red-600">
                {counters.following}
              </p>
              <p className="text-md font-medium text-gray-900">Siguiendo</p>
            </div>
          </NavLink>
        </article>

        {/* Contador de Seguidores */}
        <article className="mx-2">
          <NavLink
            to={"seguidores/" + auth._id}
            className="flex flex-row p-0.5 hover:bg-gray-200 transition-all duration-300 hover:scale-105 rounded-lg"
            onClick={onClose}
          >
            <div className="flex items-center gap-2">
              <p className="text-lg font-semibold text-red-600">
                {counters.followers}
              </p>
              <p className="text-md font-medium text-gray-900">Seguidores</p>
            </div>
          </NavLink>
        </article>

        {/* Contador de Publicaciones */}
        <article className="mx-2">
          <NavLink
            to={"publications/" + auth._id}
            className="flex flex-row p-0.5 hover:bg-gray-200 transition-all duration-300 hover:scale-105 rounded-lg"
            onClick={onClose}
          >
            <div className="flex items-center gap-2">
              <p className="text-lg font-semibold text-red-600">
                {counters.publications}
              </p>
              <p className="text-md font-medium text-gray-900">Publicaciones</p>
            </div>
          </NavLink>
        </article>
      </section>
    </div>
  );
};

UserCounters.propTypes = {
  onClose: PropTypes.func,
};

export default UserCounters;
