import { Router } from "express";
import {getUsers, getUserById, createUser, updateUser, deleteUser, changeUserRole, uploadDocuments} from "../controllers/users.controller.js"
import { verifyToken, checkAdminRole, isUserOrPremium } from "../middlewares/auth.js";

//instanciación
const userRouter = Router();

userRouter.get("/users", verifyToken, checkAdminRole, getUsers);
userRouter.get("/user/:id", getUserById);
userRouter.post("/user", createUser);
userRouter.put("/user/:id", updateUser);
userRouter.delete("/user/:id", deleteUser);
userRouter.get("/users/premium/:id",  verifyToken, isUserOrPremium, changeUserRole);
userRouter.post("/users/:uid/documents", verifyToken, uploadDocuments);

export default userRouter;
