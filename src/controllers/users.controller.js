//Factory
import { userManager, cartManager } from "../dao/factory.js";

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
        if (user) {
            res.status(200).json({ user });
        } else {
            res.status(404).json({ error: `Usuario con id: ${id} no encontrado` });
        }
        } catch (error) {
        console.error(`Error al cargar el usuario: ${error}`);
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
      // const newCart = await cartManager.createCart();
      // newUser.cart = newCart._id;
      newUser.role = "User";

      const createdUser = await userManager.createUser(newUser);
      console.log(createdUser);

      const populatedUser = await userManager.getUserWithCart(createdUser._id);

      res.status(201).json({ user: populatedUser });
  } catch (error) {
      console.error(`Error al crear el usuario: ${error}`);
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
          res.status(404).json({ error: "Usuario no encontrado" });
        }
      } catch (error) {
        console.error(`Error al actualizar el usuario: ${error}`);
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
          res.status(404).json({ error: "Usuario no encontrado" });
        }
      } catch (error) {
        console.error(`Error al eliminar el usuario: ${error}`);
        res.status(500).json({ error: `Error al eliminar el usuario` });
      }
}