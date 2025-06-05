import PropTypes from "prop-types";

const FormInput = ({ label, name, type = "text", value, onChange, error }) => {
  return (
    <div className="mb-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        onChange={onChange}
        value={value}
        className="input"
      />
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

FormInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default FormInput;
