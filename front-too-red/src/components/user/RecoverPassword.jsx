import { useState } from "react";
import { Global } from "../../helpers/Global";
import { useToast } from "../../hooks/useToast";

const RecoverPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleRecover = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const request = await fetch(Global.url + "user/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
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
          Recuperar Contraseña
        </h1>
      </header>

      <section className="border-2 border-gray-900 p-6 rounded-lg shadow-lg shadow-gray-600 w-11/12 md:w-4/5 lg:w-2/5">
        <form onSubmit={handleRecover} className="mt-6">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-900 font-semibold"
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Introduce tu email"
              className="border-2 border-red-600 rounded w-full py-2 px-3"
            />
          </div>
          <button
            type="submit"
            className="text-gray-900 border-2 font-bold border-red-600 rounded py-2 px-4 hover:scale-110 transition-all duration-300"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default RecoverPassword;
