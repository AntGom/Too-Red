import UseForm from "../../../hooks/UseForm";
import { Global } from "../../../helpers/Global";
import { useState } from "react";
import { useAuth } from "../../../hooks/UseAuth";
import LoginForm from "./LoginForm";
import BanNotificationModal from "./BanNotificationModal";
import ToastManager from "../../user/Profile/ProfileActions/ToastManager";

const Login = () => {
  const { form, changed } = UseForm({});
  const [showPassword, setShowPassword] = useState(false);
  const { setAuth } = useAuth();
  const [showBanModal, setShowBanModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

  const loginUser = async (e) => {
    e.preventDefault();

    const userToLogin = form;

    const request = await fetch(Global.url + "user/login", {
      method: "POST",
      body: JSON.stringify(userToLogin),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await request.json();

    if (data.status === "success") {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setAuth(data.user);

      // Mostrar Toast de éxito
      setToast({ message: "¡¡Usuario identificado correctamente!!", type: "success" });
      setShowToast(true);

      setTimeout(() => {
        window.location.href = "/social";
      }, 300);
    } else if (data.status === "banned") {
      setShowBanModal(true);

      // Mostrar Toast de advertencia
      setToast({ message: "Tu cuenta está suspendida. Contacta al soporte.", type: "error" });
      setShowToast(true);
    } else {
      // Mostrar Toast de error
      setToast({ message: "Email o contraseña incorrectos.", type: "error" });
      setShowToast(true);
    }
  };

  const handleConfirmBan = () => {
    setShowBanModal(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({});

    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
  };

  return (
    <>
      <header className="p-2 md:p-4 text-gray-900 text-center mt-2 w-full">
        <h1 className="text-2xl font-bold">Identifícate</h1>
      </header>
      <div className="flex justify-center w-full h-2/5">
        <LoginForm
          form={form}
          changed={changed}
          loginUser={loginUser}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />
      </div>
      <div className="text-center mt-4">
        <a
          href="/recover-password"
          className="text-blue-600 font-semibold hover:underline"
        >
          ¿Olvidaste la contraseña?
        </a>
      </div>
      <div className="text-center mt-2">
        <a
          href="/recover-request"
          className="text-blue-600 font-semibold hover:underline"
        >
          ¿Cuenta en suspensión? Recuperar ↻
        </a>
      </div>
      {showBanModal && <BanNotificationModal onConfirm={handleConfirmBan} />}
      <ToastManager
        showToast={showToast}
        toast={toast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};

export default Login;
