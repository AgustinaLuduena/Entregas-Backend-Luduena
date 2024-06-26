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
// Generar un token JWT para el usuario
export const generateToken = (user) => {
  const JWT_SECRET = config.token;
  return jwt.sign({ user: user }, JWT_SECRET, { expiresIn: "1h" });
};

// Generar un token JWT para el mail de recuperación de contraseña
export const generateRestorePassToken = (email) => {
  const JWT_SECRET = config.token;
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: "2m" });
};

export const verifyRestorePassToken = (token) => {
  try {
      const JWT_SECRET = config.token;
      const decoded = jwt.verify(token, JWT_SECRET);
      return true;
  } catch (error) {
      throw new Error('Token inválido o expirado');
  }
};

export const verifyTokenExpiration = (req, res, next) => {
  const { token } = req.query; // o req.body.token dependiendo de cómo esté enviado

  if (!token) {
      return res.redirect('/forgottenPass'); // Redirige si no hay token
  }
  const JWT_SECRET = config.token;
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
          return res.redirect('/forgottenPass'); // Redirige si el token ha expirado o es inválido
      }

      //req.email = decoded.email; // Pasa el email decodificado si es necesario en la lógica posterior
      next(); // Continúa con la siguiente función de middleware o controlador
  });
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

