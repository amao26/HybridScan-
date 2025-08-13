import React, { useState } from 'react';

export default function Attack() {
  const [target, setTarget] = useState('');
  const [tool, setTool] = useState('Nmap');
  const [output, setOutput] = useState('No scan started.');
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (!target) {
      alert('Please enter a target!');
      return;
    }

    setLoading(true);
    setOutput('Scanning...');

    try {
      // ==========================
      // API HERE: Call your backend API or Docker container
      // Example:
      // const response = await fetch('http://localhost:5000/scan', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ target, tool }),
      // });
      // const data = await response.json();
      // setOutput(data.result);
      // ==========================

      // Temporary placeholder
      setTimeout(() => {
        setOutput(`Scan completed for ${target} with ${tool}.\nNo vulnerabilities found (placeholder).`);
        setLoading(false);
      }, 1500);

    } catch (error) {
      setOutput(`Error: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Scan Input Card */}
      <div className="card">
        <h3>Run Port Scan</h3>
        <div className="form-row">
          <input
            className="input"
            placeholder="Enter target IP or domain"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
          <select
            className="select"
            value={tool}
            onChange={(e) => setTool(e.target.value)}
          >
            <option value="Nmap">Nmap</option>
            <option value="Other Tool">Other Tool</option>
          </select>
          <button className="btn" onClick={handleScan} disabled={loading}>
            {loading ? 'Scanning...' : 'Start Scan'}
          </button>
        </div>
      </div>

      {/* Output Card */}
      <div className="card">
        <h4>Scan Output</h4>
        <div className="results-pre">{output}</div>
      </div>
    </div>
  );
}
