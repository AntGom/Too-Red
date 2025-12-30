import mongoose from "mongoose";

let isInitialized = false;
const originalMethods = {};

const filterDeleted = (req, res, next) => {
  // PARCHE TEMPORAL - Solo inicializar UNA SOLA VEZ
  // TODO: Migrar a plugin de schema en próximo sprint
  if (!isInitialized) {
    originalMethods.find = mongoose.Model.prototype.find;
    originalMethods.findOne = mongoose.Model.prototype.findOne;
    originalMethods.findById = mongoose.Model.prototype.findById;
    originalMethods.aggregate = mongoose.Model.prototype.aggregate;

    // Sobrescribir find()
    mongoose.Model.prototype.find = function (...args) {
      const query = args[0] || {};
      if (!query.hasOwnProperty("isDeleted")) {
        query.isDeleted = false;
      }
      return originalMethods.find.apply(this, [query, ...args.slice(1)]);
    };

    // Sobrescribir findOne()
    mongoose.Model.prototype.findOne = function (...args) {
      const query = args[0] || {};
      if (!query.hasOwnProperty("isDeleted")) {
        query.isDeleted = false;
      }
      return originalMethods.findOne.apply(this, [query, ...args.slice(1)]);
    };

    // Sobrescribir findById()
    mongoose.Model.prototype.findById = function (...args) {
      const id = args[0];
      return originalMethods.findOne.apply(this, [
        { _id: id, isDeleted: false },
        ...args.slice(1),
      ]);
    };

    // Sobrescribir aggregate()
    mongoose.Model.prototype.aggregate = function (...args) {
      const pipeline = args[0] || [];
      const matchStage = { $match: { isDeleted: false } };

      if (pipeline.length > 0 && pipeline[0].$match) {
        pipeline[0].$match.isDeleted = false;
      } else {
        pipeline.unshift(matchStage);
      }

      return originalMethods.aggregate.apply(this, args);
    };

    isInitialized = true;
  }

  next();
};

export default filterDeleted;
