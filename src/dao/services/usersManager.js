import { createHash } from "../../utils.js";
import userModel from "../models/users.js";

export default class UserManager {
  constructor() {
    console.log("Constructor UserManager");
  }

  getAll = async () => {
    const result = await userModel.find();
    return result;
  };

  getById = async (id) => {
    const result = await userModel.findById(id);
    return result;
  };

  createUser = async (userData) => {
    try {
      // Hashear la contraseña antes de crear el usuario
      userData.password = createHash(userData.password);
      const result = await userModel.create(userData);
      return result;
    } catch (error) {
      console.log("Error al crear el usuario", error.message);
    }
   
  };

  updateUser = async (id, userData) => {
    // Hashear la contraseña antes de actualizar el usuario
    if (userData.password) {
      userData.password = createHash(userData.password);
    }
    const result = await userModel.updateOne({ _id: id }, { $set: userData });
    return result;
  };

  deleteUser = async (id) => {
    const result = await userModel.deleteOne({ _id: id });
    return result;
  };

  //Get all users in the db with carts details
  getAllUsersWithCart = async () => {
    try {
      const users = await userModel.find().populate("cart");
      return users;
    } catch (error) {
      console.log("Error al obtener los usuarios ", error.message);
    }
  };

}