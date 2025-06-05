import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { Global } from "../../helpers/Global";
import { useToast } from "../../hooks/useToast";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const request = await fetch(Global.url + "user/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, newPassword }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await request.json();

      if (data.status === "success") {
        showToast({
          message: data.message,
          type: "success",
        });

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        showToast({
          message: data.message,
          type: "error",
        });
      }
    } catch (error) {
      console.log(error);
      showToast({
        message: "Error al conectar con el servidor",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <header className="p-4 text-gray-900 text-center mt-2 w-full">
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          Establecer Nueva Contraseña
        </h1>
      </header>

      <div className="border-2 border-gray-900 p-6 rounded-lg shadow-lg shadow-gray-600 w-11/12 md:w-2/5 bg-white">
        <form onSubmit={handleReset}>
          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block text-gray-900 font-semibold"
            >
              Nueva Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Tu nueva contraseña"
                className="border-2 border-red-600 rounded w-full py-2 px-3"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-6 h-6 text-gray-700" />
                ) : (
                  <EyeIcon className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="text-gray-900 border-2 font-bold border-red-600 rounded py-2 px-2 hover:scale-110 transition-all duration-300"
            disabled={loading}
          >
            {loading ? "Actualizando..." : "Establecer"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
