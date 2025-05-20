import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, 
  port: process.env.SMTP_PORT, 
  secure: false, 
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_APIKEY, 
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"Too-Red" <${process.env.SMTP_USER}>`, 
      to, 
      subject, 
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Correo enviado exitosamente a ${to}`);
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw new Error("No se pudo enviar el correo.");
  }
};

export const sendRecoveryEmail = async (email, token) => {
  const recoveryUrl = `${process.env.CLIENT_URL}/recover-account?token=${token}`;

  const mailOptions = {
    from: `"Too-Red" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Recuperación de cuenta - Too-Red",
    html: `
      <h1>Recuperación de Cuenta Too-Red</h1>
      <p>Has solicitado recuperar tu cuenta. Haz clic en el siguiente enlace para reactivarla:</p>
      <a href="${recoveryUrl}" target="_blank">Recuperar Cuenta</a>
      <p>Este enlace expirará en una hora.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
