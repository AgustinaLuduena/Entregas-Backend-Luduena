import { Router } from 'express'
import {getAllCarts, createCart, getCartById, addProduct, deleteProduct, deleteAllProducts, updateCart, updateProductQuantity,} from "../controllers/carts.controller.js"
import { isUser } from "../middlewares/auth.js";

//instanciación
const cartsRouter = Router()

cartsRouter.get("/list", isUser, getAllCarts);
cartsRouter.post("/", isUser, createCart);
cartsRouter.get("/:cid/", isUser, getCartById);
cartsRouter.post("/:cid/product/:pid/", isUser, addProduct);  
cartsRouter.delete("/:cid/product/:pid/", isUser, deleteProduct);
cartsRouter.delete("/:cid/", isUser, deleteAllProducts);
cartsRouter.put("/:cid/", isUser, updateCart);
cartsRouter.put("/:cid/product/:pid/", isUser, updateProductQuantity);
//cartsRouter.post("/:cid/purchase", isUser, purchaseCart);

export default cartsRouter