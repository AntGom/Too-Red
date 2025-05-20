const SerializeForm = (form, additionalData = {}) => {
  const formData = new FormData(form);
  const completeObj = {};

  for (let [name, value] of formData) {
    completeObj[name] = value;
  }

  return { ...completeObj, ...additionalData };
};

export default SerializeForm;
