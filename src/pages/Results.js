import React, { useState } from 'react';

export default function Results() {
  const [results, setResults] = useState('No scan results yet.');

  const handleLoadResults = async () => {
    // ==========================
    // API HERE: Fetch scan results from backend or Docker
    // Example:
    // const response = await fetch('http://localhost:5000/results');
    // const data = await response.json();
    // setResults(data.results);
    // ==========================

    // Temporary placeholder
    setResults(`Scan results:\n- Target: example.com\n- CVE-2023-12345: High\n- CVE-2022-98765: Medium`);
  };

  return (
    <div>
      <div className="card">
        <h3>Scan Results</h3>
        <button className="btn" onClick={handleLoadResults}>Load Results</button>
      </div>

      <div className="card">
        <pre className="results-pre">{results}</pre>
      </div>
    </div>
  );
}
