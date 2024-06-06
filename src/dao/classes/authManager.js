import userModel from "../models/users.js";
import { isValidPassword, generateToken } from "../../utils.js";
//ErrorHandler
import { CustomError } from '../../errorsHandlers/customError.js';
import { errorTypes } from '../../errorsHandlers/errorTypes.js';
import { userNotFound, authError } from "../../errorsHandlers/productsError.js";


export default class AuthManager {
  constructor() {
    console.log("Constructor AuthManager");
  }

    login = async ({ email, password }) => {
        try {
        const user = await userModel.findOne({ email });
        if (!user) {
          throw CustomError.CustomError(
            "Error", `User not found.`,
            errorTypes.ERROR_NOT_FOUND, 
            userNotFound())
        }
        const valid = isValidPassword(user, password);
        if (!valid) {
          throw CustomError.CustomError(
            "Error", `Authentication Error.`,
            errorTypes.ERROR_AUTHENTICATION, 
            authError())
        }
        const token = generateToken(user);
        console.log(token)
        return { message: "Autenticacion exitosa", token };

        } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 'Internal Server Error', massage: error.message });

        }
    }

    adminLogin = async ({ email, password }) => {
      try {
          const admin = {
          email: email,
          password: password,
          first_name: "Administrador",
          last_name: "Coderhouse",
          role: "admin",
          age: "No disponible",
          cart: "El admin no tiene un carrito asignado"
        };

        let user = admin;
        const token = generateToken(user);
        return { message: "Autenticacion del administrador exitosa", token };
        } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 'Internal Server Error', massage: error.message });
      }
    }

    borrarCookie = async (res, cookie) => {
      try{
        res.clearCookie(cookie, { path: '/' });
      }catch (error){
        return res.status(500).json({ status: 'Internal Server Error', massage: error.message });
      }

  }
}