import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { NavLink } from "react-router-dom";

const EditProfileButton = () => {
  return (
    <NavLink to="/social/config">
      <button className="hover:scale-125 duration-300 transition-all">
        <PencilSquareIcon className="w-8 h-8 mr-2 text-blue-700" />
      </button>
    </NavLink>
  );
};

export default EditProfileButton;
