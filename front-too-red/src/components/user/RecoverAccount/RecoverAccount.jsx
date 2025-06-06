/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Global } from "../../../helpers/Global";
import { useToast } from "../../../hooks/useToast";

const RecoverAccount = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (token) {
      recoverAccount(token);
    } else {
      showToast({
        message: "Token inválido o no encontrado en la URL.",
        type: "error",
      });
    }
  }, [location]);

  const recoverAccount = async (token) => {
    try {
      const response = await fetch(Global.url + "user/recover-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast({
          message: data.message,
          type: "success",
        });
        setTimeout(() => navigate("/login"), 3000);
      } else {
        showToast({
          message: data.message,
          type: "error",
        });
      }
    } catch (err) {
      showToast({
        message: `Error: ${err.message || "No se pudo conectar al servidor."}`,
        type: "error",
      });
    }
  };

  return (
    <div className="flex flex-col h-full items-center justify-start mt-4 mx-4 md:mx-0">
      <section className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          ¡¡Cuenta recuperada!!
        </h1>
        <h2 className="text-xl font-bold text-gray-900 text-center">Nos alegra tenerte de vuelta 🎉</h2>
      </section>
    </div>
  );
};

export default RecoverAccount;
