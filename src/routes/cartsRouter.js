import { Router } from 'express'
import {getAllCarts, createCart, getCartById, addProduct, deleteProduct, deleteAllProducts, updateCart, updateProductQuantity,} from "../controllers/carts.controller.js"

//instanciación
const cartsRouter = Router()

cartsRouter.get("/list", getAllCarts);
cartsRouter.post("/", createCart);
cartsRouter.get("/:cid/", getCartById);
cartsRouter.post("/:cid/product/:pid/", addProduct);  
cartsRouter.delete("/:cid/product/:pid/", deleteProduct);
cartsRouter.delete("/:cid/", deleteAllProducts);
cartsRouter.put("/:cid/", updateCart);
cartsRouter.put("/:cid/product/:pid/", updateProductQuantity);

export default cartsRouter