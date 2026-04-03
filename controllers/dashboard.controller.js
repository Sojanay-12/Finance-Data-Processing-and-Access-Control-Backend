import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";

//get summary of trasaction
export async function getSummary(req, res, next) {
  try {

    const token = req.cookies.token;
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(tokenData.id);

    if (user.role === "viewer") {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    const result = await Transaction.aggregate([
      { $match: { createdBy: user._id } },
      {
        $group: {
          _id: "$transactionType",
          total: { $sum: "$amount" }
        }
      }
    ]);

    let totalIncome = 0;
    let totalExpense = 0;

    result.forEach(item => {
      if (item._id === "income") totalIncome = item.total;
      if (item._id === "expense") totalExpense = item.total;
    });

    return res.status(200).json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense
      }
    });

  } catch (error) {
    next(error);
  }
}


//get category wise total
export async function getCategoryBreakdown(req, res, next) {
  try {

    const token = req.cookies.token;
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(tokenData.id);

    if (user.role === "viewer") {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    const result = await Transaction.aggregate([
      { $match: { createdBy: user._id } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      },
      { $sort: { total: -1 } }
    ]);

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    next(error);
  }
}


//get monthly trends
export async function getMonthlyTrends(req, res, next) {
  try {

    const token = req.cookies.token;
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(tokenData.id);

    if (user.role === "viewer") {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    const result = await Transaction.aggregate([
      { $match: { createdBy: user._id } },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            type: "$transactionType"
          },
          total: { $sum: "$amount" }
        }
      },
      {
        $group: {
          _id: "$_id.month",
          income: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "income"] }, "$total", 0]
            }
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "expense"] }, "$total", 0]
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    next(error);
  }
}


//get recent transactions
export async function getRecentTransactions(req, res, next) {
  try {

    const token = req.cookies.token;
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(tokenData.id);

    if (user.role === "viewer") {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    const transactions = await Transaction.find({
      createdBy: user._id
    })
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      data: transactions
    });

  } catch (error) {
    next(error);
  }
}