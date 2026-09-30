# FinMate – Personal Finance & Expense Management Platform

## 📌 About

FinMate is a MERN-stack personal finance platform for students and young adults. It helps users record income and expenses, plan savings goals, track bills and recurring payments, manage shared expenses, keep finance notes, and view financial insights.

## 🎯 Problem

Students and young adults may receive money from parents, scholarships, freelancing, stipends, or salaries, but often do not have one simple system for tracking spending, managing bills, saving for goals, and understanding their financial habits.

## ✨ Features

- **User Authentication** – Register and log in with bcrypt-hashed passwords and JWT-based protected API access.
- **Financial Dashboard** – Shows live income, expenses, savings, balance, recent transactions, goals, bills, and a daily money tip.
- **Income Management** – Add and view income records such as pocket money, scholarships, freelancing, or salary.
- **Expense Management** – Add, view, and delete expense records by category and date.
- **Savings Goals** – Create and track goals with target and current amounts.
- **Bills & Reminders** – Store bills with amounts, due dates, and categories.
- **AutoPay / Recurring Payment Tracking** – Record recurring payments and their next payment details.
- **Split Expenses** – Record shared expenses and member names.
- **Analytics** – View recorded income and expense information and export available analytics data as CSV.
- **My Space / Notes** – Store personal finance notes with titles, content, categories, and priority.
- **Daily Money Tips** – Shows a date-based educational money tip from local frontend data.
- **Profile & Settings** – Routes are available in the current UI as workspace pages; detailed profile editing and settings controls are planned.

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- JavaScript
- React Router
- Plain CSS
- Browser Fetch API for HTTP requests

Tailwind CSS, Axios, and Recharts are not currently used by the application.

### Backend

- Node.js
- Express.js
- REST APIs
- JSON Web Token authentication
- bcryptjs password hashing

### Database

- MongoDB
- Mongoose

MongoDB Compass may be used separately to inspect the local database, but it is not an application dependency.

### Development

- Git
- GitHub
- Postman
- VS Code

## 📁 Project Structure

```text
FinMate/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── crudController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── AutoPay.js
│   │   ├── Bill.js
│   │   ├── Expense.js
│   │   ├── Goal.js
│   │   ├── Income.js
│   │   ├── Note.js
│   │   ├── SplitExpense.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── dashboardRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx
│   │   ├── pages/
│   │   │   ├── Analytics.jsx
│   │   │   ├── AutoPay.jsx
│   │   │   ├── Bills.jsx
│   │   │   ├── Expenses.jsx
│   │   │   ├── Income.jsx
│   │   │   ├── MySpace.jsx
│   │   │   ├── ResourcePage.jsx
│   │   │   ├── SavingsGoals.jsx
│   │   │   └── SplitExpenses.jsx
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🗄️ Database

FinMate uses MongoDB with the local database name `finmate`.

The Mongoose models map to these collections:

- **users** – User identity, account type, and hashed password.
- **incomes** – Income amount, source, date, description, and recurring-income fields.
- **expenses** – Expense amount, category, date, and description.
- **goals** – Savings goal name, target amount, current amount, target date, and description.
- **bills** – Bill name, amount, due date, category, reminder days, and status.
- **autopays** – Recurring payment name, amount, frequency, next payment date, and category.
- **splitexpenses** – Shared expense title, total amount, members, split type, and status.
- **notes** – Personal note title, content, category, priority, pin state, and reminder date.

## 🔐 Authentication

```text
Registration
    ↓
Password hashing with bcryptjs
    ↓
User saved in MongoDB
    ↓
Login
    ↓
JWT issued to the frontend
    ↓
Protected routes verify the JWT
```

Protected financial records are associated with the authenticated user's `userId`. Update and delete operations also check that ownership value.

## ⚙️ Environment Variables

Create `backend/.env` locally:

```env
MONGO_URI=mongodb://127.0.0.1:27017/finmate
JWT_SECRET=your_secret_key
PORT=5000
```

Do not commit `.env` files or real secrets to GitHub. The repository includes `backend/.env.example` as a template.

## 🚀 Installation & Setup

### Clone

```bash
git clone <repository-url>
cd FinMate
```

### Backend

Make sure MongoDB is running locally first.

```bash
cd backend
npm install
npm run dev
```

The API runs on `http://localhost:5000` by default.

### Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend uses `http://localhost:5000/api` by default. Set `VITE_API_URL` if the backend runs at another address.

## 🔄 Application Flow

```text
User
  ↓
React Frontend
  ↓
Fetch API requests
  ↓
Express REST API
  ↓
JWT Authentication Middleware
  ↓
Mongoose Models
  ↓
MongoDB
```

## 📊 Dashboard

The dashboard uses data returned from the backend and currently shows:

- Total Income
- Total Expenses
- Savings = Total Income - Total Expenses
- Current Balance based on recorded income and expenses
- Expense category breakdown
- Income versus expense visual summary
- Savings goals
- Recent transactions
- Upcoming bills
- Date-based daily money tips

New users begin with empty financial data. Dashboard values are not seeded with fake transactions.

## 📌 Planned Features

The following are future ideas and are not currently implemented:

- AI spending insights
- AI budget recommendations
- Receipt and OCR scanning
- Bank statement import
- PDF financial reports
- Advanced recurring transaction automation
- Detailed profile editing and settings controls
- Full bill-paid-to-expense confirmation workflow

## 🧪 Testing

Run the frontend and backend using the setup commands above. The frontend production build can be checked with:

```bash
cd frontend
npm run build
npm run lint
```

The backend syntax check can be run with:

```bash
cd backend
npm test
```

Postman can be used to test the REST endpoints. Authenticated requests should include:

```text
Authorization: Bearer <jwt-token>
```

## 🔒 Security Notes

- Passwords are hashed with bcryptjs before being stored.
- JWT is used to protect authenticated API routes.
- User-specific records include `userId` and ownership is checked for protected operations.
- Environment secrets should not be committed to GitHub.

## 👨‍💻 Future Development

FinMate uses a simple route, controller, model, and component structure so additional financial modules and analytics features can be added later without changing the core application flow.

## 📄 License

License: To be added.
