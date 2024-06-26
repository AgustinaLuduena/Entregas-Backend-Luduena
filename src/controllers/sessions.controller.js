import userModel from "../dao/models/users.js";
//Password
import { createHash, isValidPassword, verifyRestorePassToken } from "../utils/utils.js";
//Factory
import { authManager } from "../dao/factory.js";
//ENV
import config from "../config/config.js";
//DTO
import CurrentUserDTO from "../dao/dto/dto.js"
//Logger
import logger from "../utils/logger-env.js";

//Register
export const register = async (req, res) => {
    if (req.user) {
        res.status(201).render("register", { message: "User successfully registered!" });
      } else {
        res.status(401).render("register", { error: "Failed to register user!" });
      }
}

//Login 
export const loginJWT = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
        let result = await authManager.adminLogin({ email, password });
        if (result.token) {
          res.cookie(config.token, result.token, { httpOnly: true, sameSite: "none", });
          return res.json({ status: "success", message: result.message });
        }
      } else {
      let result = await authManager.login({ email, password });
      if (result.token) {
        res.cookie(config.token, result.token, { httpOnly: true, sameSite: "none", });
        return res.json({ status: "success", message: result.message });
      }
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: `Credentials Error.` });
  }
};

//Estrategia current for JWT
export const current = async (req, res) => {
    try{
      let user = req.user
      let userDTO = new CurrentUserDTO(user.user)
      let result = userDTO.currentUser
      res.json( result );
    } catch {
        res.status(500).json({ message: "Error del servidor." });
    }
}

//Destroy the session with cookie = LOG OUT route
export const logoutJWT = async (req, res) => {
  try {
    authManager.borrarCookie(res, config.token);
    res.redirect('http://localhost:8081/');
    logger.info("Ha cerrado su sesión correctamente.");
  } catch (error) {
    logger.error('Error al destruir la sesión.', error);
    res.status(500).send('Error interno del servidor');
  }
}

export const restore = async (req, res) => {
  const { token, email, password } = req.body;

  try {
      const verifyToken = verifyRestorePassToken(token);
  
      if (!email || !password) {
          return res.status(400).json({ status: "error", error: "Please, complete all the information require."});
      }
      const user = await userModel.findOne({ email });

      if (!user) {
          return res.status(404).json({ status: "error", message: "User was not found." });
      }

      if (isValidPassword(user, password)) {
          return res.status(400).json({ status: "error", message: "La contraseña no puede ser igual a la anterior." });
      }

      const newPass = createHash(password);
      await userModel.updateOne({ _id: user._id }, { $set: { password: newPass } });
      res.status(200).json({ status: "success", message: "Contraseña actualizada exitosamente." });

  } catch (error) {
      logger.error("Error al restablecer la contraseña:", error);
      res.status(500).json({ status: "error", message: "Error al restablecer la contraseña. Inténtelo nuevamente." });
  }
};

//Login using Github
export const github = async (req, res) => {
    res.status(201).json({ status: "success", message: "User successfully registered with GitHub!" });
}

export const githubcallback = async (req, res) => {
    if(!req.user)return res.status(400).send('error')

    const githubUser = req.user
    req.session.user = {
        name: `${githubUser.first_name}`,
        //email: `${githubUser.email}`,
        email: "Data no disponible",
        age: "Data no disponible",
        role: "User",
    };
   
    res.redirect("/products");
}