import React, { useState } from "react";

function WebVulnPage() {
  const [url, setUrl] = useState("");
  const [findings, setFindings] = useState([]);

  const handleCheck = () => {
    setFindings([
      { vuln: "SQL Injection", severity: "high" },
      { vuln: "XSS", severity: "med" },
    ]);
  };

  return (
    <div className="main">
      <div className="card">
        <h2>🛡️ Web Vulnerability Scan</h2>
        <div className="form-row">
          <input
            className="input"
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button className="btn" onClick={handleCheck}>Scan</button>
        </div>
      </div>
      {findings.length > 0 && (
        <div className="card">
          <h3>Vulnerabilities</h3>
          <table className="table">
            <thead>
              <tr><th>Vulnerability</th><th>Severity</th></tr>
            </thead>
            <tbody>
              {findings.map((f, i) => (
                <tr key={i}>
                  <td>{f.vuln}</td>
                  <td><span className={`badge badge-${f.severity}`}>{f.severity}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default WebVulnPage;