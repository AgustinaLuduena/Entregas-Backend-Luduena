import { Router } from "express";
//ChatManager - without controller
import DBChatManager from "../dao/classes/DBChatManager.js";
//Views controller
import {index, register, login, profile, realTimeProducts, getProducts, getCartById, restore} from "../controllers/views.controller.js"
//Middlewares
import { isUser } from "../middlewares/auth.js"; //no funciona
import { auth } from "../middlewares/auth.js";
import { active } from "../middlewares/activeSession.js";

//instanciación
const viewsRouter = Router();

//INDEX
viewsRouter.get('/', active, index);

//SESSION and PROFILE
viewsRouter.get("/register", register);
viewsRouter.get("/login", login);
viewsRouter.get('/profile', profile);

// REAL TIME PRODUCTS (FS)
viewsRouter.get("/api/products/realTimeProducts", realTimeProducts);

// CHAT Routes
viewsRouter.get("/api/messages/", isUser, DBChatManager.getMessages);
viewsRouter.post("/api/messages/addMessage", isUser, DBChatManager.addMessage);

// PRODUCTS VIEW Route
viewsRouter.get('/products', getProducts);

// CART VIEW Route
viewsRouter.get("/carts/:cid/", auth, getCartById);

viewsRouter.get("/restore", restore);


export default viewsRouter;


