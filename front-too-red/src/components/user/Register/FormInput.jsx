import PropTypes from 'prop-types';

const FormInput = ({ label, name, type = "text", value, onChange, error }) => {
  return (
    <div className="mb-2">
      <label htmlFor={name} className="block text-gray-900 font-semibold">
        {label}
      </label>
      <input
        type={type}
        name={name}
        onChange={onChange}
        value={value}
        className="border-2 border-red-600 rounded w-full py-2 px-3"
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
