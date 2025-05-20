import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Select from "react-select";

const interestOptions = [
  { value: "Deportes", label: "Deportes" },
  { value: "Tecnología", label: "Tecnología" },
  { value: "Arte", label: "Arte" },
  { value: "Música", label: "Música" },
  { value: "Cocina", label: "Cocina" },
  { value: "Literatura", label: "Literatura" },
  { value: "Política", label: "Política" },
  { value: "Viajes", label: "Viajes" },
  { value: "Humor", label: "Humor" },
  { value: "Historia", label: "Historia" },
  { value: "Naturaleza", label: "Naturaleza" },
];

const customStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#f9fafb",
    border: state.isFocused ? "1px solid #ef4444" : "1px solid #d1d5db",
    boxShadow: state.isFocused ? "0 0 0 1px #ef4444" : null, 
    borderRadius: "0.5rem",
    "&:hover": {
      borderColor: "#ef4444",
    },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#f3f4f6" : "white",
    color: "#111827",
    "&:hover": {
      backgroundColor: "#f3f4f6",
    },
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#ef4444",
    color: "white",
    borderRadius: "4px",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "white",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "white",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#b91c1c",
      color: "white",
    },
  }),
};

const InterestsSelect = ({ selectedInterests = [], onChange }) => {
  const [selectedInterestsState, setSelectedInterests] = useState([]);

  useEffect(() => {
    if (JSON.stringify(selectedInterests) !== JSON.stringify(selectedInterestsState)) {
      setSelectedInterests(selectedInterests);
    }
  }, [selectedInterests, selectedInterestsState]);

  const handleInterestsChange = (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setSelectedInterests(selectedValues);
    onChange(selectedValues);
  };

  return (
    <div>
      <label htmlFor="interests" className="block rounded-lg text-sm font-medium text-gray-900">
        Intereses
      </label>
      <Select
        id="interests"
        isMulti
        options={interestOptions}
        styles={customStyles} 
        value={interestOptions.filter(option => 
          selectedInterestsState.includes(option.value)
        )}
        onChange={handleInterestsChange}
        placeholder="Selecciona tus intereses"
      />
    </div>
  );
};

InterestsSelect.propTypes = {
  selectedInterests: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
};

export default InterestsSelect;
