import { Router } from 'express';
//Controller
import {getProducts, getAllProductsWithCategories, getProductByID, addProduct, updateProduct, deleteProduct,} from "../controllers/products.controller.js"
//Middlewares
import validateUpdateFields from '../middlewares/validateUpdateFields.js';
import { verifyToken, isPremiumOrAdmin } from '../middlewares/auth.js';

//instanciación
const productsRouter = Router()

productsRouter.get('/', getProducts);
productsRouter.get("/categories", getAllProductsWithCategories);
productsRouter.get("/:pid/", getProductByID);
productsRouter.post('/', verifyToken, isPremiumOrAdmin, addProduct);
productsRouter.put("/:pid/", verifyToken, validateUpdateFields, updateProduct);
productsRouter.delete("/:pid/", verifyToken, deleteProduct);

export default productsRouter;