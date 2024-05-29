import { Router } from 'express';
import passport from 'passport';
import {register, logout, restore, github, githubcallback, loginJWT, current,} from "../controllers/sessions.controller.js";

//instanciación
const sessionsRouter = Router();

sessionsRouter.post( "/register", passport.authenticate("register", {session: false}), register);
//sessionsRouter.post( '/login', passport.authenticate('login',{session: false}), login);
sessionsRouter.post('/logout', logout);
sessionsRouter.post("/restore", restore);
sessionsRouter.get( "/github", passport.authenticate("github", { scope: ["user:email"] }), github);
sessionsRouter.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), githubcallback);

//login JWT por Postman
sessionsRouter.post("/login", loginJWT);
sessionsRouter.get('/current', current);

export default sessionsRouter;

