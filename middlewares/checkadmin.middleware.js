import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export async function checkAdmin(req, res, next) {
  try {

    const token = req.cookies.token;
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(tokenData.id);

    if (user.role != "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to perform this task! Only admin can perform it"
      })
    }
    req.user = user;
    next();

  } catch (error) {
    next(error);
  }
}