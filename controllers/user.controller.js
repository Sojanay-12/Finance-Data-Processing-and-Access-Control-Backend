import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";


//to create new admin
export async function makeAdmin(req, res, next) {
  try {
    const existingAdmin = await User.findOne({
      role: "admin"
    })

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exist"
      })
    }

    const hashedPassword = await bcrypt.hash(process.env.Admin_password, 10);

    const newAdmin = await User.create({
      name: "xyz",
      email: process.env.Admin_email,
      password: hashedPassword,
      role: "admin"
    })
    res.status(200).json({
      success: true,
      message: "admin created successfully"
    })

  } catch (error) {
    next(error);
  }
}


//register user
export async function signUp(req, res, next) {
  try {
    const data = req.body;
    if (!data?.name?.trim() || !data?.email || !data?.password?.trim()) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      })
    }

    if (data.name.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "name should contain atleat 3 characters"
      })
    }

    if (data.password.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "password should contain atleast 5 characters"
      })
    }

    if (!data.email.includes("@")) {
      return res.status(400).json({
        success: false,
        message: "email should contain '@'"
      })
    }

    if (data.role == "admin") {
      return res.status(400).json({
        success: false,
        message: "You cannot registered yourself as admin"
      })
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;
    const newUser = await User.create(data);
    res.status(200).json({
      success: true,
      message: "User registered successfully",
      data: newUser
    })

  } catch (error) {
    next(error);
  }
}


//login user
export async function signIn(req, res, next) {
  try {
    const data = req.body;

    if (!data?.email || !data?.password?.trim()) {
      return res.status(400).json({
        success: false,
        message: "email and password are required"
      })
    }

    if (!data.email.includes("@")) {
      return res.status(400).json({
        success: false,
        message: "email should contain '@'"
      })
    }

    if (data.password.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "password should contain atleast 5 characters"
      })
    }

    const user = await User.findOne({
      email: data.email
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist"
      })
    }

    const isCorrect = await bcrypt.compare(data.password, user.password);
    if (!isCorrect) {
      return res.status(401).json({
        success: false,
        message: "Unauthenticated"
      })
    }

    if (user.status === "inactive") {
      return res.status(403).json({
        success: false,
        message: "Account is inactive"
      });
    }

    const token = jwt.sign({
      id: user._id
    }, process.env.JWT_SECRET)

    res.status(200).cookie("token", token).json({
      success: true,
      message: "User logged-in successfully"
    })
  } catch (error) {
    next(error);
  }
}


//create user by admin only
export async function createUser(req, res, next) {
  try {
    const data = req.body;

    if (!data?.name?.trim() || !data?.email || !data?.password?.trim()) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      })
    }

    if (data.name.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "name should contain atleat 3 characters"
      })
    }

    if (data.password.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "password should contain atleast 5 characters"
      })
    }

    if (!data.email.includes("@")) {
      return res.status(400).json({
        success: false,
        message: "email should contain '@'"
      })
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;
    const newUser = await User.create(data);
    res.status(200).json({
      success: true,
      message: "User created successfully",
      data: newUser
    })

  } catch (error) {
    next(error);
  }
}


//get all users by admin only
export async function getAllUsers(req, res, next){
  try {
    const users = await User.find();
    
    if(!users){
      return res.status(404).json({
        success: false,
        message: "No user exist"
      })
    }

    res.status(200).json({
      success: true,
      message: "Users found successfully",
      data: users
    })
  } catch (error) {
    next(error);
  }
}


//get user by id
export async function getUserById(req, res, next){
  try {
    const userId = req.params.id;

    if(!userId){
      return res.status(400).json({
        success: false,
        message: "User id is mandatory"
      })
    }

    if(!mongoose.Types.ObjectId.isValid(userId)){
      return res.status(400).json({
        success: false,
        message: "user Id is not valid"
      })
    }

    const user = await User.findById(userId);
    if(!user){
      return res.status(404).json({
        success: false,
        message: "User does not exist"
      })
    }

    res.status(200).json({
      success: true,
      message: "User found successfully",
      data: user
    })
  } catch (error) {
    next(error);
  }
}


//update user
export async function updateUser(req, res, next){
  try {
    const userId = req.params.id;
    const data = req.body;

    if(!userId){
      return res.status(400).json({
        success: false,
        message: "User id is mandatory"
      })
    }

    if(!mongoose.Types.ObjectId.isValid(userId)){
      return res.status(400).json({
        success: false,
        message: "user Id is not valid"
      })
    }

    if(!data){
      return res.status(400).json({
        success: false,
        message: "Provide data to update"
      })
    }

    const updatedUser = await User.findByIdAndUpdate(userId, data, {
      new: true
    })

    if(!updatedUser){
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      UpdatedUser: updatedUser
    })
  } catch (error) {
    next(error);
  }
}


//delete user
export async function deleteUser(req, res, next){
  try {
    const userId = req.params.id;

    if(!userId){
      return res.status(400).json({
        success: false,
        message: "User id is mandatory"
      })
    }

    if(!mongoose.Types.ObjectId.isValid(userId)){
      return res.status(400).json({
        success: false,
        message: "User Id is not valid"
      })
    }

    const user = await User.findByIdAndDelete(userId);

    if(!user){
      return res.status(404).json({
        success: false,
        message: "User does not exist"
      })
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      deletedUser: user
    })
  } catch (error) {
    next(error);
  }
}