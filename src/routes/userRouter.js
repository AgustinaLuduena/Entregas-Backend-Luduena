import { Router } from "express";
import {getUsers, getUserById, createUser, updateUser, deleteUser,} from "../controllers/users.controller.js"

//instanciación
const userRouter = Router();

userRouter.get("/users", getUsers);
userRouter.get("/user/:id", getUserById);
userRouter.post("/user", createUser);
userRouter.put("/user/:id", updateUser);
userRouter.delete("/user/:id", deleteUser);

export default userRouter;
