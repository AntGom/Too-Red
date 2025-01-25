import dotenv from 'dotenv';
dotenv.config();

const {
    PORT,
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
    UPLOADS_DIR,
    CLIENT_URL,
    ADMIN_EMAIL,
    MONGO_URI,
} = process.env;

export {
    PORT,
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
    UPLOADS_DIR,
    CLIENT_URL,
    ADMIN_EMAIL,
    MONGO_URI,
};
