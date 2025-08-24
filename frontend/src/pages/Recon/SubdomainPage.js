import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

export default function SubdomainPage({ updateTarget }) {
  const [domain, setDomain] = useState("");
  const [subdomains, setSubdomains] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedTool, setSelectedTool] = useState("");

  const handleScan = (tool) => {
    if (!domain) {
      alert("Please enter a domain.");
      return;
    }

    setIsScanning(true);
    setSelectedTool(tool);
    setSubdomains([]); // Clear previous results

    setTimeout(() => {
      setIsScanning(false);
      const toolName = tool === "ffuf" ? "FFUF" : "Sublist3r";
      const results = [
        `subdomain-1.${domain} (via ${toolName})`,
        `subdomain-2.${domain} (via ${toolName})`,
        `subdomain-3.${domain} (via ${toolName})`,
      ];
      setSubdomains(results);

      // ✅ Pass the subdomain results to the central state management
      updateTarget(domain, "Subdomain", results);

    }, 2000);
  };

  return (
    <div className="main">
      <Paper className="card" sx={{ p: 2, mb: 3, backgroundColor: "var(--card)" }}>
        <Typography variant="h4" gutterBottom sx={{ color: "var(--accent)" }}>
          🌐 Subdomain Finder
        </Typography>
        <Typography variant="body1" sx={{ color: "var(--text)", mb: 2 }}>
          Choose a tool to discover subdomains for the target domain.
        </Typography>
        <TextField
          label="Enter domain"
          variant="outlined"
          fullWidth
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          sx={{
            mb: 2,
            "& .MuiInputBase-root": {
              color: "var(--text)",
              backgroundColor: "var(--panel)",
              "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
              "&:hover fieldset": { borderColor: "var(--accent)" },
            },
            "& .MuiInputLabel-root": { color: "var(--text)" },
          }}
          disabled={isScanning}
        />
        <div style={{ display: "flex", gap: "16px" }}>
          <Button
            variant="contained"
            onClick={() => handleScan("ffuf")}
            disabled={isScanning}
            sx={{ flex: 1, backgroundColor: "var(--accent)", color: "var(--bg)", "&:hover": { backgroundColor: "var(--accent)" } }}
          >
            {isScanning && selectedTool === "ffuf" ? <CircularProgress size={24} sx={{ color: "var(--bg)" }} /> : "Run FFUF"}
          </Button>
          <Button
            variant="contained"
            onClick={() => handleScan("sublist3r")}
            disabled={isScanning}
            sx={{ flex: 1, backgroundColor: "var(--accent)", color: "var(--bg)", "&:hover": { backgroundColor: "var(--accent)" } }}
          >
            {isScanning && selectedTool === "sublist3r" ? <CircularProgress size={24} sx={{ color: "var(--bg)" }} /> : "Run Sublist3r"}
          </Button>
        </div>
      </Paper>
      
      {subdomains.length > 0 && (
        <Paper className="card" sx={{ p: 2, mt: 3, backgroundColor: "var(--card)" }}>
          <Typography variant="h5" gutterBottom sx={{ color: "var(--accent)" }}>
            Results
          </Typography>
          <List>
            {subdomains.map((sub, index) => (
              <ListItem key={index} sx={{ borderBottom: "1px solid rgba(255,255,255,0.05)", py: 1 }}>
                <ListItemText primary={sub} sx={{ color: "var(--text)" }} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </div>
  );
}