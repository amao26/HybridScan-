import React from "react";

function ResultsPage() {
  return (
    <div className="main">
      <div className="card">
        <h2>📊 Results Dashboard</h2>
        <p>Here you can view all aggregated results from your scans.</p>
        <ul className="history-list">
          <li className="history-item">Nmap: 3 ports open</li>
          <li className="history-item">Subdomains: 3 found</li>
          <li className="history-item">Web Vulns: SQLi, XSS</li>
          <li className="history-item">Privilege Escalation: Root gained</li>
        </ul>
      </div>
    </div>
  );
}

export default ResultsPage;