import React, { useState } from 'react';

export default function Targets() {
  const [target, setTarget] = useState('');
  const [savedTargets, setSavedTargets] = useState([]);

  const handleAddTarget = async () => {
    if (!target) return;

    // ==========================
    // API HERE: Send the target to backend or Docker
    // Example:
    // await fetch('http://localhost:5000/add-target', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ target }),
    // });
    // ==========================

    setSavedTargets([...savedTargets, target]);
    setTarget('');
  };

  return (
    <div>
      <div className="card">
        <h3>Add Target</h3>
        <div className="form-row">
          <input
            className="input"
            placeholder="Enter IP or domain"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
          <button className="btn" onClick={handleAddTarget}>Add</button>
        </div>
      </div>

      <div className="card">
        <h4>Saved Targets</h4>
        <ul className="history-list">
          {savedTargets.map((t, idx) => (
            <li key={idx} className="history-item">{t}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
