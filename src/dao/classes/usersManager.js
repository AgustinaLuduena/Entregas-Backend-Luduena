import { createHash } from "../../utils/utils.js";
import userModel from "../models/users.js";
//ErrorHandler
import { CustomError } from '../../errorsHandlers/customError.js';
import { errorTypes } from '../../errorsHandlers/errorTypes.js';
import { dataError, notFound } from "../../errorsHandlers/productsError.js";
//Logger
import logger from "../../utils/logger-env.js";

export default class UserManager {
  constructor() {
    logger.info("Constructor UserManager");
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
      throw CustomError.CustomError(
        "Error", `Error creating the user.`, 
        errorTypes.ERROR_DATA, 
        dataError())
    }
   
  };

  updateUser = async (id, userData) => {
    let result = await userModel.findById(id)
    if(!result) {
        throw CustomError.CustomError(
            "Error", `The User Id ${id} was not found.`, 
            errorTypes.ERROR_NOT_FOUND, 
            notFound(id))
    } else {
         // Hashear la contraseña antes de actualizar el usuario
        if (userData.password) {
          userData.password = createHash(userData.password);
        }
        const updateResult = await userModel.updateOne({ _id: id }, { $set: userData });
        return updateResult;   
    }
   
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
      throw CustomError.CustomError(
        "Error", `Error getting the users data.`, 
        errorTypes.ERROR_DATA, 
        dataError())
    }
  };

  //Get user details for profile
  getUserWithCart = async (userId) => {
    try {
      const user = await userModel.findById(userId).populate('cart');
      return user;
    } catch (error) {
      throw CustomError.CustomError(
        "Error", `Error getting the user data with cart details.`, 
        errorTypes.ERROR_DATA, 
        dataError())
    }
  }
  

}
