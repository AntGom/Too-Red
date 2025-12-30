/**
 * Plugin de Mongoose para soft delete
 * Automáticamente filtra documentos eliminados en:
 * - find()
 * - findOne()
 * - findById()
 * - aggregate()
 *
 * Uso:
 * schema.plugin(softDeletePlugin);
 */

const softDeletePlugin = (schema) => {
  // Middleware pre para find
  schema.pre("find", function (next) {
    // Solo añadir isDeleted si no está explícitamente incluido
    if (!this.getOptions().includeDeleted) {
      this.where({ isDeleted: false });
    }
    next();
  });

  // Middleware pre para findOne
  schema.pre("findOne", function (next) {
    if (!this.getOptions().includeDeleted) {
      this.where({ isDeleted: false });
    }
    next();
  });

  // Middleware pre para findOneAndUpdate
  schema.pre("findOneAndUpdate", function (next) {
    if (!this.getOptions().includeDeleted) {
      this.where({ isDeleted: false });
    }
    next();
  });

  // Middleware pre para updateMany
  schema.pre("updateMany", function (next) {
    if (!this.getOptions().includeDeleted) {
      this.where({ isDeleted: false });
    }
    next();
  });

  // Middleware pre para aggregate
  schema.pre("aggregate", function (next) {
    // Añadir un stage de $match al inicio para filtrar documentos eliminados
    if (!this.options.includeDeleted) {
      this.pipeline().unshift({
        $match: { isDeleted: false },
      });
    }
    next();
  });

  // Método helper para incluir documentos eliminados
  schema.query.includeDeleted = function () {
    return this.setOptions({ includeDeleted: true });
  };

  // Método para soft delete
  schema.methods.softDelete = function () {
    this.isDeleted = true;
    this.deletedAt = new Date();
    return this.save();
  };

  // Método para restaurar
  schema.methods.restore = function () {
    this.isDeleted = false;
    this.deletedAt = null;
    return this.save();
  };
};

export default softDeletePlugin;
