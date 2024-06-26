import { Router } from "express";
//ChatManager - without controller
import DBChatManager from "../dao/classes/DBChatManager.js";
//Views controller
import {index, register, login, profile, realTimeProducts, getProducts, getCartById, restore, forgottenPass} from "../controllers/views.controller.js"
//Middlewares
import { auth, verifyUser } from "../middlewares/auth.js";
import { active } from "../middlewares/activeSession.js";
import { verifyTokenExpiration } from "../utils/utils.js";

//instanciación
const viewsRouter = Router();

//INDEX
viewsRouter.get('/', active, index);

//SESSION and PROFILE
viewsRouter.get("/register", register);
viewsRouter.get("/login", login);
viewsRouter.get('/profile', verifyUser, profile);
viewsRouter.get("/restore", verifyTokenExpiration, restore);
viewsRouter.get("/forgottenPass", forgottenPass);

// REAL TIME PRODUCTS (FS) - Not working
viewsRouter.get("/api/products/realTimeProducts", realTimeProducts);

// CHAT Routes - Not working
viewsRouter.get("/api/messages/", DBChatManager.getMessages);
viewsRouter.post("/api/messages/addMessage", DBChatManager.addMessage);

// PRODUCTS VIEW Route
viewsRouter.get('/products', verifyUser, getProducts);

// CART VIEW Route
viewsRouter.get("/carts/:cid/", auth, getCartById);




export default viewsRouter;


