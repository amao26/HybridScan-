import React from 'react';

export default function About() {
  return (
    <div className="about">
      <h1>About HybridScan</h1>
      <div className="card">
        <p>HybridScan demo dashboard. This frontend includes a Scan Control Panel, Target Input, Results, and History UI.</p>
        <p>
          To connect to your Flask backend, implement <code>POST /api/start</code> returning JSON &#123; output: '...' &#125;.
        </p>
      </div>
    </div>
  );
}
