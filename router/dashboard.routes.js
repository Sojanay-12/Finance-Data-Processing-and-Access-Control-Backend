import express from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import { getCategoryBreakdown, getMonthlyTrends, getRecentTransactions, getSummary } from "../controllers/dashboard.controller.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/summary", AuthMiddleware, getSummary);

dashboardRouter.get("/categoryTotal", AuthMiddleware, getCategoryBreakdown);

dashboardRouter.get("/trends", AuthMiddleware, getMonthlyTrends);

dashboardRouter.get("/recentTransaction", AuthMiddleware, getRecentTransactions);

export default dashboardRouter;