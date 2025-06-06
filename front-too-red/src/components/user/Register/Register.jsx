import { useState } from "react";
import { Global } from "../../../helpers/Global";
import UseForm from "../../../hooks/UseForm";
import { useNavigate, Link } from "react-router-dom";
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
          message:
            "¡Usuario registrado correctamente! Confirma tu cuenta desde el correo que has recibido.",
          type: "success",
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
          type: "error",
        });
        setErrors({ general: data.message });
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
    <div className="flex justify-center items-start mt-4 px-4">
      <form
        onSubmit={saveUser}
        className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Únete a Too-Red
        </h2>

        <FormInput
          label="Nombre"
          name="name"
          value={form.name}
          onChange={changed}
          error={errors.name}
        />
        <FormInput
          label="Apellidos"
          name="surname"
          value={form.surname}
          onChange={changed}
          error={errors.surname}
        />
        <FormInput
          label="Alias"
          name="nick"
          value={form.nick}
          onChange={changed}
          error={errors.nick}
        />
        <FormInput
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={changed}
          error={errors.email}
        />
        <PasswordInput
          value={form.password}
          onChange={changed}
          error={errors.password}
        />

        <div className="mb-4">
          <InterestsSelect
            selectedInterests={form.interests}
            onChange={(values) => setForm({ ...form, interests: values })}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-medium py-2.5 px-4 rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Registrando..." : "Regístrate"}
        </button>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
