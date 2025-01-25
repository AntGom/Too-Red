import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Global } from "../../../helpers/Global";

const ConfirmAccount = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");//loading, success, error
  const navigate = useNavigate();

  useEffect(() => {
    const confirmAccount = async () => {
      try {
        const response = await fetch(`${Global.url}user/confirm/${token}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.status === "success") {
          setStatus("success");
          setTimeout(() => navigate("/login"), 2000); 
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.log(error)
        setStatus("error");
      }
    };

    confirmAccount();
  }, [token, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {status === "loading" && <p className="text-lg">Validando tu cuenta...</p>}
      {status === "success" && (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-500">
            ¡Cuenta confirmada con éxito!
          </h1>
          <p className="mt-2">Serás redirigido al inicio de sesión en breve.</p>
        </div>
      )}
      {status === "error" && (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">
            Error al confirmar tu cuenta.
          </h1>
          <p className="mt-2">El enlace es inválido o ha expirado.</p>
          <button
            onClick={() => navigate("/register")}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Volver al registro
          </button>
        </div>
      )}
    </div>
  );
};

export default ConfirmAccount;
