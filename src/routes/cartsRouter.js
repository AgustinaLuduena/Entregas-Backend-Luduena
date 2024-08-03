import { Router } from 'express'
//Controller
import {getAllCarts, createCart, getCartById, addProduct, deleteProduct, deleteAllProducts, updateCart, updateProductQuantity, purchase,} from "../controllers/carts.controller.js"
//Middlewares
import {verifyToken, checkAdminRole, checkUserRole} from "../middlewares/auth.js"

//instanciación
const cartsRouter = Router()

//cartsRouter.get("/list", passport.authenticate('jwt',{session: false}), getAllCarts); //funciona pero necesito que sea solo para admin
cartsRouter.get("/list", verifyToken, checkAdminRole, getAllCarts);
cartsRouter.post("/", createCart);
cartsRouter.get("/:cid/", getCartById);
cartsRouter.post("/:cid/product/:pid/", verifyToken, checkUserRole, addProduct);  
cartsRouter.delete("/:cid/product/:pid/", verifyToken, checkUserRole, deleteProduct);
cartsRouter.delete("/:cid/", verifyToken, checkUserRole, deleteAllProducts);
cartsRouter.put("/:cid/", verifyToken, checkUserRole, updateCart);
cartsRouter.put("/:cid/product/:pid/", verifyToken, checkUserRole, updateProductQuantity);
cartsRouter.get("/:cid/purchase", verifyToken, checkUserRole, purchase);

export default cartsRouter