//Factory
import { userManager, cartManager } from "../dao/factory.js";
//ErrorHandler
import { CustomError } from '../errorsHandlers/customError.js';
import { errorTypes } from '../errorsHandlers/errorTypes.js';
import { userNotFound } from "../errorsHandlers/productsError.js";
//Logger
import logger from "../utils/logger-env.js";

//Get all user with populate
export const getUsers = async (req, res) => {
    const users = await userManager.getAllUsersWithCart();
    res.status(200).json({ users });
}

//Get user by ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userManager.getById(id);
        if (!user) {
              throw CustomError.CustomError(
              "Error", `User id ${id} was not found.`,
              errorTypes.ERROR_NOT_FOUND, 
              userNotFound())   
        } else {  
              res.status(200).json({ user });
        }
        } catch (error) {
        logger.error(`Error al cargar el usuario: ${error}`);
        res.status(500).json({ error: `Error al recibir el usuario` });
        }
}

//Create a new user with role and cart
export const createUser = async (req, res) => {
  try {
      const newUser = req.body;

      if (!newUser.cart) {
        const newCart = await cartManager.createCart();
        newUser.cart = newCart._id;
      }

      newUser.role = "User";

      const createdUser = await userManager.createUser(newUser);
      logger.info(createdUser);

      const populatedUser = await userManager.getUserWithCart(createdUser._id);

      res.status(201).json({ user: populatedUser });
  } catch (error) {
      logger.error(`Error al crear el usuario: ${error}`);
      res.status(500).json({ error: 'Error al crear el usuario' });
  }
};


/* Modelo para Postman
{
    "first_name": "Ejemplo",
    "last_name": "Ejemplo",
    "email": "ejemplo@mail.com",
    "password" : "123",
    "age": "20"
}
*/


//Update existing user
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = req.body;
        const result = await userManager.updateUser(id, updatedUser);
        if (result) {
          res.status(200).json({ message: "Usuario actualizado exitosamente" });
        } else {
          throw CustomError.CustomError(
            "Error", `User id ${id} was not found.`,
            errorTypes.ERROR_NOT_FOUND, 
            userNotFound())
        }
      } catch (error) {
        logger.error(`Error al actualizar el usuario: ${error}`);
        res.status(500).json({ error: `Error al actualizar el usuario` });
      }
}

//Delete user from the db
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await userManager.deleteUser(id);
        if (deletedUser) {
          res.status(200).json({ message: "Usuario eliminado exitosamente" });
        } else {
            throw CustomError.CustomError(
            "Error", `User id ${id} was not found.`,
            errorTypes.ERROR_NOT_FOUND, 
            userNotFound())
        }
      } catch (error) {
        logger.error(`Error al eliminar el usuario: ${error}`);
        res.status(500).json({ error: `Error al eliminar el usuario` });
      }
}