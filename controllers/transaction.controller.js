import mongoose from "mongoose";
import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";


//create transaction(only admin)
export async function createTransaction(req, res, next) {
  try {
    const data = req.body;

    if (!data?.amount || !data?.transactionType || !data?.category) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      })
    }

    if (isNaN(data.amount) || data.amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "amount should be a valid integer and should be greater than 0"
      })
    }

    if (data.category.trim().length == 0) {
      return res.status(400).json({
        success: false,
        message: "category should be a valid string"
      })
    }

    const newTransaction = await Transaction.create({
      ...data,
      createdBy: req.user._id
    })

    res.status(200).json({
      success: true,
      message: "Transaction created successfully",
      data: newTransaction
    })
  } catch (error) {
    next(error);
  }
}


//get all transactions (admin and analyst only)
export async function getAllTransactions(req, res, next) {
  try {
    const token = req.cookies.token;
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(tokenData.id);

    if (!user || user.role === "viewer") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access it"
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find({
      createdBy: user._id
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Transactions fetched successfully",
      data: transactions
    });
  } catch (error) {
    next(error);
  }
}


//get transaction by id
export async function getTransactionById(req, res, next) {
  try {
    const transactionid = req.params.id;

    if (!transactionid) {
      return res.status(400).json({
        success: false,
        message: "Transaction id is mandatory"
      })
    }

    if (!mongoose.Types.ObjectId.isValid(transactionid)) {
      return res.status(400).json({
        success: false,
        message: "Transaction id is not valid"
      })
    }

    const token = req.cookies.token;
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(tokenData.id);

    if (user.role === "viewer") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access it"
      })
    }

    const transaction = await Transaction.findById(transactionid);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction does not exist"
      })
    }
    res.status(200).json({
      success: true,
      message: "Transaction fetched successfully",
      data: transaction
    })
  } catch (error) {
    next(error);
  }
}


//update transaction
export async function updateTransaction(req, res, next) {
  try {
    const transactionid = req.params.id;
    const data = req.body;

    if (!transactionid) {
      return res.status(400).json({
        success: false,
        message: "Transaction id is mandatory"
      })
    }

    if (!mongoose.Types.ObjectId.isValid(transactionid)) {
      return res.status(400).json({
        success: false,
        message: "Transaction id is not valid"
      })
    }

    if (!data) {
      return res.status(400).json({
        success: false,
        message: "Provide data for updation"
      })
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(transactionid, data, {
      new: true
    }).populate("createdBy");

    if (!updatedTransaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction does not exist"
      })
    }

    res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      UpdatedTransaction: updatedTransaction
    })
  } catch (error) {
    next(error);
  }
}


//delete transaction
export async function deleteTransaction(req, res, next) {
  try {
    const transactionid = req.params.id;

    if (!transactionid) {
      return res.status(400).json({
        success: false,
        message: "Transaction id is mandatory"
      })
    }

    if (!mongoose.Types.ObjectId.isValid(transactionid)) {
      return res.status(400).json({
        success: false,
        message: "Transaction id is not valid"
      })
    }

    const deletedTransaction = await Transaction.findByIdAndDelete(transactionid);

    if (!deletedTransaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction does not exist"
      })
    }

    res.status(200).json({
      success: true,
      message: "Transactiondeleted successfully",
      data: deletedTransaction
    })
  } catch (error) {
    next(error);
  }
}


//filter transaction on the basis of query
export async function getFilteredTransactions(req, res, next) {
  try {
    const { q, type } = req.query;

    const token = req.cookies.token;
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(tokenData.id);

    if (user.role === "viewer") {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    let filter = { createdBy: user._id };

    if (q) {
      filter.$or = [
        { category: { $regex: q, $options: "i" } },
        { transactionType: { $regex: q, $options: "i" } }
      ];
    }

    if (type) {
      filter.transactionType = type;
    }

    const transactions = await Transaction.find(filter);

    res.status(200).json({
      success: true,
      data: transactions
    });

  } catch (error) {
    next(error);
  }
}