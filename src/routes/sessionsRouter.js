import { Router } from 'express'
import userModel from '../dao/models/users.js';

const sessionsRouter = Router()

sessionsRouter.post("/register", async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

    //Validation
    const exist = await userModel.findOne({ email: email });
    if (exist) {
      return res
        .status(400)
        .send({ status: "error", error: "The email already existe in the DataBase."});
    }


    const user = {
      first_name,
      last_name,
      email,
      age,
      password,
    };

    const result = await userModel.create(user);
    console.log(result);
    res.status(201).send({ staus: "success", payload: result, message: "Registro exitoso", });
  });

  
  sessionsRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    
    //CODER Admin Validation
    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
        req.session.user = {
            name: "Admin",
            email: email,
            role: "admin"
        };
        return res.status(200).send({
            status: "success",
            payload: req.session.user,
            message: "Inicio exitoso como administrador",
        });
    } else {
        const user = await userModel.findOne({ email, password });
        if (!user) {
            return res.status(400).send({ status: "error", error: "Credenciales incorrectas" });
        }
        
        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: "user"
        };
        return res.status(200).send({
            status: "success",
            payload: req.session.user,
            message: "Inicio exitoso",
        });
    }
});


//Destroy the session = LOG OUT route
  sessionsRouter.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al destruir la sesión:', err);
            res.status(500).send('Error interno del servidor');
        } else {
            res.redirect('http://localhost:8080/');
        }
    });
});




export default sessionsRouter

