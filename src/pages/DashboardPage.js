import React, { useState } from "react";

export default function DashboardPage() {
  // Sample targets with statuses
  const [targets] = useState([
    { id: 1, name: "example.com", status: "Completed", lastScan: "2025-08-15" },
    { id: 2, name: "192.168.1.1", status: "Running", lastScan: "2025-08-17" },
    { id: 3, name: "testsite.org", status: "Failed", lastScan: "2025-08-10" },
  ]);

  const [selectedTarget, setSelectedTarget] = useState(null);

  return (
    <div className="main">
      <div className="card">
        <h2>Dashboard</h2>
        <p>Track status of your scan targets below:</p>

        {/* Target List */}
        <table className="status-table">
          <thead>
            <tr>
              <th>Target</th>
              <th>Status</th>
              <th>Last Scan</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {targets.map((target) => (
              <tr key={target.id}>
                <td>{target.name}</td>
                <td>
                  <span
                    className={`status-badge ${
                      target.status.toLowerCase()
                    }`}
                  >
                    {target.status}
                  </span>
                </td>
                <td>{target.lastScan}</td>
                <td>
                  <button
                    className="btn"
                    onClick={() => setSelectedTarget(target)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selected Target Details */}
      {selectedTarget && (
        <div className="card">
          <h3>📌 Target Details</h3>
          <p><b>Target:</b> {selectedTarget.name}</p>
          <p><b>Status:</b> {selectedTarget.status}</p>
          <p><b>Last Scan:</b> {selectedTarget.lastScan}</p>

          <button
            className="btn"
            onClick={() => setSelectedTarget(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
