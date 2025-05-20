import mongoose from "mongoose";

const filterDeleted = (req, res, next) => {
  // Guardar referencias a las funciones originales
  const originalFind = mongoose.Model.find;
  const originalFindOne = mongoose.Model.findOne;
  const originalFindById = mongoose.Model.findById;
  const originalAggregate = mongoose.Model.aggregate;


  //Sobrescribir find()
  mongoose.Model.find = function (...args) {
    const query = args[0] || {};
    if (!query.hasOwnProperty("isDeleted")) {
      query.isDeleted = false;
    }
    return originalFind.apply(this, [query, ...args.slice(1)]);
  };

  //Sobrescribir findOne()
  mongoose.Model.findOne = function (...args) {
    const query = args[0] || {};
    if (!query.hasOwnProperty("isDeleted")) {
      query.isDeleted = false;
    }
    return originalFindOne.apply(this, [query, ...args.slice(1)]);
  };

  //Sobrescribir findById()
  mongoose.Model.findById = function (...args) {
    const id = args[0];
    return originalFindOne.apply(this, [{ _id: id, isDeleted: false }, ...args.slice(1)]);
  };

  //Sobreescribir aggregate
  mongoose.Model.aggregate = function (...args) {
    const pipeline = args[0] || [];
    const matchStage = { $match: { isDeleted: false } };
  
    if (pipeline.length > 0 && pipeline[0].$match) {
      pipeline[0].$match.isDeleted = false;
    } else {
      pipeline.unshift(matchStage);
    }
  
    return originalAggregate.apply(this, args);
  };

  next();
};

export default filterDeleted;
