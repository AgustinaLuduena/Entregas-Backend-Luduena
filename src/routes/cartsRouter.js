import { Router } from 'express'
import {getAllCarts, createCart, getCartById, addProduct, deleteProduct, deleteAllProducts, updateCart, updateProductQuantity, purchase,} from "../controllers/carts.controller.js"
//import { isUser } from "../middlewares/auth.js";
import {verifyToken} from "../middlewares/auth.js"
import passport from 'passport';

//instanciación
const cartsRouter = Router()

//cartsRouter.get("/list", passport.authenticate('jwt',{session: false}), getAllCarts); //funciona pero necesito que sea solo para admin
cartsRouter.get("/list", getAllCarts);
cartsRouter.post("/", createCart);
cartsRouter.get("/:cid/", getCartById);
cartsRouter.post("/:cid/product/:pid/", addProduct);  
cartsRouter.delete("/:cid/product/:pid/", deleteProduct);
cartsRouter.delete("/:cid/", deleteAllProducts);
cartsRouter.put("/:cid/", updateCart);
cartsRouter.put("/:cid/product/:pid/", updateProductQuantity);
cartsRouter.get("/:cid/purchase", passport.authenticate('jwt',{session: false}), verifyToken, purchase);

export default cartsRouter