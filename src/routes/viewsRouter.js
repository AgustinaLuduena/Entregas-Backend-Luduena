import { Router } from "express";
//Views controller
import {index, register, login, profile, getProducts, getCartById, restore, forgottenPass, upload, getUsersView, updateUserRole, deleteUser, purchase} from "../controllers/views.controller.js"
//Middlewares
import { verifyTokenExpiration } from "../utils/utils.js";
import { verifyToken, verifyUser, isUserOrPremium, checkAdminRole } from "../middlewares/auth.js";

//instanciación
const viewsRouter = Router();

//INDEX
viewsRouter.get('/', index);

//SESSION and PROFILE
viewsRouter.get("/register", register);
viewsRouter.get("/login", login);
viewsRouter.get('/profile', verifyToken, profile);
viewsRouter.get("/restore", verifyTokenExpiration, restore);
viewsRouter.get("/forgottenPass", forgottenPass);
// DOCUMENTS UPLOAD VIEW Route
viewsRouter.get('/users/documents', verifyToken, upload);
// PRODUCTS VIEW Route
viewsRouter.get('/products', verifyUser, getProducts);
// CART VIEW Route
viewsRouter.get("/carts/:cid", verifyToken, isUserOrPremium, getCartById);
// PURCHASE VIEW Route
viewsRouter.get("/carts/:cid/purchase", verifyToken, isUserOrPremium, purchase);

//Admin routes
//LIST OF USERS Route
viewsRouter.get('/admin/users', verifyToken, checkAdminRole, getUsersView);
//UPDATE USERS ROLE Route
viewsRouter.post('/admin/users/:id/role', verifyToken, checkAdminRole, updateUserRole);
//DELETE USERs Route
viewsRouter.delete('/admin/users/:id', verifyToken, checkAdminRole, deleteUser);


export default viewsRouter;


