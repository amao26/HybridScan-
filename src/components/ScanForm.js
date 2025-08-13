import React, { useState } from 'react';
import axios from 'axios';

export default function ScanForm({ onResult }) {
  const [target, setTarget] = useState('');
  const [tool, setTool] = useState('nuclei');
  const [running, setRunning] = useState(false);

  const startScan = async () => {
    if (!target) { alert('Enter a target (domain or IP)'); return; }
    setRunning(true);
    onResult({type:'status', message:`Starting ${tool} on ${target}...`});
    try {
      const res = await axios.post('/api/start', { target, tool }, { timeout: 20000 });
      // expect { output, id }
      if (res.data && res.data.output) {
        onResult({ type:'output', output: res.data.output, tool, target });
      } else {
        onResult({ type:'output', output: JSON.stringify(res.data), tool, target });
      }
    } catch (err) {
      // fallback to mock output if backend not available
      const mock = `Mock scan result for ${target} using ${tool}\n- Port 80 open\n- Port 443 open\n- No high vulnerabilities detected.`;
      onResult({ type:'output', output: mock, tool, target });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="card">
      <div className="header-row">
        <h3>Start a Scan</h3>
        <div>
          <button className="btn small-btn" onClick={() => { setTarget('scanme.nmap.org'); }}>Example</button>
        </div>
      </div>

      <div className="form-row">
        <input className="input" placeholder="example.com or 8.8.8.8" value={target} onChange={e=>setTarget(e.target.value)} />
        <select className="select" value={tool} onChange={e=>setTool(e.target.value)}>
          <option value="nuclei">Nuclei</option>
          <option value="nmap">Nmap</option>
          <option value="amass">Amass</option>
          <option value="zap">ZAP</option>
        </select>
        <button className="btn" onClick={startScan} disabled={running}>{running? 'Running...' : 'Start Scan'}</button>
      </div>
    </div>
  );
}
