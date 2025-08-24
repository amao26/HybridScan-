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
  Chip,
  Box,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  Storage,
  Dns,
  Lock,
  LockOpen,
} from "@mui/icons-material";

export default function DBScanPage({ updateTarget }) {
  const [host, setHost] = useState("");
  const [results, setResults] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState("Ready to scan.");
  const [progress, setProgress] = useState(0);

  const databasesToScan = [
    { name: "MySQL", port: "3306" },
    { name: "PostgreSQL", port: "5432" },
    { name: "Microsoft SQL Server", port: "1433" },
    { name: "MongoDB", port: "27017" },
  ];

  const handleScan = () => {
    if (!host) {
      setScanStatus("Please enter a host or IP address.");
      return;
    }

    setIsScanning(true);
    setResults([]);
    setProgress(0);
    setScanStatus("Initiating scan...");

    let completedChecks = 0;
    const totalChecks = databasesToScan.length;
    const finalResults = [];

    databasesToScan.forEach((db, index) => {
      const isExposed = Math.random() < 0.3; // 30% chance of being exposed
      setTimeout(() => {
        const resultItem = {
          ...db,
          status: isExposed ? "Exposed" : "Secure",
          icon: isExposed ? <LockOpen sx={{ color: "red" }} /> : <Lock sx={{ color: "green" }} />,
          details: isExposed
            ? `Port ${db.port} is open and responsive. This may indicate an exposed ${db.name} database.`
            : `Port ${db.port} is closed or filtered. ${db.name} is not publicly accessible.`,
        };
        
        finalResults.push(resultItem);
        setResults([...finalResults]);
        
        completedChecks++;
        setProgress((completedChecks / totalChecks) * 100);

        if (completedChecks === totalChecks) {
          setIsScanning(false);
          setScanStatus("Scan complete.");
          // ✅ Pass the database scan results to the central state management
          updateTarget(host, "Database Scan", finalResults);
        }
      }, (index + 1) * 750); // Simulate different scan times
    });
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
          <Storage sx={{ color: "var(--accent)", mr: 1, fontSize: 32 }} />
          <Typography variant="h4" sx={{ color: "var(--text)", fontWeight: "bold" }}>
            Database Exposure Scan
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: "var(--text-light)", mb: 3 }}>
          {isScanning ? `Status: ${scanStatus}` : scanStatus}
        </Typography>

        <Box display="flex" gap={2} alignItems="center">
          <TextField
            label="Enter Host or IP"
            variant="outlined"
            fullWidth
            value={host}
            onChange={(e) => setHost(e.target.value)}
            disabled={isScanning}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Dns sx={{ color: "var(--text-light)" }} />
                </InputAdornment>
              ),
            }}
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
          <Button
            variant="contained"
            onClick={handleScan}
            disabled={isScanning || !host}
            sx={{
              minWidth: 120,
              backgroundColor: "var(--accent)",
              color: "var(--bg)",
              "&:hover": { backgroundColor: "var(--accent-dark)" },
            }}
          >
            {isScanning ? (
              <CircularProgress size={24} sx={{ color: "var(--bg)" }} />
            ) : (
              "Scan"
            )}
          </Button>
        </Box>

        {isScanning && (
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
              Scanning for exposed databases... {progress.toFixed(0)}% Complete
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
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={
                    <Typography component="span" sx={{ display: "flex", alignItems: "center", fontWeight: "bold", color: "var(--text)" }}>
                      <Box component="span" mr={1}>{item.name}</Box>
                      <Chip
                        label={item.status}
                        size="small"
                        sx={{
                          backgroundColor: item.status === "Exposed" ? "red" : "green",
                          color: "#fff",
                          textTransform: "uppercase",
                          fontWeight: "bold",
                        }}
                      />
                    </Typography>
                  }
                  secondary={
                    <Typography component="span" sx={{ color: "var(--text-light)", mt: 1, display: "block" }}>
                      {item.details}
                    </Typography>
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