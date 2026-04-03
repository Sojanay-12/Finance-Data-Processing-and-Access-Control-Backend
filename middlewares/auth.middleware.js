import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


export async function AuthMiddleware(req, res, next) {
  try {
    const token = req.cookies.token;


    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    const id = tokenData.id;

    if (!id) {
      return res.status(401).json({
        success: false,
        message: "Unauthenticated"
      })
    }

    const user = await User.findById(id);

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong"
    })
  }
}

