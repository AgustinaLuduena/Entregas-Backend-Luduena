import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from './config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//hash password
export const createHash=(password)=>bcrypt.hashSync(password, bcrypt.genSaltSync(10))

//validate password
export const isValidPassword = (user, password) => {
  console.log(`Datos a validar: user-password: ${user.password}, password: ${password}`);
  return bcrypt.compareSync(password, user.password);
};

//Random code for purchase ticket
export function generateRandomCode(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

//JWT
// Generar un token JWT
export const generateToken = (user) => {
  const JWT_SECRET = config.token;
  return jwt.sign({ user: user }, JWT_SECRET, { expiresIn: "1h" });
};


export default __dirname;

