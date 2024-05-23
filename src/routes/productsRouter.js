import { Router } from 'express';
import passport from 'passport';
import validateUpdateFields from '../middlewares/validateUpdateFields.js';
import validateFields from '../middlewares/validateFields.js';
//import { isAdmin } from "../middlewares/auth.js"
import {getProducts, getAllProductsWithCategories, getProductByID, addProduct, updateProduct, deleteProduct,} from "../controllers/products.controller.js"

//instanciación
const productsRouter = Router()

productsRouter.get('/', getProducts);
productsRouter.get("/categories", getAllProductsWithCategories);
productsRouter.get("/:pid/", getProductByID);
productsRouter.post('/', passport.authenticate('jwt',{session: false}), addProduct);
productsRouter.put("/:pid/", passport.authenticate('jwt',{session: false}), validateUpdateFields, updateProduct);
productsRouter.delete("/:pid/", passport.authenticate('jwt',{session: false}), deleteProduct);

export default productsRouter;