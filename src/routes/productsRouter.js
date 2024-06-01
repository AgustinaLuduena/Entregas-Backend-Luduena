import { Router } from 'express';
import passport from 'passport';
import validateUpdateFields from '../middlewares/validateUpdateFields.js';
import validateFields from '../middlewares/validateFields.js';
//import { isAdmin } from "../middlewares/auth.js"
import {getProducts, getAllProductsWithCategories, getProductByID, addProduct, updateProduct, deleteProduct,} from "../controllers/products.controller.js"
import { verifyToken, checkAdminRole } from '../middlewares/auth.js';

//instanciación
const productsRouter = Router()

productsRouter.get('/', getProducts);
productsRouter.get("/categories", getAllProductsWithCategories);
productsRouter.get("/:pid/", getProductByID);
productsRouter.post('/', verifyToken, checkAdminRole, addProduct);
productsRouter.put("/:pid/", verifyToken, checkAdminRole, validateUpdateFields, updateProduct);
productsRouter.delete("/:pid/", verifyToken, checkAdminRole, deleteProduct);

export default productsRouter;