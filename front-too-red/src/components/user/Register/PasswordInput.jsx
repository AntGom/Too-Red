import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import PropTypes from "prop-types";

const PasswordInput = ({ value, onChange, error }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
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
          onChange={onChange}
          value={value}
          className="border-2 border-red-600 rounded w-full py-2 px-3"
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
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

PasswordInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default PasswordInput;
