import jwt from "jsonwebtoken";
import User from "../../models/userModel.js";

const confirmRegistration = async (req, res) => {
  try {
    const { token } = req.params;

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar al usuario
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
    }

    // Verificar si ya está confirmado
    if (user.confirmed) {
      return res.status(400).json({ status: "error", message: "Cuenta ya confirmada" });
    }

    // Actualizar estado de confirmación
    user.confirmed = true;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Cuenta confirmada correctamente. Ahora puedes iniciar sesión.",
    });
  } catch (error) {
    console.error("Error al confirmar registro:", error);
    res.status(400).json({
      status: "error",
      message: "El enlace de confirmación no es válido o ha expirado.",
    });
  }
};

export default confirmRegistration;
