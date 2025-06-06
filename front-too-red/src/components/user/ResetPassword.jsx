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
    <div className="flex flex-col justify-center items-center mt-4 mx-4 md:mx-0">
      <section className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm max-w-md w-full">
        <form onSubmit={handleReset}>
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Tu nueva contraseña
          </h1>
          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nueva Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Tu nueva contraseña"
                className="input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-medium py-2.5 px-4 rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm transition-all"
            disabled={loading}
          >
            {loading ? "Actualizando..." : "Establecer"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default ResetPassword;
