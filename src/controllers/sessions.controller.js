import userModel from "../dao/models/users.js";
//Password
import { createHash, isValidPassword, verifyRestorePassToken } from "../utils/utils.js";
//Factory
import { authManager, userManager } from "../dao/factory.js";
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

//Estrategia current for JWT
export const current = async (req, res) => {
    try{
      let user = req.user.user
      if (user.role === "admin") {
        let userDTO = new CurrentUserDTO(user)
        let result = userDTO.currentUser
        res.json( result );
      } else {
        let userDB = await userManager.getById(user._id)
          if (!userDB) {
            logger.error(`Error. Usuario no encontrado: ${error}`);
            res.status(404).json({ error: 'Error. Usuario no encontrado. Inicie sesión nuevamente.' });
          } else {
            let userDTO = new CurrentUserDTO(userDB)
            let result = userDTO.currentUser
            res.json( result );
          }
      }
    } catch {
        res.status(500).json({ message: "Error del servidor." });
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


export const loginJWT = async (req, res) => {
  try {
      const { email, password } = req.body;
      let result;

      if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
          result = await authManager.adminLogin({ email, password });
      } else {
          result = await authManager.login({ email, password });
      }

      if (result.token) {
        if (email === "adminCoder@coder.com"){
          res.cookie(config.token, result.token, { httpOnly: true, sameSite: "none" });
          return res.json({ status: "success", message: result.message });
        }
          let user = await userManager.getByEmail(email);
          if(!user){
            logger.error(`User not found.`);
            res.status(400).json({ status: "error", message: "User not found." });
          }
          await updateUserLastConnection(user._id);
          
          res.cookie(config.token, result.token, { httpOnly: true, sameSite: "none" });
          return res.json({ status: "success", message: result.message });
      }
  } catch (error) {
      logger.error(`Error en el inicio de sesión: ${error}`);
      res.status(500).json({ status: "error", message: "Credenciales inválidas." });
  }
};

export const logoutJWT = async (req, res) => {
  try {
      let user = req.user.user
      await updateUserLastConnection(user._id);

      authManager.clearCookie(res, config.token);
      res.redirect('http://localhost:8081/');
      logger.info("Sesión cerrada correctamente.");
  } catch (error) {
      logger.error('Error al cerrar la sesión.', error);
      res.status(500).send('Error interno del servidor');
  }
};


const updateUserLastConnection = async (userId) => {
  try {
    logger.info(`Updating last conection info`);

    const currentDate = new Date()
    const updateResult = await userManager.updateUser(userId, { lastConnection: currentDate });
    console.log(updateResult);
    if (!updateResult) {
      logger.error(`Error trying to update last connection for user ${userId}.`);
      throw new Error(`User was not found.`);
    } else if (updateResult.nModified === 0) {
      logger.error(`Error trying to update last connection for user ${userId}.`);
      throw new Error(`It was not possible to update the user data.`);

    }

    logger.info(`Last connection data was successfully updated for user id: ${userId}`);
  } catch (error) {
    logger.error(`Error trying to update last connection for user ${userId}: ${error}`);
    throw error;
  }
};

