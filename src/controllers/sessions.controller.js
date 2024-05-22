import userModel from "../dao/models/users.js";
//import passport from "passport";
import {createHash, isValidPassword} from "../utils.js";

//Register
export const register = async (req, res) => {
    if (req.user) {
        res.status(201).render("register", { message: "User successfully registered!" });
      } else {
        res.status(401).render("register", { error: "Failed to register user!" });
      }
}

//Login
export const login = async (req, res) => {
    if(!req.user)return res.status(401).send({ error: "Failed to process login!" })

    const user = req.user;

    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        cart: user.cart,
        role: user.role,
    };
    res.status(201).send({ status: "success", payload: req.user });
}

//Destroy the session = LOG OUT route
export const logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al destruir la sesión:', err);
            res.status(500).send('Error interno del servidor');
        } else {
            res.redirect('http://localhost:8080/');
        }
    });
}

//Restore password
export const restore = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
        return res
            .status(400)
            .send({ status: "error", error: "Please, complete all the information require."});
    }

    const user = await userModel.findOne({ email });
    console.log(user);

    if (!user)
        return res
        .status(400)
        .send({ status: "error", message: "No se encuentró el usuario." });

    const newPass = createHash(password);

    await userModel.updateOne({ _id: user._id }, { $set: { password: newPass } });

    res.status(200).send({ status: "success", message: "Password actualizado" });
}

//Login using Github
export const github = async (req, res) => {
    res.status(201).send({ status: "success", message: "User successfully registered with GitHub!" });
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