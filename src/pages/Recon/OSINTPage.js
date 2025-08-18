import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Paper,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

export default function OSINTPage() {
  const [query, setQuery] = useState("");
  const [info, setInfo] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [status, setStatus] = useState("Ready to search.");

  const handleSearch = () => {
    if (!query) {
      setStatus("Please enter a name or email.");
      return;
    }

    setIsSearching(true);
    setInfo([]);
    setStatus("Searching for information...");

    // Simulate search progress and results
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 20;
      if (progress >= 100) {
        clearInterval(progressInterval);
        setIsSearching(false);
        setStatus("Search complete.");
        setInfo([
          `Found LinkedIn profile for ${query}`,
          `Email leaked: ${query.split(" ")[0].toLowerCase()}@mail.com`,
          `Related domains: ${query.split(" ")[0].toLowerCase()}corp.com`,
        ]);
      }
    }, 500);
  };

  return (
    <div className="main">
      <Paper className="card" sx={{ p: 2, mb: 3, backgroundColor: "var(--card)" }}>
        <Typography variant="h5" gutterBottom sx={{ color: "var(--accent)" }}>
          🕵️ OSINT Lookup
        </Typography>
        <Typography variant="body1" sx={{ color: "var(--text)", mb: 2 }}>
          {status}
        </Typography>
        <TextField
          label="Enter name or email"
          variant="outlined"
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isSearching}
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
        />
        {isSearching && <LinearProgress sx={{ mb: 2, color: "var(--accent)" }} />}
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={isSearching}
          sx={{ backgroundColor: "var(--accent)", color: "var(--bg)", "&:hover": { backgroundColor: "var(--accent)" } }}
        >
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </Paper>
      
      {info.length > 0 && (
        <Paper className="card" sx={{ p: 2, mt: 3, backgroundColor: "var(--card)" }}>
          <Typography variant="h5" gutterBottom sx={{ color: "var(--accent)" }}>
            Results
          </Typography>
          <List>
            {info.map((item, i) => (
              <ListItem key={i} sx={{ borderBottom: "1px solid rgba(255,255,255,0.05)", py: 1 }}>
                <ListItemText primary={item} sx={{ color: "var(--text)" }} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </div>
  );
}