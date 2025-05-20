import PropTypes from "prop-types";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

const LoginForm = ({ changed, loginUser, showPassword, setShowPassword }) => {
  return (
    <form
      className="bg-white border-2 border-gray-900 p-4 rounded-lg shadow-lg shadow-gray-600 w-11/12 md:w-4/5 lg:w-3/5"
      onSubmit={loginUser}
    >
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-900 font-semibold">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          onChange={changed}
          className="border-2 border-red-600 rounded w-full py-2 px-3"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-900"
        >
          Contraseña
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            className="border-2 border-red-600 rounded w-full py-2 px-3"
            onChange={changed}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            {showPassword ? (
              <EyeSlashIcon className="w-6 h-6 text-gray-700" />
            ) : (
              <EyeIcon className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      <input
        type="submit"
        value="Entrar"
        className="text-gray-900 border-2 font-bold border-red-600 rounded py-2 px-4 hover:scale-110 transition-all duration-300 cursor-pointer"
      />
    </form>
  );
};

LoginForm.propTypes = {
  form: PropTypes.object.isRequired,
  changed: PropTypes.func.isRequired,
  loginUser: PropTypes.func.isRequired,
  showPassword: PropTypes.bool.isRequired,
  setShowPassword: PropTypes.func.isRequired,
};

export default LoginForm;
