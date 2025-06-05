import Routing from "./router/Routing";
import { ToastProvider } from "./context/ToastContext";
import ToastContainer from "./components/ui/ToastContainer";

function App() {
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
