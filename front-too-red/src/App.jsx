/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useContext } from "react";
import Routing from "./router/Routing";
import { ToastProvider, ToastContext } from "./context/ToastContext";
import ToastContainer from "./components/ui/ToastContainer";
import { Global } from "./helpers/Global";

function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}

function MainApp() {
  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    const wakeUpServer = async () => {
      showToast({ message: "Conectando con el servidor...", type: "info" });

      try {
        await fetch(Global.url + "status");
        showToast({ message: "Servidor Activo!", type: "success" });
      } catch (error) {
        showToast({
          message: "No se pudo conectar con el servidor",
          type: "error",
        });
        console.error("No se pudo hacer ping al backend:", error);
      }
    };

    wakeUpServer();
  }, []);

  return (
    <div className="layout">
      <Routing />
      <ToastContainer />
    </div>
  );
}

export default App;
