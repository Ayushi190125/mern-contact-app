import React, { useEffect, useMemo, useState } from "react";
import { getRecords } from "../services/api.js";
import EditModal from "./EditModal.jsx";

const HEADERS = [
  { key: "actions", label: "" },
  { key: "first", label: "First Name" },
  { key: "last", label: "Last Name" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "address", label: "Address" },
  { key: "state", label: "State" },
  { key: "district", label: "District" },
  { key: "city", label: "City" },
  { key: "zipCode", label: "Zip Code" },

];

export default function RecordTable({ refresh, onEdit }) {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [editing, setEditing] = useState(null);

  const totalPages = useMemo(() => Math.max(Math.ceil(total / limit), 1), [total, limit]);

  const fetchData = async () => {
    const res = await getRecords({ page, limit, search, sort, order });
    setRows(res.data.records);
    setTotal(res.data.total);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search, sort, order, refresh]);

  const toggleSort = (key) => {
    if (key === "actions") return;
    if (sort === key) setOrder((o) => (o === "asc" ? "desc" : "asc"));
    else { setSort(key); setOrder("asc"); }
  };

  return (

    <div className="card2">
      <h2>Show the List of records</h2>
      <div className="toolbar">
        <input
          className="search"
          placeholder="Search in any column..."
          value={search}
          onChange={(e) => { setPage(1); setSearch(e.target.value); }}
        />
        <div className="spacer" />
        <label>Rows:</label>
        <select value={limit} onChange={(e) => { setPage(1); setLimit(parseInt(e.target.value)); }}>
          {[5, 8, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead className="thread">
            <tr>
              {HEADERS.map(h => (
                <th key={h.key} onClick={() => toggleSort(h.key)}>
                  <span>{h.label}</span>
                  {h.key !== "actions" && (
                    <span className={"sort " + (sort === h.key ? order : "")}>▲</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={HEADERS.length} style={{ textAlign: "center" }}>No data</td></tr>
            )}
            {rows.map(r => (
              <tr key={r._id}>
                <td>
                  <button className="icon" title="Edit" onClick={() => onEdit(r)}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="18"
                    fill="#3B82F6" viewBox="0 0 24 24">
                    <path d="M3 17.25V21h3.75l11-11.02-3.75-3.75L3 17.25zM20.71 
                    7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 
                    0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/>
                  </svg>
                  </button>
                </td>
                <td>{r.first}</td>
                <td>{r.last}</td>
                <td>{r.phone}</td>
                <td>{r.email}</td>
                <td>{r.address}</td>
                <td>{r.state}</td>
                <td>{r.district}</td>
                <td>{r.city}</td>
                <td>{r.zipCode}</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 8, gap: 8 }}>
        <span style={{ fontSize: 13, color: '#555' }}>
          {rows.length > 0 ? `${(page - 1) * limit + 1}-${Math.min(page * limit, total)} of ${total}` : '0 of 0'}
        </span>
        <button
          style={{ border: 'none', background: '#f1f3f9', borderRadius: 4, padding: '2px 8px', cursor: page <= 1 ? 'not-allowed' : 'pointer', color: page <= 1 ? '#ccc' : '#333' }}
          disabled={page <= 1}
          onClick={() => setPage(p => p - 1)}
        >
          &#8592;
        </button>
        <button
          style={{ border: 'none', background: '#f1f3f9', borderRadius: 4, padding: '2px 8px', cursor: page >= totalPages ? 'not-allowed' : 'pointer', color: page >= totalPages ? '#ccc' : '#333' }}
          disabled={page >= totalPages}
          onClick={() => setPage(p => p + 1)}
        >
          &#8594;
        </button>
      </div>

      {editing && (
        <EditModal record={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); fetchData(); }} />
      )}
    </div>
  );
}