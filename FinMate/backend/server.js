// Imports
require("dotenv").config();

const cors = require("cors");
const express = require("express");

const connectDB = require("./config/db");
const createCrudController = require("./controllers/crudController");
const authMiddleware = require("./middleware/authMiddleware");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// App setup
const app = express();
app.use(cors());
app.use(express.json());

// Database connection
connectDB().catch((error) => {
  console.error("MongoDB connection failed:", error.message);
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true, name: "FinMate API" });
});

// Authentication and dashboard routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Resource routes
const resources = {
  income: "Income",
  expenses: "Expense",
  "split-expenses": "SplitExpense",
  goals: "Goal",
  bills: "Bill",
  autopay: "AutoPay",
  notes: "Note",
};

Object.entries(resources).forEach(([path, modelName]) => {
  const Model = require(`./models/${modelName}`);
  const controller = createCrudController(Model);
  const router = express.Router();

  router.use(authMiddleware);
  router.get("/", controller.list);
  router.post("/", controller.create);
  router.put("/:id", controller.update);
  router.delete("/:id", controller.remove);

  app.use(`/api/${path}`, router);
});

// Server start
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`FinMate API running on ${port}`);
});
