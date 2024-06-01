import userModel from "../models/users.js";
import { isValidPassword, generateToken } from "../../utils.js";

export default class AuthManager {
  constructor() {
    console.log("Constructor AuthManager");
  }

    login = async ({ email, password }) => {
        try {
        const user = await userModel.findOne({ email });
        if (!user) return "Usuario no encontrado";
        const valid = isValidPassword(user, password);
        if (!valid) return "Error de auteuticación";
        const token = generateToken(user);
        console.log(token)
        return { message: "Autenticacion exitosa", token };

        } catch (error) {
        console.log(error);
        res.status(500).send({ status: "error", massage: error.message });
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
        res.status(500).send({ status: "error", massage: error.message });
        }
    }

    borrarCookie = async (res, cookie) => {
      res.clearCookie(cookie, { path: '/' });
  }
}