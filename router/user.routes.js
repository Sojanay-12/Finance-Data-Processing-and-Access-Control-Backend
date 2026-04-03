import express from "express";
import { createUser, deleteUser, getAllUsers, getUserById, makeAdmin, signIn, signUp, updateUser } from "../controllers/user.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import { checkAdmin } from "../middlewares/checkadmin.middleware.js";

const userRouter = express.Router();

userRouter.post("/user/admin", makeAdmin);

userRouter.post("/user/signup", signUp);

userRouter.post("/user/signin", signIn);

userRouter.post("/user/createByAdmin", AuthMiddleware, checkAdmin, createUser);

userRouter.get("/users/admin", AuthMiddleware, checkAdmin, getAllUsers);

userRouter.get("/user/:id", AuthMiddleware, checkAdmin, getUserById);

userRouter.patch("/user/:id", AuthMiddleware, checkAdmin, updateUser);

userRouter.delete("/user/:id", AuthMiddleware, checkAdmin, deleteUser);

export default userRouter;