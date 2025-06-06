import dotenv from "dotenv";
dotenv.config();

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_APIKEY,
  JWT_SECRET,
  JWT_EXP,
  CLIENT_URL,
  ADMIN_EMAIL,
  MONGO_URI,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

export {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_APIKEY,
  JWT_SECRET,
  JWT_EXP,
  CLIENT_URL,
  ADMIN_EMAIL,
  MONGO_URI,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
};
