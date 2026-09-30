const Income = require("../models/Income");
const Expense = require("../models/Expense");
const Bill = require("../models/Bill");
const Goal = require("../models/Goal");

async function summary(req, res) {
  const userId = req.user.id;
  const [income, expenses, goals, bills] = await Promise.all([
    Income.find({ userId }),
    Expense.find({ userId }).sort({ date: -1 }),
    Goal.find({ userId }),
    Bill.find({ userId }).sort({ dueDate: 1 }),
  ]);

  const totalIncome = income.reduce((total, item) => total + item.amount, 0);
  const totalExpenses = expenses.reduce(
    (total, item) => total + item.amount,
    0,
  );
  const categories = expenses.reduce((result, item) => {
    result[item.category] = (result[item.category] || 0) + item.amount;
    return result;
  }, {});

  const recentTransactions = [
    ...income.map((item) => ({ ...item.toObject(), kind: "income" })),
    ...expenses.map((item) => ({ ...item.toObject(), kind: "expense" })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  res.json({
    totalIncome,
    totalExpenses,
    totalSavings: totalIncome - totalExpenses,
    balance: totalIncome - totalExpenses,
    categories,
    goals,
    recentTransactions,
    upcomingBills: bills.slice(0, 5),
  });
}

async function analytics(req, res) {
  const userId = req.user.id;
  const [income, expenses] = await Promise.all([
    Income.find({ userId }),
    Expense.find({ userId }),
  ]);
  const monthlyExpenses = {};

  expenses.forEach((item) => {
    const month = new Date(item.date).toLocaleString("en-IN", {
      month: "short",
    });
    monthlyExpenses[month] = (monthlyExpenses[month] || 0) + item.amount;
  });

  res.json({ income, expenses, monthlyExpenses });
}

module.exports = { summary, analytics };
