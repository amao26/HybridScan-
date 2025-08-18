import React, { useState } from "react";

// Mock data to simulate scan results for multiple targets
const mockScanResults = [
  {
    target: "example.com",
    scans: [
      { tool: "Nmap", result: "3 ports open (22, 80, 443)", time: "1:30 PM", status: "Completed" },
      { tool: "Subdomain Finder", result: "3 subdomains found", time: "1:28 PM", status: "Completed" },
    ],
  },
  {
    target: "192.168.1.1",
    scans: [
      { tool: "Nmap", result: "1 port open (22)", time: "Yesterday, 4:00 PM", status: "Completed" },
      { tool: "Subdomain Finder", result: "N/A", time: "N/A", status: "Not Applicable" },
    ],
  },
  {
    target: "test-site.org",
    scans: [
      { tool: "Nmap", result: "Scanning...", time: "2:00 PM", status: "Running" },
      { tool: "Subdomain Finder", result: "10% complete", time: "1:55 PM", status: "Running", progress: 10 },
    ],
  },
];

export default function ResultsPage() {
  const [expandedTarget, setExpandedTarget] = useState(null);

  const handleToggle = (target) => {
    setExpandedTarget(expandedTarget === target ? null : target);
  };

  return (
    <div className="main">
      <div className="card">
        <h2 style={{ color: "var(--accent)", marginBottom: "16px" }}>📊 Targets Dashboard</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {mockScanResults.map((targetData, index) => (
            <li
              key={index}
              className="history-item-container"
              onClick={() => handleToggle(targetData.target)}
              style={{
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "12px",
                backgroundColor: "var(--card)",
                cursor: "pointer",
                transition: "background-color 0.2s ease-in-out",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3 style={{ margin: 0, color: "var(--text)" }}>Targets: {targetData.target}</h3>
                <span
                  style={{
                    fontSize: "1.5em",
                    color: "var(--accent)",
                    transform: expandedTarget === targetData.target ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                >
                  ▼
                </span>
              </div>
              {expandedTarget === targetData.target && (
                <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                  {targetData.scans.map((scan, scanIndex) => (
                    <div
                      key={scanIndex}
                      style={{
                        marginBottom: "12px",
                        padding: "8px",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        backgroundColor: "var(--panel)",
                      }}
                    >
                      <h4 style={{ margin: "0 0 8px 0", color: "var(--accent)" }}>{scan.tool}</h4>
                      <p style={{ margin: "0 0 4px 0", color: "var(--text)" }}>
                        <span style={{ fontWeight: "bold" }}>Result:</span> {scan.result}
                      </p>
                      <p style={{ margin: "0 0 4px 0", color: "var(--text)" }}>
                        <span style={{ fontWeight: "bold" }}>Status:</span> {scan.status}
                      </p>
                      {scan.status === "Running" && (
                        <div
                          style={{
                            height: "8px",
                            backgroundColor: "var(--bg)",
                            borderRadius: "4px",
                            overflow: "hidden",
                            marginTop: "4px",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${scan.progress}%`,
                              backgroundColor: "var(--accent)",
                              transition: "width 0.5s ease",
                            }}
                          ></div>
                        </div>
                      )}
                      <p style={{ margin: 0, fontSize: "0.8em", color: "var(--muted)" }}>
                        Last Run: {scan.time}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}