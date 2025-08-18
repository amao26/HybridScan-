import React, { useState } from "react";

function DBScanPage() {
  const [host, setHost] = useState("");
  const [databases, setDatabases] = useState([]);

  const handleScan = () => {
    setDatabases([
      { db: "MySQL", status: "Exposed" },
      { db: "Postgres", status: "Safe" },
    ]);
  };

  return (
    <div className="main">
      <div className="card">
        <h2>📂 Database Exposure Scan</h2>
        <div className="form-row">
          <input
            className="input"
            placeholder="Enter host"
            value={host}
            onChange={(e) => setHost(e.target.value)}
          />
          <button className="btn" onClick={handleScan}>Check</button>
        </div>
      </div>
      {databases.length > 0 && (
        <div className="card">
          <h3>Databases</h3>
          <ul className="history-list">
            {databases.map((db, i) => (
              <li key={i} className="history-item">
                {db.db} - {db.status}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default DBScanPage;