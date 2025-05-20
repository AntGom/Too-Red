import { useState } from "react";
import { Global } from "../../../helpers/Global";
import UseForm from "../../../hooks/UseForm";
import { useNavigate } from "react-router-dom";
import FormInput from "./FormInput";
import PasswordInput from "./PasswordInput";
import validateForm from "../../../helpers/validateForm.js";
import InterestsSelect from "./InterestsSelect.jsx";
import { useToast } from "../../../hooks/useToast";

const Register = () => {
  const { form, changed, setForm } = UseForm({
    name: "",
    surname: "",
    nick: "",
    email: "",
    password: "",
    interests: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const saveUser = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      const request = await fetch(Global.url + "user/register", {
        method: "POST",
        body: JSON.stringify(form),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await request.json();

      if (data.status === "success") {
        showToast({
          message: "¡Usuario registrado correctamente! Confirma tu cuenta desde el correo que has recibido.",
          type: "success"
        });
        
        setForm({
          name: "",
          surname: "",
          nick: "",
          email: "",
          password: "",
          interests: [],
        });
        
        setTimeout(() => navigate("/login"), 2000);
      } else {
        showToast({
          message: data.message || "Error al registrar el usuario",
          type: "error"
        });
        setErrors({ general: data.message });
      }
    } catch (error) {
      console.log(error)
      showToast({
        message: "Error al conectar con el servidor",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <header className="p-4 text-gray-900 text-center mt-2 w-full">
        <h1 className="text-2xl font-bold">Forma parte de Too-Red</h1>
      </header>

      <div className="flex flex-col gap-2 justify-center items-center h-2/5">
        <form
          className="bg-white border-2 border-gray-900 p-6 rounded-xl shadow-lg shadow-gray-600 lg:w-2/5 sm:w-4/5"
          onSubmit={saveUser}
        >
          <FormInput
            label="Nombre"
            name="name"
            value={form.name || ""}
            onChange={changed}
            error={errors.name}
          />
          <FormInput
            label="Apellidos"
            name="surname"
            value={form.surname || ""}
            onChange={changed}
            error={errors.surname}
          />
          <FormInput
            label="Alias"
            name="nick"
            value={form.nick || ""}
            onChange={changed}
            error={errors.nick}
          />
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={form.email || ""}
            onChange={changed}
            error={errors.email}
          />
          <PasswordInput
            value={form.password || ""}
            onChange={changed}
            error={errors.password}
          />
          <InterestsSelect
            selectedInterests={form.interests}
            onChange={(values) => setForm({ ...form, interests: values })}
          />

          <input
            type="submit"
            value={loading ? "Registrando..." : "Regístrate"}
            disabled={loading}
            className={`text-gray-900 border-2 font-bold border-red-600 rounded py-2 px-4 hover:scale-110 transition-all duration-300 cursor-pointer mt-4 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          />
        </form>
      </div>
    </div>
  );
};

export default Register;