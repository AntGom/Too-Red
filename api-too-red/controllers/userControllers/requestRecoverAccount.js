import { generateRecoveryToken } from '../../services/jwt.js';
import { sendRecoveryEmail } from '../../services/emailService.js';
import User from '../../models/userModel.js';

const requestAccountRecovery = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email, isDeleted: true });

    if (!user) {
      return res.status(404).json({ message: 'No se encontró una cuenta con ese correo.' });
    }

    const token = generateRecoveryToken(user.email, user.isDeleted);
    await sendRecoveryEmail(user.email, token);

    res.status(200).json({ message: 'Correo de recuperación enviado.', 
        token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al procesar la solicitud.' });
  }
};

export default requestAccountRecovery;
