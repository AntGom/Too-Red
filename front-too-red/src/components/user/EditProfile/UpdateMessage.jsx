import PropTypes from "prop-types";
import { useEffect } from "react";
import { XCircleIcon } from "@heroicons/react/24/outline";

const UpdateMessage = ({ saved, setSaved }) => {
  useEffect(() => {
    console.log("Estado de saved:", saved); // Depuración
  }, [saved]);

  return (
    saved !== "not_saved" && (
      <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-black z-50">
        <div
          className={`relative p-4 rounded-lg shadow-md text-center text-white ${
            saved === "saved" ? "bg-green-600" : "bg-red-600"
          }`}
          aria-live="polite"
        >
          <div className="flex">
            <p className="p-2">
              {saved === "saved"
                ? "¡¡Usuario actualizado correctamente!!"
                : "Error al actualizar los datos de usuario"}
            </p>
            <button
              onClick={() => setSaved("not_saved")}
              className="text-white font-bold text-xl"
              aria-label="Cerrar mensaje"
            >
              <XCircleIcon className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    )
  );
};

UpdateMessage.propTypes = {
  saved: PropTypes.string.isRequired,
  setSaved: PropTypes.func.isRequired,
};

export default UpdateMessage;
