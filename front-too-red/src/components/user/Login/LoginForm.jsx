import PropTypes from "prop-types";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

const LoginForm = ({
  changed,
  loginUser,
  showPassword,
  setShowPassword,
  loading,
}) => {
  return (
    <form
      className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm max-w-md w-full"
      onSubmit={loginUser}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Iniciar sesión
      </h2>

      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          onChange={changed}
          className="input"
          placeholder="tu@email.com"
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Contraseña
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            className="input pr-10"
            onChange={changed}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-medium py-2.5 px-4 rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm transition-all flex justify-center items-center gap-2 ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? (
          <>
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>Entrando...</span>
          </>
        ) : (
          "Entrar"
        )}
      </button>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          ¿No tienes una cuenta?{" "}
          <a
            href="/register"
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Regístrate
          </a>
        </p>
      </div>
    </form>
  );
};

LoginForm.propTypes = {
  form: PropTypes.object.isRequired,
  changed: PropTypes.func.isRequired,
  loginUser: PropTypes.func.isRequired,
  showPassword: PropTypes.bool.isRequired,
  setShowPassword: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired, 
};

export default LoginForm;
