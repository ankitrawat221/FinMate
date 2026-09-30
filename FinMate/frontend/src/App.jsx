import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  NavLink,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import AutoPay from "./pages/AutoPay";
import AnalyticsPage from "./pages/Analytics";
import Bills from "./pages/Bills";
import Expenses from "./pages/Expenses";
import Income from "./pages/Income";
import MySpace from "./pages/MySpace";
import SavingsGoals from "./pages/SavingsGoals";
import SplitExpenses from "./pages/SplitExpenses";
import "./App.css";
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const tips = [
  "Saving ₹500 every week can add up to ₹26,000 in a year.",
  "Before buying something, ask whether it is a need or a want.",
  "Small savings today help you reach bigger goals tomorrow.",
  "Give every rupee a job: spend, save, or share it intentionally.",
];
const nav = [
  ["dashboard", "Overview", "⌂"],
  ["income", "Income", "↗"],
  ["expenses", "Expenses", "↘"],
  ["goals", "Savings goals", "◎"],
  ["bills", "Bills & reminders", "▣"],
  ["autopay", "AutoPay", "↻"],
  ["split-expenses", "Split expenses", "♧"],
  ["analytics", "Analytics", "▥"],
  ["notes", "My space", "✎"],
];
const money = (v) =>
  `₹${Number(v || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const routeForPage = {
  dashboard: "/dashboard",
  income: "/income",
  expenses: "/expenses",
  goals: "/savings-goals",
  bills: "/bills",
  autopay: "/autopay",
  "split-expenses": "/split-expenses",
  analytics: "/analytics",
  notes: "/my-space",
  profile: "/profile",
  settings: "/settings",
};
async function api(path, options = {}) {
  const token = localStorage.getItem("finmate_token");
  const r = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw Error(d.message || "Something went wrong");
  return d;
}
export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("finmate_user") || "null"),
  );
  const [authPage, setAuthPage] = useState("login");
  const [dark, _setDark] = useState(
    localStorage.getItem("finmate_dark") === "true",
  );
  const navigate = useNavigate();
  const setPage = (page) => navigate(routeForPage[page] || page);

  useEffect(() => {
    document.body.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("finmate_dark", dark);
  }, [dark]);

  if (!user) {
    return (
      <Auth
        page={authPage}
        setPage={setAuthPage}
        onLogin={(result) => {
          localStorage.setItem("finmate_token", result.token);
          localStorage.setItem("finmate_user", JSON.stringify(result.user));
          setUser(result.user);
          navigate("/dashboard");
        }}
      />
    );
  }

  return (
    <Routes>
      <Route
        element={
          <DashboardLayout
            user={user}
            logout={() => {
              localStorage.clear();
              setUser(null);
              navigate("/dashboard");
            }}
          />
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route
          path="dashboard"
          element={<Dashboard user={user} setPage={setPage} />}
        />
        <Route path="income" element={<Income />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="savings-goals" element={<SavingsGoals />} />
        <Route path="bills" element={<Bills />} />
        <Route path="autopay" element={<AutoPay />} />
        <Route path="split-expenses" element={<SplitExpenses />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="my-space" element={<MySpace />} />
        <Route
          path="profile"
          element={
            <SimplePage
              title="Profile"
              subtitle="Review your FinMate profile details."
            />
          }
        />
        <Route
          path="settings"
          element={
            <SimplePage
              title="Settings"
              subtitle="Manage your FinMate preferences."
            />
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function LegacyAppContent() {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("finmate_user") || "null"),
  );
  const [authPage, setAuthPage] = useState("login");
  const [dark, _setDark] = useState(
    localStorage.getItem("finmate_dark") === "true",
  );
  useEffect(() => {
    document.body.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("finmate_dark", dark);
  }, [dark]);

  const navigate = useNavigate();
  const setPage = (page) => navigate(routeForPage[page] || page);

  if (!user)
    return (
      <Auth
        page={authPage}
        setPage={setAuthPage}
        onLogin={(x) => {
          localStorage.setItem("finmate_token", x.token);
          localStorage.setItem("finmate_user", JSON.stringify(x.user));
          setUser(x.user);
          navigate("/dashboard");
        }}
      />
    );
  return (
    <div className="app-shell">
      <Sidebar
        logout={() => {
          localStorage.clear();
          setUser(null);
          navigate("/dashboard");
        }}
      />
      <main className="main">
        <Topbar user={user} setPage={setPage} />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={<Dashboard user={user} setPage={setPage} />}
            />
            <Route
              path="/income"
              element={
                <CrudPage
                  resource="income"
                  title="Income"
                  subtitle="Keep your finances organized and easy to understand."
                  fields={["amount", "source", "date", "description"]}
                />
              }
            />
            <Route
              path="/expenses"
              element={
                <CrudPage
                  resource="expenses"
                  title="Expenses"
                  subtitle="Keep your finances organized and easy to understand."
                  fields={["amount", "category", "date", "description"]}
                />
              }
            />
            <Route
              path="/savings-goals"
              element={
                <CrudPage
                  resource="goals"
                  title="Savings goals"
                  subtitle="Keep your finances organized and easy to understand."
                  fields={[
                    "name",
                    "targetAmount",
                    "currentAmount",
                    "targetDate",
                    "description",
                  ]}
                />
              }
            />
            <Route
              path="/bills"
              element={
                <CrudPage
                  resource="bills"
                  title="Bills & reminders"
                  subtitle="Keep your finances organized and easy to understand."
                  fields={["name", "amount", "dueDate", "category"]}
                />
              }
            />
            <Route
              path="/autopay"
              element={
                <CrudPage
                  resource="autopay"
                  title="AutoPay"
                  subtitle="Keep your finances organized and easy to understand."
                  fields={[
                    "name",
                    "amount",
                    "frequency",
                    "nextPaymentDate",
                    "category",
                  ]}
                />
              }
            />
            <Route
              path="/split-expenses"
              element={
                <CrudPage
                  resource="split-expenses"
                  title="Split expenses"
                  subtitle="Keep your finances organized and easy to understand."
                  fields={["title", "totalAmount", "members"]}
                />
              }
            />
            <Route path="/analytics" element={<Analytics />} />
            <Route
              path="/my-space"
              element={
                <CrudPage
                  resource="notes"
                  title="My space"
                  subtitle="Keep your finances organized and easy to understand."
                  fields={["title", "content", "category", "priority"]}
                />
              }
            />
            <Route
              path="/profile"
              element={
                <SimplePage
                  title="Profile"
                  subtitle="Review your FinMate profile details."
                />
              }
            />
            <Route
              path="/settings"
              element={
                <SimplePage
                  title="Settings"
                  subtitle="Manage your FinMate preferences."
                />
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
function Auth({ page, setPage, onLogin }) {
  const [f, setF] = useState({
    name: "",
    email: "",
    password: "",
    accountType: "Student",
  });
  const [error, setError] = useState("");
  async function submit(e) {
    e.preventDefault();
    try {
      onLogin(
        await api(`/auth/${page === "login" ? "login" : "register"}`, {
          method: "POST",
          body: JSON.stringify(f),
        }),
      );
    } catch (x) {
      setError(x.message);
    }
  }
  return (
    <div className="auth-page">
      <div className="auth-brand">
        <div className="brand-mark">F</div>
        <span>
          Fin<span>Mate</span>
        </span>
      </div>
      <div className="auth-card">
        <div className="eyebrow">PERSONAL FINANCE, MADE CLEAR</div>
        <h1>
          {page === "login" ? "Welcome back." : "Start your money journey."}
        </h1>
        <p className="muted">
          {page === "login"
            ? "Pick up where you left off."
            : "Build better habits, one small step at a time."}
        </p>
        <form onSubmit={submit}>
          {page === "register" && (
            <>
              <input
                required
                placeholder="Full name"
                value={f.name}
                onChange={(e) => setF({ ...f, name: e.target.value })}
              />
              <select
                value={f.accountType}
                onChange={(e) => setF({ ...f, accountType: e.target.value })}
              >
                <option>Student</option>
                <option>Young Professional</option>
                <option>Other</option>
              </select>
            </>
          )}
          <input
            required
            type="email"
            placeholder="Email address"
            value={f.email}
            onChange={(e) => setF({ ...f, email: e.target.value })}
          />
          <input
            required
            minLength="6"
            type="password"
            placeholder="Password (6+ characters)"
            value={f.password}
            onChange={(e) => setF({ ...f, password: e.target.value })}
          />
          {error && <div className="form-error">{error}</div>}
          <button className="primary full">
            {page === "login" ? "Sign in →" : "Create account →"}
          </button>
        </form>
        <p className="switch">
          {page === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setPage(page === "login" ? "register" : "login");
              setError("");
            }}
          >
            {page === "login" ? "Register" : "Sign in"}
          </button>
        </p>
      </div>
      <div className="auth-note">Your finances, in one considered place.</div>
    </div>
  );
}
function Sidebar({ logout }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">F</div>
        <span>
          Fin<span>Mate</span>
        </span>
      </div>
      <div className="side-label">WORKSPACE</div>
      <nav>
        {nav.map(([id, name, icon]) => (
          <NavLink
            to={routeForPage[id]}
            className={({ isActive }) => (isActive ? "active" : "")}
            key={id}
          >
            <i>{icon}</i>
            {name}
          </NavLink>
        ))}
      </nav>
      <div className="side-bottom">
        <NavLink
          to="/profile"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <i>◉</i>Profile
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <i>⚙</i>Settings
        </NavLink>
        <button onClick={logout}>
          <i>↪</i>Log out
        </button>
      </div>
    </aside>
  );
}
function Topbar({ user, setPage }) {
  return (
    <header className="topbar">
      <div className="mobile-brand">
        <div className="brand-mark">F</div>
        <b>
          Fin<span>Mate</span>
        </b>
      </div>
      <div className="search">
        ⌕ <input placeholder="Search anything..." />
      </div>
      <div className="top-actions">
        <span className="date-chip">September 2026⌄</span>
        <span className="bell">♧</span>
        <button className="user-chip" onClick={() => setPage("profile")}>
          <span className="avatar">{user.name?.[0] || "U"}</span>
          <span className="user-meta">
            <b>{user.name}</b>
            <small>{user.accountType}</small>
          </span>
        </button>
      </div>
    </header>
  );
}
function Dashboard({ user, setPage }) {
  const [d, setD] = useState(null);
  const [err, setErr] = useState("");
  useEffect(() => {
    api("/dashboard/summary")
      .then(setD)
      .catch((e) => setErr(e.message));
  }, []);
  if (err)
    return (
      <Empty
        title="Connect your workspace"
        text="Start the backend and MongoDB, then refresh to see your live dashboard."
      />
    );
  if (!d)
    return (
      <div className="loading">
        Loading<span>•••</span>
      </div>
    );
  const cats = Object.entries(d.categories || {});
  return (
    <>
      <section className="welcome">
        <div>
          <div className="eyebrow">YOUR FINANCIAL OVERVIEW</div>
          <h1>
            Good morning, {user.name?.split(" ")[0]}{" "}
            <span className="wave">✦</span>
          </h1>
          <p className="muted">
            Here is what is happening with your money today.
          </p>
        </div>
        <button className="primary" onClick={() => setPage("expenses")}>
          + Add expense
        </button>
      </section>
      <section className="tip-card">
        <div className="tip-icon">✦</div>
        <div>
          <b>Money tip of the day</b>
          <p>{tips[new Date().getDate() % tips.length]}</p>
        </div>
        <span className="tip-arrow">↗</span>
      </section>
      <div className="stats-grid">
        <Stat
          title="Total income"
          amount={d.totalIncome}
          icon="↗"
          tone="green"
          note="All time recorded"
        />
        <Stat
          title="Total expenses"
          amount={d.totalExpenses}
          icon="↘"
          tone="orange"
          note="All time recorded"
        />
        <Stat
          title="Total savings"
          amount={d.totalSavings}
          icon="◎"
          tone="blue"
          note="Income minus expenses"
        />
        <Stat
          title="Current balance"
          amount={d.balance}
          icon="◈"
          tone="purple"
          note="Available overview"
        />
      </div>
      <div className="dashboard-grid">
        <section className="card chart-card">
          <Head title="Spending breakdown" action="This month⌄" />
          <div className="donut-wrap">
            <div className="donut">
              <div>
                <strong>{money(d.totalExpenses)}</strong>
                <small>spent</small>
              </div>
            </div>
            <div className="legend">
              {cats.length ? (
                cats.slice(0, 5).map(([k, v], i) => (
                  <div key={k}>
                    <span className={`dot d${i}`} />
                    {k}
                    <b>{money(v)}</b>
                  </div>
                ))
              ) : (
                <p className="muted">
                  Add your first expense to see a breakdown.
                </p>
              )}
            </div>
          </div>
        </section>
        <section className="card chart-card">
          <Head title="Income vs expenses" action="Last 6 months⌄" />
          <div className="bars">
            {["Apr", "May", "Jun", "Jul", "Aug", "Sep"].map((m, i) => (
              <div className="bar-group" key={m}>
                <div className="bars-inner">
                  <span style={{ height: `${20 + i * 9}%` }} />
                  <em style={{ height: `${12 + i * 5}%` }} />
                </div>
                <small>{m}</small>
              </div>
            ))}
          </div>
          <div className="chart-key">
            <span>
              <i className="income-key" />
              Income
            </span>
            <span>
              <i className="expense-key" />
              Expenses
            </span>
          </div>
        </section>
      </div>
      <div className="lower-grid">
        <section className="card">
          <Head
            title="Recent transactions"
            action="View all →"
            onClick={() => setPage("expenses")}
          />
          {d.recentTransactions.length ? (
            d.recentTransactions.map((t) => (
              <div className="transaction" key={t._id}>
                <div className={`transaction-icon ${t.kind}`}>
                  {t.kind === "income" ? "↗" : "↘"}
                </div>
                <div>
                  <b>{t.description || t.source || t.category}</b>
                  <small>
                    {new Date(t.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </small>
                </div>
                <strong className={t.kind}>
                  {t.kind === "income" ? "+" : "−"}
                  {money(t.amount)}
                </strong>
              </div>
            ))
          ) : (
            <Empty
              compact
              title="No transactions yet"
              text="Add income or expenses to bring your overview to life."
            />
          )}
        </section>
        <section className="card">
          <Head
            title="Savings goals"
            action="Manage →"
            onClick={() => setPage("goals")}
          />
          {d.goals.length ? (
            d.goals.slice(0, 3).map((g) => <Goal key={g._id} g={g} />)
          ) : (
            <Empty
              compact
              title="No goals yet"
              text="Give your next milestone a name and a number."
            />
          )}
        </section>
        <section className="card">
          <Head
            title="Upcoming bills"
            action="View all →"
            onClick={() => setPage("bills")}
          />
          {d.upcomingBills.length ? (
            d.upcomingBills.map((b) => (
              <div className="bill-row" key={b._id}>
                <div>
                  <b>{b.name}</b>
                  <small>
                    Due{" "}
                    {new Date(b.dueDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </small>
                </div>
                <strong>{money(b.amount)}</strong>
              </div>
            ))
          ) : (
            <Empty
              compact
              title="All clear"
              text="No upcoming bills recorded."
            />
          )}
        </section>
      </div>
    </>
  );
}
function Stat({ title, amount, icon, tone, note }) {
  return (
    <div className="stat card">
      <div className={`stat-icon ${tone}`}>{icon}</div>
      <div>
        <small>{title}</small>
        <h2>{money(amount)}</h2>
        <span className="stat-note">{note}</span>
      </div>
    </div>
  );
}
function Head({ title, action, onClick }) {
  return (
    <div className="card-head">
      <h3>{title}</h3>
      {action && <button onClick={onClick}>{action}</button>}
    </div>
  );
}
function Goal({ g }) {
  const p = Math.min(
    100,
    Math.round((g.currentAmount / g.targetAmount) * 100) || 0,
  );
  return (
    <div className="goal-row">
      <div className="goal-top">
        <span className="goal-emoji">◎</span>
        <div>
          <b>{g.name}</b>
          <small>
            {money(g.currentAmount)} of {money(g.targetAmount)}
          </small>
        </div>
        <strong>{p}%</strong>
      </div>
      <div className="progress">
        <span style={{ width: `${p}%` }} />
      </div>
    </div>
  );
}
function Empty({ title, text, compact }) {
  return (
    <div className={`empty ${compact ? "compact" : ""}`}>
      <div className="empty-icon">○</div>
      <b>{title}</b>
      <p>{text}</p>
    </div>
  );
}

function SimplePage({ title, subtitle }) {
  return (
    <section className="page-heading">
      <div>
        <div className="eyebrow">FINMATE WORKSPACE</div>
        <h1>{title}</h1>
        <p className="muted">{subtitle}</p>
      </div>
    </section>
  );
}

function CrudPage({ resource, title, subtitle, fields }) {
  const [items, setItems] = useState(null);
  const [form, setForm] = useState({});
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const load = () =>
    api(`/${resource}`)
      .then(setItems)
      .catch((e) => setError(e.message));
  useEffect(load, [resource]);
  async function save(e) {
    e.preventDefault();
    try {
      const p = { ...form };
      if (p.amount) p.amount = Number(p.amount);
      if (p.targetAmount) p.targetAmount = Number(p.targetAmount);
      if (p.currentAmount) p.currentAmount = Number(p.currentAmount);
      if (resource === "split-expenses")
        p.members = String(p.members || "")
          .split(",")
          .map((name) => ({ name: name.trim(), amountOwed: 0, paid: false }));
      await api(`/${resource}`, { method: "POST", body: JSON.stringify(p) });
      setForm({});
      setShow(false);
      load();
    } catch (e) {
      setError(e.message);
    }
  }
  async function remove(id) {
    if (confirm("Delete this record?")) {
      await api(`/${resource}/${id}`, { method: "DELETE" });
      load();
    }
  }
  return (
    <>
      <section className="page-heading">
        <div>
          <div className="eyebrow">FINMATE WORKSPACE</div>
          <h1>{title}</h1>
          <p className="muted">{subtitle}</p>
        </div>
        <button className="primary" onClick={() => setShow(true)}>
          + Add {title.replace(" & reminders", "").replace(" goals", " goal")}
        </button>
      </section>
      {error && <div className="form-error">{error}</div>}
      <section className="card table-card">
        {!items ? (
          <div className="loading">
            Loading<span>•••</span>
          </div>
        ) : items.length === 0 ? (
          <Empty
            title={`No ${title.toLowerCase()} yet`}
            text="Use the button above to add your first record."
          />
        ) : (
          <div className="records">
            {items.map((x) => (
              <div className="record" key={x._id}>
                <div className="record-main">
                  <div className="record-icon">
                    {resource === "income"
                      ? "↗"
                      : resource === "expenses"
                        ? "↘"
                        : resource === "bills"
                          ? "▣"
                          : resource === "autopay"
                            ? "↻"
                            : resource === "notes"
                              ? "✎"
                              : "◎"}
                  </div>
                  <div>
                    <b>{x.title || x.name || x.source || x.category}</b>
                    <small>
                      {x.description ||
                        x.content ||
                        x.category ||
                        x.frequency ||
                        "Personal finance record"}
                    </small>
                  </div>
                </div>
                <strong>
                  {x.amount
                    ? money(x.amount)
                    : x.totalAmount
                      ? money(x.totalAmount)
                      : ""}
                </strong>
                <button className="delete" onClick={() => remove(x._id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
      {show && (
        <div className="modal-backdrop">
          <form className="modal" onSubmit={save}>
            <Head
              title={`New ${title}`}
              action="×"
              onClick={() => setShow(false)}
            />
            {fields.map((f) => (
              <label key={f}>
                {f.replace(/([A-Z])/g, " $1")}
                <input
                  required={[
                    "amount",
                    "name",
                    "title",
                    "source",
                    "category",
                  ].includes(f)}
                  type={
                    f.toLowerCase().includes("date")
                      ? "date"
                      : f === "amount" ||
                          f === "targetAmount" ||
                          f === "currentAmount"
                        ? "number"
                        : "text"
                  }
                  value={form[f] || ""}
                  onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                />
              </label>
            ))}
            <button className="primary full">Save record</button>
          </form>
        </div>
      )}
    </>
  );
}
function Analytics() {
  const [d, setD] = useState(null);
  useEffect(() => {
    api("/dashboard/analytics").then(setD);
  }, []);
  function csv() {
    if (!d) return;
    const rows = [
      ["Type", "Amount", "Category/Source", "Date"],
      ...d.income.map((x) => ["Income", x.amount, x.source, x.date]),
      ...d.expenses.map((x) => ["Expense", x.amount, x.category, x.date]),
    ];
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([rows.map((x) => x.join(",")).join("\n")], { type: "text/csv" }),
    );
    a.download = "finmate-analytics.csv";
    a.click();
  }
  const inc = d?.income.reduce((a, x) => a + x.amount, 0);
  const exp = d?.expenses.reduce((a, x) => a + x.amount, 0);
  return (
    <>
      <section className="page-heading">
        <div>
          <div className="eyebrow">YOUR NUMBERS, EXPLAINED</div>
          <h1>Analytics</h1>
          <p className="muted">See patterns in the data you have recorded.</p>
        </div>
        <button className="secondary" onClick={csv}>
          ↓ Export CSV
        </button>
      </section>
      <div className="stats-grid">
        <Stat
          title="Total income"
          amount={inc}
          icon="↗"
          tone="green"
          note="Recorded income"
        />
        <Stat
          title="Total expenses"
          amount={exp}
          icon="↘"
          tone="orange"
          note="Recorded expenses"
        />
        <Stat
          title="Savings rate"
          amount={inc ? (((inc - exp) / inc) * 100).toFixed(0) : 0}
          icon="%"
          tone="blue"
          note="Based on recorded data"
        />
        <Stat
          title="Transactions"
          amount={(d?.income.length || 0) + (d?.expenses.length || 0)}
          icon="#"
          tone="purple"
          note="Total records"
        />
      </div>
      <section className="card analytics-card">
        <Head title="Monthly expenses" action="Last 6 months⌄" />
        {d ? (
          <div className="analytics-bars">
            {Object.entries(d.monthlyExpenses).length ? (
              Object.entries(d.monthlyExpenses).map(([m, v]) => (
                <div key={m}>
                  <span
                    style={{
                      height: `${Math.max(8, (v / Math.max(...Object.values(d.monthlyExpenses))) * 100)}%`,
                    }}
                  />
                  <small>{m}</small>
                  <b>{money(v)}</b>
                </div>
              ))
            ) : (
              <Empty
                title="Not enough data yet"
                text="Add a few expenses to see useful patterns."
              />
            )}
          </div>
        ) : (
          <div className="loading">
            Loading<span>•••</span>
          </div>
        )}
      </section>
    </>
  );
}
