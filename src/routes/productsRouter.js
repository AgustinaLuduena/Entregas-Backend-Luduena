import { Router } from 'express'
import validateUpdateFields from '../middlewares/validateUpdateFields.js';
import validateFields from '../middlewares/validateFields.js';
import { isAdmin } from "../middlewares/auth.js"
import {getProducts, getAllProductsWithCategories, getProductByID, addProduct, updateProduct, deleteProduct,} from "../controllers/products.controller.js"

//instanciación
const productsRouter = Router()

productsRouter.get('/', getProducts);
productsRouter.get("/categories", getAllProductsWithCategories);
productsRouter.get("/:pid/", getProductByID);
productsRouter.post('/', isAdmin, addProduct);
productsRouter.put("/:pid/", isAdmin, validateUpdateFields, updateProduct);
productsRouter.delete("/:pid/", isAdmin, deleteProduct);

export default productsRouter;