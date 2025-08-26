import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { NavLink } from "react-router-dom";

const sidebarData = [
  {
    title: "Reconnaissance",
    tools: [
      { name: "Network Scan (Nmap)", path: "/recon/nmappage" },
      { name: "Subdomain Scan", path: "/recon/subdomain" },
      { name: "OSINT / Public Data", path: "/recon/osint" },
    ],
  },
  {
    title: "Vulnerabilities",
    tools: [
      { name: "Web Vulnerability Scan", path: "/vuln/web" },
      { name: "Database Scan", path: "/vuln/dbscan" },
    ],
  },
  {
    title: "Exploitation",
    tools: [
      { name: "Privilege Escalation", path: "/exploit/privesc" },
      { name: "Post-Exploitation", path: "/exploit/postex" },
    ],
  },
  {
    title: "Results",
    tools: [
      { name: "Results", path: "/results" },
      { name: "AI Assistant", path: "/ai" },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside
      style={{
        width: 280,
        background: "linear-gradient(180deg, #0a0a0a 0%, #121212 100%)",
        borderRight: "1px solid #0f0",
        height: "100vh",
        color: "#0f0",
        fontFamily: "'Share Tech Mono', monospace",
        overflowY: "auto",
      }}
    >
      
      <NavLink
        to="/ "
        className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        style={{ textDecoration: "none" }}
      >
        <Typography
          component="span"
          sx={{
            display: "block",
            padding: "12px 16px",
            borderRadius: "6px",
            fontSize: "15px",
            fontWeight: "bold",
            transition: "all 0.25s ease-in-out",
          }}
        >
          Dashboard
        </Typography>
      </NavLink>

      {/* Existing sections */}
      {sidebarData.map((module, i) => (
        <Accordion
          key={i}
          defaultExpanded
          disableGutters
          sx={{
            background: "transparent",
            color: "#0f0",
            boxShadow: "none",
            "&:before": { display: "none" },
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#0f0" }} />}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", letterSpacing: 1 }}>
              {module.title}
            </Typography>
          </AccordionSummary>

          <AccordionDetails sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {module.tools.map((tool, idx) => (
              <NavLink
                key={idx}
                to={tool.path}
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                style={{ textDecoration: "none" }}
              >
                <Typography
                  component="span"
                  sx={{
                    display: "block",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    fontSize: "14px",
                    transition: "all 0.25s ease-in-out",
                  }}
                >
                  {tool.name}
                </Typography>
              </NavLink>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </aside>
  );
}
