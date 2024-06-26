import { Router } from 'express';
import passport from 'passport';
import {register, restore, github, githubcallback, loginJWT, current, logoutJWT,} from "../controllers/sessions.controller.js";
import { verifyToken } from '../middlewares/auth.js';
import { restoreRequest } from '../controllers/mail.controller.js';
import { verifyTokenExpiration } from '../utils/utils.js';

//instanciación
const sessionsRouter = Router();

sessionsRouter.post( "/register", register);
sessionsRouter.post("/restore", verifyTokenExpiration, restore);
sessionsRouter.get( "/github", passport.authenticate("github", { scope: ["user:email"] }), github);
sessionsRouter.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), githubcallback);

//login JWT por Postman
sessionsRouter.post("/login", loginJWT);
sessionsRouter.get('/current', verifyToken, current);
sessionsRouter.get('/logout', verifyToken, logoutJWT);

//Mailing - restore user password
sessionsRouter.post("/restoreReq", restoreRequest)

export default sessionsRouter;

