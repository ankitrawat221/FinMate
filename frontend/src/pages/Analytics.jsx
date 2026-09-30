import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Analytics() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("finmate_token");
    fetch(`${API}/dashboard/analytics`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then(setData)
      .catch((requestError) => setError(requestError.message));
  }, []);

  return (
    <section className="page-heading">
      <div>
        <div className="eyebrow">YOUR NUMBERS, EXPLAINED</div>
        <h1>Analytics</h1>
        <p className="muted">See patterns in the data you have recorded.</p>
        {error && <div className="form-error">{error}</div>}
        {!data && !error && (
          <div className="loading">
            Loading<span>•••</span>
          </div>
        )}
      </div>
    </section>
  );
}
