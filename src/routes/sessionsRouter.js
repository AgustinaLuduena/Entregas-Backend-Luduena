import { Router } from 'express';
import passport from 'passport';
import {register, restore, github, githubcallback, loginJWT, current, logoutJWT,} from "../controllers/sessions.controller.js";
import { verifyToken } from '../middlewares/auth.js';

//instanciación
const sessionsRouter = Router();

sessionsRouter.post( "/register", register);
//sessionsRouter.post( '/login', passport.authenticate('login',{session: false}), login);
//sessionsRouter.post('/logout', logout);
sessionsRouter.post("/restore", restore);
sessionsRouter.get( "/github", passport.authenticate("github", { scope: ["user:email"] }), github);
sessionsRouter.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), githubcallback);

//login JWT por Postman
sessionsRouter.post("/login", loginJWT);
sessionsRouter.get('/current', verifyToken, current);
sessionsRouter.post('/logout', verifyToken, logoutJWT);

export default sessionsRouter;

