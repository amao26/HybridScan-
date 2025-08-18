import React, { useState } from "react";

export default function NmapPage() {
  const [target, setTarget] = useState("");
  const [results, setResults] = useState("");

  const handleScan = () => {
    setResults(`Nmap scan report for ${target || "192.168.0.1"}
Host is up (0.001s latency).
Not shown: 996 closed ports
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https`);
  };

  return (
    <div className="main">
      <div className="card">
        <h2>🔍 Nmap Scanner</h2>
        <div className="form-row">
          <input
            className="input"
            placeholder="Enter target"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
          <button className="btn" onClick={handleScan}>Run Scan</button>
        </div>
      </div>
      {results && (
        <div className="card">
          <h3>Results</h3>
          <pre className="results-pre">{results}</pre>
        </div>
      )}
    </div>
  );
}