import { Router } from "express";
//ChatManager - without controller
import DBChatManager from "../dao/classes/DBChatManager.js";
//Views controller
import {index, register, login, profile, realTimeProducts, getProducts, getCartById, restore, forgottenPass, upload, getUsersView, updateUserRole, deleteUser} from "../controllers/views.controller.js"
//Middlewares
//import { auth, verifyUser } from "../middlewares/auth.js";
import { verifyUser } from "../middlewares/auth.js";
import { verifyHeaderToken } from "../middlewares/auth.js";
import { active } from "../middlewares/activeSession.js";
import { verifyTokenExpiration } from "../utils/utils.js";
import { isUserOrPremium, checkAdminRole } from "../middlewares/auth.js";
import { purchase } from "../controllers/carts.controller.js";

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
// DOCUMENTS UPLOAD VIEW Route
viewsRouter.get('/users/documents', verifyUser, upload);
// PRODUCTS VIEW Route
viewsRouter.get('/products', verifyHeaderToken, getProducts);
// CART VIEW Route
viewsRouter.get("/carts/:cid", verifyUser, isUserOrPremium, getCartById);
//viewsRouter.get("/carts/:cid/", auth, getCartById);

viewsRouter.get("/carts/:cid/purchase", verifyUser, isUserOrPremium, purchase);

// Ruta para la vista de administración de usuarios
viewsRouter.get('/admin/users', verifyUser, checkAdminRole, getUsersView);

// Ruta para actualizar rol de usuario
viewsRouter.post('/admin/users/:id/role', verifyUser, checkAdminRole, updateUserRole);

// Ruta para eliminar usuario
viewsRouter.delete('/admin/users/:id', verifyUser, checkAdminRole, deleteUser);


// REAL TIME PRODUCTS (FS) - Not working
viewsRouter.get("/api/products/realTimeProducts", realTimeProducts);

// CHAT Routes - Not working
viewsRouter.get("/api/messages/", DBChatManager.getMessages);
viewsRouter.post("/api/messages/addMessage", DBChatManager.addMessage);





export default viewsRouter;


