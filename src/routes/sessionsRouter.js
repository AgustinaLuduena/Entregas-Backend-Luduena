import { Router } from 'express';
//Controller
import {register, restore, loginJWT, current, logoutJWT,} from "../controllers/sessions.controller.js";
import { restoreRequest } from '../controllers/mail.controller.js';
//Middlewares
import { verifyToken } from '../middlewares/auth.js';
import { verifyTokenExpiration } from '../utils/utils.js';

//instanciación
const sessionsRouter = Router();

sessionsRouter.post( "/register", register);
sessionsRouter.post("/login", loginJWT);
sessionsRouter.get('/current', verifyToken, current);
sessionsRouter.get('/logout', verifyToken, logoutJWT);

//Mailing - restore user password
sessionsRouter.post("/restore", verifyTokenExpiration, restore);
sessionsRouter.post("/restoreReq", restoreRequest)

export default sessionsRouter;

