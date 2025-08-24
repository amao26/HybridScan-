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
  ListItemIcon,
  Grid,
  Chip,
  Box,
} from "@mui/material";
import {
  Search,
  CheckCircleOutline,
  ErrorOutline,
  Link,
  Person,
  Email,
} from "@mui/icons-material";

export default function AdvancedOSINTPage({ updateTarget }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [status, setStatus] = useState("Ready to search.");
  const [progress, setProgress] = useState(0);

  const sources = [
    { name: "Social Media", icon: <Person />, delay: 1000 },
    { name: "Data Breaches", icon: <Email />, delay: 2000 },
    { name: "Domain Registries", icon: <Link />, delay: 1500 },
  ];

  const handleSearch = () => {
    if (!query) {
      setStatus("Please enter a name or email.");
      return;
    }

    setIsSearching(true);
    setResults([]);
    setProgress(0);
    setStatus("Initiating search...");

    let completedSources = 0;
    const totalSources = sources.length;
    let newResults = [];

    sources.forEach((source, index) => {
      setTimeout(() => {
        const found = Math.random() > 0.3; // 70% chance to find something
        const resultItem = {
          source: source.name,
          icon: source.icon,
          status: found ? "Found" : "Not Found",
          data: found
            ? generateMockData(source.name, query)
            : `No information found on ${source.name}.`,
        };
        newResults = [...newResults, resultItem];
        setResults([...newResults]);

        completedSources++;
        setProgress((completedSources / totalSources) * 100);

        if (completedSources === totalSources) {
          setIsSearching(false);
          setStatus("Search complete.");
          // ✅ Pass the search results to the central state management
          updateTarget(query, "OSINT", newResults);
        }
      }, source.delay);
    });
  };

  const generateMockData = (sourceName, query) => {
    const [firstName] = query.split(" ");
    switch (sourceName) {
      case "Social Media":
        return [
          `LinkedIn Profile: linkedin.com/in/${firstName.toLowerCase()}...`,
          `Twitter Account: twitter.com/${firstName.toLowerCase()}osint`,
        ];
      case "Data Breaches":
        return [
          `Email found in breach: ${firstName.toLowerCase()}@example.com`,
          `Possible aliases: ${firstName.toLowerCase()}123`,
        ];
      case "Domain Registries":
        return [
          `Registered Domain: ${firstName.toLowerCase()}-corp.com`,
          `Registrant Email: redacted`,
        ];
      default:
        return [`Found generic information related to ${query}`];
    }
  };

  return (
    <div className="main">
      <Paper
        className="card"
        sx={{
          p: 4,
          mb: 3,
          backgroundColor: "var(--card)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Box display="flex" alignItems="center" mb={2}>
          <Search sx={{ color: "var(--accent)", mr: 1, fontSize: 32 }} />
          <Typography variant="h4" sx={{ color: "var(--text)", fontWeight: "bold" }}>
            Advanced OSINT Lookup
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: "var(--text-light)", mb: 3 }}>
          {isSearching ? `Scanning ${status}` : status}
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid xs={12} sm={9}>
            <TextField
              label="Enter name, username, or email"
              variant="outlined"
              fullWidth
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isSearching}
              sx={{
                "& .MuiInputBase-root": {
                  color: "var(--text)",
                  backgroundColor: "var(--panel)",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
                  "&:hover fieldset": { borderColor: "var(--accent)" },
                },
                "& .MuiInputLabel-root": { color: "var(--text)" },
              }}
            />
          </Grid>
          <Grid xs={12} sm={3}>
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={isSearching || !query}
              fullWidth
              sx={{
                height: "100%",
                backgroundColor: "var(--accent)",
                color: "var(--bg)",
                "&:hover": { backgroundColor: "var(--accent-dark)" },
              }}
            >
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </Grid>
        </Grid>

        {isSearching && (
          <Box mt={3}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "rgba(255,255,255,0.1)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "var(--accent)",
                },
              }}
            />
            <Typography variant="caption" sx={{ color: "var(--text-light)", mt: 1, display: "block" }}>
              {progress.toFixed(0)}% Complete
            </Typography>
          </Box>
        )}
      </Paper>

      {results.length > 0 && (
        <Paper
          className="card"
          sx={{
            p: 4,
            mt: 3,
            backgroundColor: "var(--card)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ color: "var(--accent)" }}>
            Scan Results
          </Typography>
          <List>
            {results.map((item, i) => (
              <ListItem key={i} sx={{ borderBottom: "1px solid rgba(255,255,255,0.05)", py: 2 }}>
                <ListItemIcon sx={{ minWidth: 40, color: "var(--text)" }}>
                  {item.status === "Found" ? (
                    <CheckCircleOutline sx={{ color: "green" }} />
                  ) : (
                    <ErrorOutline sx={{ color: "red" }} />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      component="span"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "var(--text)",
                        fontWeight: "bold",
                      }}
                    >
                      {item.icon}
                      <Box component="span" ml={1}>
                        {item.source}
                      </Box>
                      <Chip
                        label={item.status}
                        size="small"
                        sx={{
                          ml: 2,
                          backgroundColor:
                            item.status === "Found" ? "green" : "red",
                          color: "#fff",
                        }}
                      />
                    </Typography>
                  }
                  secondary={
                    <Box component="span" sx={{ color: "var(--text-light)", mt: 1, display: "block" }}>
                      {Array.isArray(item.data)
                        ? item.data.map((line, j) => (
                            <Typography key={j} variant="body2" component="p">
                              {line}
                            </Typography>
                          ))
                        : item.data}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </div>
  );
}