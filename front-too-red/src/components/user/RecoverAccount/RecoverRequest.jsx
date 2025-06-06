import { useState } from "react";
import { Global } from "../../../helpers/Global";
import { useToast } from "../../../hooks/useToast";

const RecoverRequest = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(Global.url + "user/request-recovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
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
    } catch (err) {
      showToast({
        message: `Error: ${err.message || "No se pudo conectar al servidor."}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-4 mx-4 md:mx-0">
      <section className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm max-w-md w-full">
        <form onSubmit={handleSubmit}>
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Recuperar Cuenta
          </h1>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Introduce tu email"
              className="input"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-medium py-2.5 px-4 rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm transition-all"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default RecoverRequest;
