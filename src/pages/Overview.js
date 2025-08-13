import React from 'react';

export default function Overview() {
  return (
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px'}}>
      
      <div className="card">
        <h4>Total Vulns Found</h4>
        <div style={{fontSize: 28, fontWeight: 700, marginTop: 8}}>5</div>
      </div>
      
      <div className="card">
        <h4>Open Ports</h4>
        <div style={{fontSize: 28, fontWeight: 700, marginTop: 8}}>12</div>
      </div>
      
      <div className="card">
        <h4>Subdomains</h4>
        <div style={{fontSize: 28, fontWeight: 700, marginTop: 8}}>7</div>
      </div>
      
      <div className="card">
        <h4>Severity Breakdown</h4>
        <div style={{display:'flex', gap:'8px', marginTop:8}}>
          <span className="badge badge-low">Low: 2</span>
          <span className="badge badge-med">Medium: 2</span>
          <span className="badge badge-high">High: 1</span>
        </div>
      </div>

      <div className="card">
        <h4>Last Scan</h4>
        <div style={{marginTop:8}}>example.com — Completed</div>
      </div>

      <div className="card">
        <h4>Running Scans</h4>
        <div style={{marginTop:8}}>
          <div style={{marginBottom:6}}>testsite.local</div>
          <div style={{height:8, background:'#111', borderRadius:4}}>
            <div style={{width:'60%', height:'100%', background:'#00ff99', borderRadius:4}}></div>
          </div>
        </div>
      </div>

    </div>
  );
}
