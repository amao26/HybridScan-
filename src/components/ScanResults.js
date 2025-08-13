import React from 'react';

export default function ScanResults({ outputs }) {
  return (
    <div className="card">
      <div className="header-row">
        <h3>Latest Results</h3>
      </div>
      {outputs.length === 0 && <div style={{color:'#9aa0a6'}}>No results yet.</div>}
      {outputs.map((o, idx) => (
        <div key={idx} style={{marginBottom:12}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div><strong>{o.tool.toUpperCase()}</strong> - {o.target}</div>
            <div style={{fontSize:12,color:'#9aa0a6'}}>{new Date().toLocaleString()}</div>
          </div>
          <pre className="results-pre">{o.output}</pre>
        </div>
      ))}
    </div>
  );
}
