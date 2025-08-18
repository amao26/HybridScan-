import React, { useState } from "react";

function SubdomainPage() {
  const [domain, setDomain] = useState("");
  const [subdomains, setSubdomains] = useState([]);

  const handleScan = () => {
    setSubdomains([
      `api.${domain || "example.com"}`,
      `mail.${domain || "example.com"}`,
      `dev.${domain || "example.com"}`,
    ]);
  };

  return (
    <div className="main">
      <div className="card">
        <h2>🌐 Subdomain Finder</h2>
        <div className="form-row">
          <input
            className="input"
            placeholder="Enter domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
          <button className="btn" onClick={handleScan}>Find</button>
        </div>
      </div>
      {subdomains.length > 0 && (
        <div className="card">
          <h3>Results</h3>
          <ul className="history-list">
            {subdomains.map((s, i) => (
              <li key={i} className="history-item">{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SubdomainPage;