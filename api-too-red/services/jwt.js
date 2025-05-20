import moment from "moment";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const generateToken = (user) => {
   const payload = {
    id: user._id,
    name: user.name,
    surname: user.surname,
    nick: user.nick,
    email: user.email,
    role: user.role,
    image: user.image,
    created_at: moment().unix(), 
    iat: moment().unix(),
    exp: moment().add(30, "days").unix(),
    isBanned: user.isBanned || false

   }

   return jwt.sign(payload, process.env.JWT_SECRET);
};

const secretKey = process.env.JWT_SECRET;

const generateRecoveryToken = (email, isDeleted) => {
  const token = jwt.sign({ email, isDeleted }, secretKey, {
    expiresIn: '1h',
    jwtid: uuidv4(),
  });
  return token;
};

export { generateToken, generateRecoveryToken };
