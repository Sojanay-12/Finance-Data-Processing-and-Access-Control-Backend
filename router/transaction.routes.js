import express from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import { checkAdmin } from "../middlewares/checkadmin.middleware.js";
import { createTransaction, deleteTransaction, getAllTransactions, getFilteredTransactions, getTransactionById, updateTransaction } from "../controllers/transaction.controller.js";

const transactionRouter = express.Router();

transactionRouter.post("/transaction/create", AuthMiddleware, checkAdmin, createTransaction);

transactionRouter.get("/transactions", AuthMiddleware, getAllTransactions);

transactionRouter.get("/transaction/:id", AuthMiddleware, getTransactionById);

transactionRouter.patch("/transaction/:id", AuthMiddleware, checkAdmin, updateTransaction);

transactionRouter.delete("/transaction/:id", AuthMiddleware, checkAdmin, deleteTransaction);

transactionRouter.get("/filtertransactions", AuthMiddleware, getFilteredTransactions);

export default transactionRouter;