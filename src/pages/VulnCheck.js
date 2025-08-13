import React, { useState } from 'react';

export default function VulnCheck() {
  const [target, setTarget] = useState('');
  const [output, setOutput] = useState('No scan started.');
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (!target) {
      alert('Please enter a target!');
      return;
    }

    setLoading(true);
    setOutput('Scanning for vulnerabilities...');

    try {
      // ==========================
      // API HERE: Call your backend API or Docker container
      // Example:
      // const response = await fetch('http://localhost:5000/vulncheck', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ target }),
      // });
      // const data = await response.json();
      // setOutput(data.vulnerabilities.join('\n'));
      // ==========================

      // Temporary placeholder
      setTimeout(() => {
        setOutput(`Vulnerability scan completed for ${target}:\n- CVE-2021-12345: Medium\n- CVE-2022-67890: Low`);
        setLoading(false);
      }, 2000);

    } catch (error) {
      setOutput(`Error: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Vuln Check Input Card */}
      <div className="card">
        <h3>Scan for Vulnerabilities</h3>
        <div className="form-row">
          <input
            className="input"
            placeholder="Enter target IP or domain"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
          <button className="btn" onClick={handleScan} disabled={loading}>
            {loading ? 'Scanning...' : 'Start Scan'}
          </button>
        </div>
      </div>

      {/* Output Card */}
      <div className="card">
        <h4>Results</h4>
        <div className="results-pre">{output}</div>
      </div>
    </div>
  );
}
