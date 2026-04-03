import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./router/user.routes.js";
import cookieParser from "cookie-parser";
import transactionRouter from "./router/transaction.routes.js";
import dashboardRouter from "./router/dashboard.routes.js";

dotenv.config();

const server = express();
server.use(express.json());
server.use(cookieParser());
server.use(userRouter);
server.use(transactionRouter);
server.use(dashboardRouter);

mongoose.connect(process.env.DBURL).then(() => {
  server.listen(8000, ()=> {
    console.log("Database connected successfully");
  })
});