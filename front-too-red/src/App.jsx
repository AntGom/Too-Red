import { useEffect } from "react";
import Routing from "./router/Routing";
import { ToastProvider } from "./context/ToastContext";
import ToastContainer from "./components/ui/ToastContainer";
import { Global } from "./helpers/Global";

const wakeUpServer = async () => {
  try {
    await fetch(Global.url + "status");
  } catch (error) {
    console.error("No se pudo hacer ping al backend:", error);
  }
};

function App() {
  useEffect(() => {
    wakeUpServer();
  }, []);

  return (
    <ToastProvider>
      <div className="layout">
        <Routing />
        <ToastContainer />
      </div>
    </ToastProvider>
  );
}

export default App;
