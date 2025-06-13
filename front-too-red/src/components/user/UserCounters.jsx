import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/UseAuth";
import useCounters from "../../hooks/useCounters";
import PropTypes from "prop-types";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

const UserCounters = ({ onClose }) => {
  const { auth } = useAuth();
  const { counters } = useCounters();

  return (
    <div className="flex flex-col gap-2 w-4/5 border-b border-gray-500">

      <div className="flex items-center border-b border-gray-500">
        <GlobeAltIcon className="h-6 w-6 md:h-6 md:w-6" />
        <p className="text-2xl md:text-xl font-bold ml-2 ">Mi Red</p>
      </div>

      <section className=" flex flex-col items-start gap-3 md:gap-2">

        {/* Contador de Siguiendo */}
          <NavLink
            to={"siguiendo/" + auth._id}
            className="flex flex-row  hover:bg-gray-200 transition-all duration-300 hover:scale-105 rounded-xl"
            onClick={onClose}
          >
            <div className="flex items-center gap-2 pb-1 w-full">
              <p className="text-xl md:text-lg font-semibold text-red-600">
                {counters.following}
              </p>
              <p className="text-xl md:text-lg font-medium text-gray-700">Siguiendo</p>
            </div>
          </NavLink>
        

        {/* Contador de Seguidores */}
          <NavLink
            to={"seguidores/" + auth._id}
            className="flex flex-row hover:bg-gray-200 transition-all duration-300 hover:scale-105 rounded-lg"
            onClick={onClose}
          >
            <div className="flex items-center gap-2 pb-1 w-full">
              <p className="text-xl md:text-lg font-semibold text-red-600">
                {counters.followers}
              </p>
              <p className="text-xl md:text-lg font-medium text-gray-700">Seguidores</p>
            </div>
          </NavLink>

        {/* Contador de Publicaciones */}
          <NavLink
            to={"publications/" + auth._id}
            className="flex flex-row hover:bg-gray-200 transition-all duration-300 hover:scale-105 rounded-lg"
            onClick={onClose}
          >
            <div className="flex items-center gap-2  pb-1  w-full">
              <p className="text-xl md:text-lg font-semibold text-red-600">
                {counters.publications}
              </p>
              <p className="text-xl md:text-lg font-medium text-gray-700">Publicaciones</p>
            </div>
          </NavLink>
          <span></span>
      </section>
    </div>
  );
};

UserCounters.propTypes = {
  onClose: PropTypes.func,
};

export default UserCounters;
