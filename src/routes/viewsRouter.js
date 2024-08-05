import { Router } from "express";
//Views controller
import {index, register, login, profile, realTimeProducts, getProducts, getCartById, restore, forgottenPass, upload, getUsersView, updateUserRole, deleteUser, purchase} from "../controllers/views.controller.js"
//Middlewares
import { verifyTokenExpiration } from "../utils/utils.js";
import { verifyUser, isUserOrPremium, checkAdminRole } from "../middlewares/auth.js";

//instanciación
const viewsRouter = Router();

//INDEX
viewsRouter.get('/', index);

//SESSION and PROFILE
viewsRouter.get("/register", register);
viewsRouter.get("/login", login);
viewsRouter.get('/profile', verifyUser, profile);
viewsRouter.get("/restore", verifyTokenExpiration, restore);
viewsRouter.get("/forgottenPass", forgottenPass);
// DOCUMENTS UPLOAD VIEW Route
viewsRouter.get('/users/documents', verifyUser, upload);
// PRODUCTS VIEW Route
viewsRouter.get('/products', verifyUser, getProducts);
// CART VIEW Route
viewsRouter.get("/carts/:cid", verifyUser, isUserOrPremium, getCartById);
// PURCHASE VIEW Route
viewsRouter.get("/carts/:cid/purchase", verifyUser, isUserOrPremium, purchase);


//REVISAR!!!1

// Ruta para la vista de administración de usuarios
viewsRouter.get('/admin/users', verifyUser, checkAdminRole, getUsersView);

// Ruta para actualizar rol de usuario
viewsRouter.post('/admin/users/:id/role', verifyUser, checkAdminRole, updateUserRole);

// Ruta para eliminar usuario
viewsRouter.delete('/admin/users/:id?', verifyUser, checkAdminRole, deleteUser);


export default viewsRouter;


