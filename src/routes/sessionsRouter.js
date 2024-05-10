import { Router } from 'express'
import userModel from '../dao/models/users.js';
import passport from 'passport';
import { createHash, isValidPassword } from '../utils.js';


const sessionsRouter = Router()

sessionsRouter.post(
  "/register", 
  passport.authenticate("register", {session: false}),
  async (req, res) => {
    if (req.user) {
      res.status(201).render("register", { message: "User successfully registered!" });
    } else {
      res.status(401).render("register", { error: "Failed to register user!" });
    }
  }
);


sessionsRouter.post(
    '/login', 
    passport.authenticate('login',{session: false}),
    async(req,res)=>{
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
)

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
    req.session.user = {
        name: `${githubUser.first_name}`,
        //email: `${githubUser.email}`,
        email: "Data no disponible",
        age: "Data no disponible",
        role: "User",
    };
   
    res.redirect("/products");
  }
);



export default sessionsRouter

