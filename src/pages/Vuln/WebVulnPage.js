import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Paper,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  InputAdornment,
} from "@mui/material";
import {
  Security,
  VpnLock,
  ReportProblem,
  CheckCircle,
  Warning,
  FiberManualRecord,
} from "@mui/icons-material";

export default function AdvancedWebVulnPage({ updateTarget }) {
  const [url, setUrl] = useState("");
  const [findings, setFindings] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState("Ready to scan.");
  const [progress, setProgress] = useState(0);

  const severityColors = {
    high: "#E53935", // Red
    medium: "#FFB300", // Amber
    low: "#4CAF50", // Green
    info: "#2196F3", // Blue
  };

  const handleScan = () => {
    if (!url) {
      setScanStatus("Please enter a valid URL.");
      return;
    }

    setIsScanning(true);
    setFindings([]);
    setScanStatus("Scanning...");
    setProgress(0);

    const scanPhases = [
      { name: "Scanning for common vulnerabilities...", delay: 1000, progress: 30 },
      { name: "Checking for misconfigurations...", delay: 1500, progress: 60 },
      { name: "Analyzing headers and cookies...", delay: 1000, progress: 85 },
      { name: "Finalizing report...", delay: 500, progress: 100 },
    ];

    let currentProgress = 0;
    scanPhases.forEach((phase, index) => {
      setTimeout(() => {
        setScanStatus(phase.name);
        setProgress(phase.progress);
        if (index === scanPhases.length - 1) {
          setTimeout(() => {
            setIsScanning(false);
            setScanStatus("Scan complete.");
            const mockFindings = generateMockFindings(url);
            setFindings(mockFindings);
            // ✅ Pass the findings to the central state management
            updateTarget(url, "Web Vulnerability Scan", mockFindings);
          }, 500);
        }
      }, currentProgress + phase.delay);
      currentProgress += phase.delay;
    });
  };

  const generateMockFindings = (targetUrl) => {
    return [
      {
        id: 1,
        vuln: "Cross-Site Scripting (XSS)",
        severity: "high",
        description: `Reflected XSS found at ${targetUrl}/search?query=...`,
      },
      {
        id: 2,
        vuln: "Insecure Direct Object Reference (IDOR)",
        severity: "high",
        description: `Potential IDOR vulnerability in user profile API.`,
      },
      {
        id: 3,
        vuln: "SQL Injection",
        severity: "medium",
        description: `Parameter 'id' in login form is vulnerable.`,
      },
      {
        id: 4,
        vuln: "Missing Security Headers",
        severity: "low",
        description: "X-Frame-Options and Content-Security-Policy headers are missing.",
      },
      {
        id: 5,
        vuln: "Outdated JavaScript Library",
        severity: "info",
        description: "jQuery version 1.10.2 is used, which has known vulnerabilities.",
      },
    ];
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "high": return <ReportProblem sx={{ color: severityColors.high }} />;
      case "medium": return <Warning sx={{ color: severityColors.medium }} />;
      case "low": return <CheckCircle sx={{ color: severityColors.low }} />;
      case "info": return <FiberManualRecord sx={{ color: severityColors.info }} />;
      default: return null;
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
          <Security sx={{ color: "var(--accent)", mr: 1, fontSize: 32 }} />
          <Typography variant="h4" sx={{ color: "var(--text)", fontWeight: "bold" }}>
            Advanced Web Vulnerability Scan
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: "var(--text-light)", mb: 3 }}>
          {isScanning ? `Status: ${scanStatus}` : scanStatus}
        </Typography>

        <Box display="flex" gap={2} alignItems="center">
          <TextField
            label="Enter URL"
            variant="outlined"
            fullWidth
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isScanning}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VpnLock sx={{ color: "var(--text-light)" }} />
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
            disabled={isScanning || !url}
            sx={{
              minWidth: 120,
              backgroundColor: "var(--accent)",
              color: "var(--bg)",
              "&:hover": { backgroundColor: "var(--accent-dark)" },
            }}
          >
            {isScanning ? "Scanning..." : "Scan"}
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
              {progress.toFixed(0)}% Complete
            </Typography>
          </Box>
        )}
      </Paper>

      {findings.length > 0 && (
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
            Scan Report
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "var(--text-light)", borderBottomColor: "rgba(255,255,255,0.1)" }}>
                    Vulnerability
                  </TableCell>
                  <TableCell sx={{ color: "var(--text-light)", borderBottomColor: "rgba(255,255,255,0.1)" }}>
                    Severity
                  </TableCell>
                  <TableCell sx={{ color: "var(--text-light)", borderBottomColor: "rgba(255,255,255,0.1)" }}>
                    Description
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {findings.map((f) => (
                  <TableRow key={f.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row" sx={{ color: "var(--text)", borderBottomColor: "rgba(255,255,255,0.05)" }}>
                      {f.vuln}
                    </TableCell>
                    <TableCell sx={{ color: "var(--text)", borderBottomColor: "rgba(255,255,255,0.05)" }}>
                      <Chip
                        label={f.severity}
                        size="small"
                        icon={getSeverityIcon(f.severity)}
                        sx={{
                          backgroundColor: severityColors[f.severity],
                          color: "#fff",
                          textTransform: "capitalize",
                          fontWeight: "bold",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: "var(--text-light)", borderBottomColor: "rgba(255,255,255,0.05)" }}>
                      {f.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </div>
  );
}