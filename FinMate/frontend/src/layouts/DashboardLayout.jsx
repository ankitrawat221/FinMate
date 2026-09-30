import { NavLink, Outlet, useNavigate } from "react-router-dom";

const navigation = [
  ["dashboard", "Overview", "⌂"],
  ["income", "Income", "↗"],
  ["expenses", "Expenses", "↘"],
  ["savings-goals", "Savings Goals", "◎"],
  ["bills", "Bills & Reminders", "▣"],
  ["autopay", "AutoPay", "↻"],
  ["split-expenses", "Split Expenses", "♧"],
  ["analytics", "Analytics", "▥"],
  ["my-space", "My Space", "✎"],
];

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
        {navigation.map(([path, name, icon]) => (
          <NavLink
            key={path}
            to={`/${path}`}
            className={({ isActive }) => (isActive ? "active" : "")}
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
        <button type="button" onClick={logout}>
          <i>↪</i>Logout
        </button>
      </div>
    </aside>
  );
}

function Topbar({ user }) {
  const navigate = useNavigate();

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
        <button
          type="button"
          className="user-chip"
          onClick={() => navigate("/profile")}
        >
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

export default function DashboardLayout({ user, logout }) {
  return (
    <div className="app-shell">
      <Sidebar logout={logout} />
      <main className="main">
        <Topbar user={user} />
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
