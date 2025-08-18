import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const sidebarData = [
  {
    title: "Reconnaissance",

    tools: [
      "Network Scan (Nmap)",
      "Subdomain Scan (FFUF/Sublist3r)",
      "OSINT / Public Data",
    ],
  },
  {
    title: "Vulnerability Analysis",
    tools: [
      "Web Vulnerability Scan (OWASP ZAP/Nikto)",
      "Database Assessment (SQLmap/DB Scan)",
    ],
  },
  {
    title: "Exploitation / Demo Exploit",
    tools: [
      "Vulnerability Exploit Simulation",
      "Privilege Escalation Demo",
      "Post-Exploitation Data Collection",
    ],
  },
  {
    title: "Results & AI Guidance",
    tools: ["View Scan Results", "AI Security Recommendations"],
  },
];

export default function MuiSidebar({ onSelectTool }) {
  return (
    <div className="sidebar">
      <div className="brand">HybridScan</div>

      {sidebarData.map((module) => (
        <Accordion
          key={module.title}
          sx={{
            background: "var(--panel)",
            color: "var(--accent)",
            marginBottom: "6px",
            borderRadius: "6px",
            "& .MuiAccordionSummary-content": { alignItems: "center" },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "var(--accent)" }} />}
            aria-controls={`${module.title}-content`}
            id={`${module.title}-header`}
          >
            <Typography component="span">
              {module.icon} {module.title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {module.tools.map((tool, idx) => (
              <Typography
                key={idx}
                component="span"
                className="nav a"
                sx={{
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={() => onSelectTool && onSelectTool(module.title, tool)}
              >
                {tool}
              </Typography>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}

      <div className="footer">© 2025 HybridScan</div>
    </div>
  );
}
