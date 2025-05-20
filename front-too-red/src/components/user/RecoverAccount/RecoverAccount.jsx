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
        type: "error"
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
          type: "success"
        });
        setTimeout(() => navigate("/login"), 3000);
      } else {
        showToast({
          message: data.message,
          type: "error"
        });
      }
    } catch (err) {
      showToast({
        message: `Error: ${err.message || "No se pudo conectar al servidor."}`,
        type: "error"
      });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <header className="p-4 w-3/5 border-2 border-red-600 rounded-lg text-gray-900 text-center mt-14">
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          ¡¡Se ha recuperado la Cuenta!! 
        </h1>
      </header>
    </div>
  );
};

export default RecoverAccount;