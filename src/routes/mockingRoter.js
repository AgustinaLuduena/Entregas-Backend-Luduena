import { Router } from "express";
import { getMock } from "../controllers/mocking.controller.js";

//instanciación
const mockingRouter = Router();

mockingRouter.get("/mockingproducts", getMock);

export default mockingRouter;



