import { useState } from "react";
import RecordForm from "./components/RecordForm";
import RecordTable from "./components/RecordTable";

export default function App() {
  const [refresh, setRefresh] = useState(0);
  const [editing, setEditing] = useState(null);

  return (
    <div className="container">
      <h1>company.com</h1>
      <div className="grid">
        <div className="left">
          <RecordForm
            editing={editing}
            onSaved={() => {
              setRefresh((r) => r + 1);
              setEditing(null); 
            }}
            onCancel={() => setEditing(null)}
          />
        </div>
        <div className="right">
          <RecordTable
            refresh={refresh}
            onEdit={(record) => setEditing(record)} 
          />
        </div>
      </div>
    </div>
  );
}
