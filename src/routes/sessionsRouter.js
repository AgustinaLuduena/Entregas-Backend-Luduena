import { Router } from 'express'
import userModel from '../dao/models/users.js';
import passport from 'passport';
import { createHash, isValidPassword } from '../utils.js';


const sessionsRouter = Router()

/* 
sessionsRouter.post("/register", async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

    //Validation
    const exist = await userModel.findOne({ email: email });
    if (exist) {
      return res
        .status(400)
        .send({ status: "error", error: "The email already existe in the DataBase."});
    }

    if (!first_name || !last_name || !email || !age) {
        return res
          .status(400)
          .send({ status: "error", error: "Please, complete all the information require."});
      }

    const user = {
      first_name,
      last_name,
      email,
      age,
      password : createHash(password),
    };

    const result = await userModel.create(user);
    console.log(result);
    res.status(201).send({ staus: "success", payload: result, message: "Registro exitoso", });
  });
*/
sessionsRouter.post(
    "/register", 
    passport.authenticate("register", {failureRedirect:"/api/sessions/failregister"}), 
    async (req, res) => {
        console.log("Getting user information.");
        res.status(201).send({ status: "success", message: "User successfully registered!" });
      }
)

sessionsRouter.get("/failregister", async (req, res) =>{
    console.log("error");
    res.status(401).send({ error: "Failed to process register!" });

})



/* 
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
        const user = await userModel.findOne({email});
        if (!user) return res.status(401).send({ status: "error", error: "Credenciales incorrectas" });

        if (!email || !password) {
            return res
                .status(400)
                .send({ status: "error", error: "Please, complete all the information require."});
        }

        const validatePassword = isValidPassword(user, password)
        if(!validatePassword) return res.status(401).send({ status: "error", error: "Credenciales incorrectas" })
        delete user.password
        

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
*/

sessionsRouter.post(
    '/login', 
    passport.authenticate('login',{failureRedirect:"/api/sessions/faillogin"}),
    async(req,res)=>{
        if(!req.user)return res.status(400).send('error')

        const user = req.user;

        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: "User"
        };
        res.status(200).send({ status: "success", payload: req.user });
        }
)


sessionsRouter.get("/faillogin", async (req, res) => {
  console.log("error");
  res.send({ error: "Failed to process login!" });
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

//Restore password
sessionsRouter.post("/restore", async (req, res) => {
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
});



//Login using Github
sessionsRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {
    res.status(201).send({ status: "success", message: "User successfully registered with GitHub!" });
  }
);

sessionsRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    
    if(!req.user)return res.status(400).send('error')

    const githubUser = req.user
    //req.session.user = req.user;
    req.session.user = {
        name: `${githubUser.first_name}`,
        email: `${githubUser.email}`,
        age: "Data no disponible",
        role: "User",
    };
   
    res.redirect("/products"); //MODIF - ruta a la que redirigimos luego de iniciar sesión
  }
);



export default sessionsRouter

