import { fileURLToPath } from 'url';
import { dirname } from 'path';
//password
import bcrypt from "bcrypt";
//jwt
import jwt from "jsonwebtoken";
//config
import config from '../config/config.js';
//faker
import {fakerES as faker } from "@faker-js/faker";
//Logger
import logger from './logger-env.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//hash password
export const createHash=(password)=>bcrypt.hashSync(password, bcrypt.genSaltSync(10))

//validate password
export const isValidPassword = (user, password) => {
  logger.info(`Datos a validar: user-password: ${user.password}, password: ${password}`);
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

//Mocking
export const generateProducts = () => {
  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    code: faker.helpers.rangeToNumber({ min: 100, max: 199 }),
    price: faker.commerce.price({ min: 2000, max: 8000 }),
    status: true,
    stock: faker.commerce.price({ min: 0, max: 50 }),
    category: { id: faker.database.mongodbObjectId(), name: faker.commerce.department(), description: faker.commerce.productDescription()}, 
    colors: [faker.vehicle.color()],
    sizes: ["S", "M", "L"],
    thumbnails:faker.image.urlLoremFlickr({ category: 'fashion' }),
  };
};

export default __dirname;

