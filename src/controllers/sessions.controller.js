import userModel from "../dao/models/users.js";
import { createHash } from "../utils/utils.js";
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

//Login con session
// export const login = async (req, res) => {
//     if(!req.user)return res.status(401).send({ error: "Failed to process login!" })

//     const user = req.user;

//     req.session.user = {
//         name: `${user.first_name} ${user.last_name}`,
//         email: user.email,
//         age: user.age,
//         cart: user.cart,
//         role: user.role,
//     };
//     res.status(201).send({ status: "success", payload: req.user });
// }



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


//Destroy the session = LOG OUT route con session
// export const logout = async (req, res) => {
//     req.session.destroy((err) => {
//         if (err) {
//             console.error('Error al destruir la sesión:', err);
//             res.status(500).send('Error interno del servidor');
//         } else {
//             res.redirect('http://localhost:8081/');
//         }
//     });
// }

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

//Restore password
export const restore = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
        return res.status(400).json({ status: "error", error: "Please, complete all the information require."});
    }

    const user = await userModel.findOne({ email });

    if (!user){
        return res.status(404).json({ status: "error", message: "No se encuentró el usuario." });
    }

    const newPass = createHash(password);

    await userModel.updateOne({ _id: user._id }, { $set: { password: newPass } });

    res.status(200).json({ status: "success", message: "Password actualizado" });
}

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