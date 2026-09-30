import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;

async function request(path, options = {}) {
  const token = localStorage.getItem("finmate_token");
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

function EmptyState({ title, text }) {
  return (
    <div className="empty">
      <div className="empty-icon">○</div>
      <b>{title}</b>
      <p>{text}</p>
    </div>
  );
}

export default function ResourcePage({ resource, title, subtitle, fields }) {
  const [items, setItems] = useState(null);
  const [form, setForm] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  async function loadItems() {
    try {
      setError("");
      setItems(await request(`/${resource}`));
    } catch (loadError) {
      setError(loadError.message);
    }
  }

  useEffect(() => {
    loadItems();
  }, [resource]);

  function getFormValues(item) {
    return fields.reduce((values, field) => {
      let value = item[field] ?? "";

      if (field.toLowerCase().includes("date") && value) {
        value = new Date(value).toISOString().slice(0, 10);
      }

      if (field === "members" && Array.isArray(value)) {
        value = value.map((member) => member.name).join(", ");
      }

      values[field] = value;
      return values;
    }, {});
  }

  function openCreateForm() {
    setEditingId(null);
    setForm({});
    setShowForm(true);
  }

  function openEditForm(item) {
    setEditingId(item._id);
    setForm(getFormValues(item));
    setShowForm(true);
  }

  function closeForm() {
    setEditingId(null);
    setForm({});
    setShowForm(false);
  }

  async function saveRecord(event) {
    event.preventDefault();

    try {
      const payload = { ...form };
      ["amount", "targetAmount", "currentAmount", "totalAmount"].forEach(
        (field) => {
          if (payload[field]) payload[field] = Number(payload[field]);
        },
      );

      if (resource === "split-expenses") {
        payload.members = String(payload.members || "")
          .split(",")
          .map((name) => ({ name: name.trim(), amountOwed: 0, paid: false }));
      }

      await request(editingId ? `/${resource}/${editingId}` : `/${resource}`, {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      closeForm();
      await loadItems();
    } catch (saveError) {
      setError(saveError.message);
    }
  }

  async function deleteRecord(id) {
    if (!window.confirm("Delete this record? This cannot be undone.")) return;

    try {
      await request(`/${resource}/${id}`, { method: "DELETE" });
      await loadItems();
    } catch (deleteError) {
      setError(deleteError.message);
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
        <button className="primary" onClick={openCreateForm}>
          + Add {title}
        </button>
      </section>

      {error && <div className="form-error">{error}</div>}

      <section className="card table-card">
        {items === null ? (
          <div className="loading">
            Loading<span>•••</span>
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            title={`No ${title.toLowerCase()} yet`}
            text="Use the button above to add your first record."
          />
        ) : (
          <div className="records">
            {items.map((item) => (
              <div className="record" key={item._id}>
                <div className="record-main">
                  <div className="record-icon">◎</div>
                  <div>
                    <b>
                      {item.title || item.name || item.source || item.category}
                    </b>
                    <small>
                      {item.description ||
                        item.content ||
                        item.category ||
                        item.frequency ||
                        "Personal finance record"}
                    </small>
                  </div>
                </div>
                <strong>
                  {item.amount
                    ? money(item.amount)
                    : item.totalAmount
                      ? money(item.totalAmount)
                      : ""}
                </strong>
                <div className="record-actions">
                  <button
                    type="button"
                    className="edit"
                    onClick={() => openEditForm(item)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="delete"
                    onClick={() => deleteRecord(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {showForm && (
        <div className="modal-backdrop">
          <form className="modal" onSubmit={saveRecord}>
            <div className="card-head">
              <h3>{editingId ? `Edit ${title}` : `New ${title}`}</h3>
              <button type="button" onClick={closeForm}>
                ×
              </button>
            </div>
            {fields.map((field) => (
              <label key={field}>
                {field.replace(/([A-Z])/g, " $1")}
                <input
                  required={[
                    "amount",
                    "name",
                    "title",
                    "source",
                    "category",
                  ].includes(field)}
                  type={
                    field.toLowerCase().includes("date")
                      ? "date"
                      : [
                            "amount",
                            "targetAmount",
                            "currentAmount",
                            "totalAmount",
                          ].includes(field)
                        ? "number"
                        : "text"
                  }
                  value={form[field] || ""}
                  onChange={(event) =>
                    setForm({ ...form, [field]: event.target.value })
                  }
                />
              </label>
            ))}
            <button className="primary full">
              {editingId ? "Save changes" : "Save record"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
