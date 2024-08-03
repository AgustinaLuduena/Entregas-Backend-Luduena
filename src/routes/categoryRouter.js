import { Router } from "express";
//Controller
import {getAll, getById, createCategory, updateCategory, deleteCategory,} from "../controllers/category.controller.js"
//Middlewares
import { verifyToken, checkAdminRole } from "../middlewares/auth.js"

//instanciación
const categoryRouter = Router();

categoryRouter.get("/categories", getAll);
categoryRouter.get("/category/:id",getById);
categoryRouter.post("/category",  verifyToken, checkAdminRole, createCategory);
categoryRouter.put("/category/:id",  verifyToken, checkAdminRole, updateCategory);
categoryRouter.delete("/category/:id",  verifyToken, checkAdminRole, deleteCategory);

export default categoryRouter;