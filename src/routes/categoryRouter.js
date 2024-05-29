import { Router } from "express";
import {getAll, getById, createCategory, updateCategory, deleteCategory,} from "../controllers/category.controller.js"
import { isAdmin } from "../middlewares/auth.js"; //Es una prueba. No funciona.

//instanciación
const categoryRouter = Router();

categoryRouter.get("/categories", isAdmin, getAll);
categoryRouter.get("/category/:id",getById);
categoryRouter.post("/category", createCategory);
categoryRouter.put("/category:id", updateCategory);
categoryRouter.delete("/category/:id", deleteCategory);

export default categoryRouter;