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
        return { message: "Autenticacion exitosa", token };

        } catch (error) {
        console.log(error);
        res.status(500).send({ status: "error", massage: error.message });
        }
    }

    adminLogin = async ({ email, password }) => {
        try {
        const token = generateToken(email);
        return { message: "Autenticacion del administrador exitosa", token };
        } catch (error) {
        console.log(error);
        res.status(500).send({ status: "error", massage: error.message });
        }
    }
}