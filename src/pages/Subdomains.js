import React, { useState } from 'react';

export default function Subdomains() {
  const [domain, setDomain] = useState('');
  const [output, setOutput] = useState('No scan started.');
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (!domain) {
      alert('Please enter a domain!');
      return;
    }

    setLoading(true);
    setOutput('Scanning for subdomains...');

    try {
      // ==========================
      // API HERE: Call your backend API or Docker container
      // Example:
      // const response = await fetch('http://localhost:5000/subdomains', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ domain }),
      // });
      // const data = await response.json();
      // setOutput(data.subdomains.join('\n'));
      // ==========================

      // Temporary placeholder
      setTimeout(() => {
        setOutput(`Found subdomains for ${domain}:\n- www.${domain}\n- api.${domain}\n- dev.${domain}`);
        setLoading(false);
      }, 1500);

    } catch (error) {
      setOutput(`Error: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Subdomain Scan Input Card */}
      <div className="card">
        <h3>Discover Subdomains</h3>
        <div className="form-row">
          <input
            className="input"
            placeholder="Enter domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
          <button className="btn" onClick={handleScan} disabled={loading}>
            {loading ? 'Scanning...' : 'Scan'}
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
