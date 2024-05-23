import userModel from "../models/users.js";
import { isValidPassword, generateToken } from "../../utils.js";

export default class AuthManager {
  constructor() {
    console.log("Constructor AuthManager");
  }

    //No funciona el register x JWT  
    register = async ({ first_name, last_name, email, age, password }) => {
        try {
        const user = await userModel.findOne({ email });
        if (user) {
            console.log("This user already exist in the data base.");
            return done(null, false); 
        }

        const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
        };

        //NewUser to the DB
        const result = await userModel.create(newUser);
        //lógica a implementar
        const valid = isValidPassword(result, password);
        if (!valid) return "Error de auteuticación";
        const token = generateToken(email);
        return { message: "Autenticacion exitosa", token };
        } catch (error) {
        console.log(error);
        res.status(500).send({ status: "error", massage: error.message });
        }
    }

    login = async ({ email, password }) => {
        try {
        //lógica a implementar
        const user = await userModel.findOne({ email });
        if (!user) return "Usuario no encontrado";
        const valid = isValidPassword(user, password);
        if (!valid) return "Error de auteuticación";
        const token = generateToken(email);
        return { message: "Autenticacion exitosa", token };
        } catch (error) {
        console.log(error);
        res.status(500).send({ status: "error", massage: error.message });
        }
    }

    adminLogin = async ({ email, password }) => {
        try {
        //lógica a implementar
        const token = generateToken(email);
        return { message: "Autenticacion del administrador exitosa", token };
        } catch (error) {
        console.log(error);
        res.status(500).send({ status: "error", massage: error.message });
        }
    }


}  