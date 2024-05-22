import { Router } from "express";
import {getUsers, getUserById, createUser, updateUser, deleteUser,} from "../controllers/users.controller.js"
import { isAdmin } from "../middlewares/auth.js"

//instanciación
const userRouter = Router();

userRouter.get("/users", isAdmin, getUsers);
userRouter.get("/user/:id", isAdmin, getUserById);
userRouter.post("/user", createUser);
userRouter.put("/user/:id", updateUser);
userRouter.delete("/user/:id", deleteUser);

export default userRouter;
