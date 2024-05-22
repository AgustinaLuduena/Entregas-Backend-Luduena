import { Router } from "express";
import {getAll, getById, createCategory, updateCategory, deleteCategory,} from "../controllers/category.controller.js"

//instanciación
const categoryRouter = Router();

categoryRouter.get("/categories", getAll);
categoryRouter.get("/category/:id",getById);
categoryRouter.post("/category", createCategory);
categoryRouter.put("/category:id", updateCategory);
categoryRouter.delete("/category/:id", deleteCategory);

export default categoryRouter;