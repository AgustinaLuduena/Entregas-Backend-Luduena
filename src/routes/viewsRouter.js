import { Router } from "express";
//middlewares
import { auth } from "../middlewares/auth.js";
import { active } from "../middlewares/activeSession.js";
//ChatManager - without controller
import DBChatManager from "../dao/classes/DBChatManager.js";
//Views controller
import {index, register, login, profile, realTimeProducts, getProducts, getCartById, restore} from "../controllers/views.controller.js"
//Middlewares
import { isUser } from "../middlewares/auth.js";

//instanciación
const viewsRouter = Router();

//INDEX
viewsRouter.get('/', active, index);

//SESSION and PROFILE
viewsRouter.get("/register", active, register);
viewsRouter.get("/login", active, login);
viewsRouter.get("/profile", auth, profile);

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


