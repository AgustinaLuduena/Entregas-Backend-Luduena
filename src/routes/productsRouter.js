import { Router } from 'express'
import validateUpdateFields from '../middlewares/validateUpdateFields.js';
import validateFields from '../middlewares/validateFields.js';
import {getProducts, getAllProductsWithCategories, getProductByID, addProduct, updateProduct, deleteProduct,} from "../controllers/products.controller.js"

//instanciación
const productsRouter = Router()

productsRouter.get('/', getProducts);
productsRouter.get("/categories", getAllProductsWithCategories);
productsRouter.get("/:pid/", getProductByID);
productsRouter.post('/', addProduct);
productsRouter.put("/:pid/", validateUpdateFields, updateProduct);
productsRouter.delete("/:pid/", deleteProduct);

export default productsRouter