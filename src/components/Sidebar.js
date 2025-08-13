import React from 'react';
import { 
  FaTachometerAlt, 
  FaBomb, 
  FaNetworkWired, 
  FaShieldAlt, 
  FaClipboardList, 
  FaHistory,
  FaInfoCircle 
} from 'react-icons/fa';
import '../styles.css';  // Corrected path to your styles.css

export default function Sidebar({ route, setRoute }) {
  const navItems = [
    { name: 'Overview', key: 'overview', icon: <FaTachometerAlt /> },
    { name: 'Attack', key: 'attack', icon: <FaBomb /> },
    { name: 'Subdomains', key: 'subdomains', icon: <FaNetworkWired /> },
    { name: 'Vuln Check', key: 'vulncheck', icon: <FaShieldAlt /> },
    { name: 'Results', key: 'results', icon: <FaClipboardList /> },
    { name: 'Targets', key: 'targets', icon: <FaHistory /> },
    { name: 'Abouts', key: 'about', icon: <FaInfoCircle  /> },
    
  ];

  return (
    <aside className="sidebar">
      <div>
        <div className="brand">HybridScan</div>
        <div className="nav">
          {navItems.map(item => (
            <a 
              key={item.key}
              className={route === item.key ? 'active' : ''}
              onClick={() => setRoute(item.key)}
            >
              {item.icon} <span style={{marginLeft: 8}}>{item.name}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="footer">
        <div>Version</div>
        <div style={{fontWeight:700}}>0.1.0</div>
      </div>
    </aside>
  );
}
