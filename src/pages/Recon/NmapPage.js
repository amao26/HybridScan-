// src/pages/Recon/NmapPage.js
import React, { useState, useEffect, useRef } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Paper,
  CircularProgress,
  Box,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  NetworkCheck,
  Build,
  Terminal,
  Info,
  CheckCircle,
  Warning,
  Error,
  DeleteForever, // <-- Added new icon
} from "@mui/icons-material";
import { useScan } from '../../components/ScanContext';

// Utility function to get a formatted timestamp
const getFormattedTimestamp = () => {
  const now = new Date();
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  return now.toLocaleTimeString("en-US", options);
};

export default function NmapPage() {
  const { addScanResult } = useScan();

  const [target, setTarget] = useState("");
  const [portRange, setPortRange] = useState("");
  const [osDetection, setOsDetection] = useState(false);
  const [serviceDetection, setServiceDetection] = useState(false);
  const [scriptScan, setScriptScan] = useState(false);
  const [targetHistory, setTargetHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [liveLog, setLiveLog] = useState([]);
  const [progress, setProgress] = useState(0);
  const [currentScanStatus, setCurrentScanStatus] = useState("Ready to scan.");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [savedResults, setSavedResults] = useState([]);
  const [expandedScan, setExpandedScan] = useState(null); // New state to manage expanded scan

  const historyRef = useRef(null);
  const logRef = useRef(null);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("nmapTargetHistory")) || [];
    setTargetHistory(storedHistory);
    const storedResults = JSON.parse(localStorage.getItem("nmapScanResults")) || [];
    setSavedResults(storedResults);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (historyRef.current && !historyRef.current.contains(event.target)) {
        setShowHistory(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [historyRef]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [liveLog]);

  const handleScan = () => {
    if (!target) {
      alert("Please enter a target IP or domain.");
      return;
    }

    const newHistory = [target, ...targetHistory.filter((t) => t !== target)].slice(0, 10);
    setTargetHistory(newHistory);
    localStorage.setItem("nmapTargetHistory", JSON.stringify(newHistory));
    setShowHistory(false);

    setIsScanning(true);
    setScanResult(null);
    setLiveLog([]);
    setProgress(0);
    setCurrentScanStatus("Starting scan.");

    const scanStages = [
      {
        text: `Starting Nmap scan on ${target}...`,
        delay: 500,
        progress: 10,
      },
      {
        text: "Initiating SYN Stealth Scan...",
        delay: 2000,
        progress: 40,
      },
      osDetection && {
        text: "Performing OS detection...",
        delay: 1500,
        progress: 60,
      },
      serviceDetection && {
        text: "Running service version detection...",
        delay: 1500,
        progress: 80,
      },
      scriptScan && {
        text: "Executing default scripts...",
        delay: 2000,
        progress: 95,
      },
      {
        text: "Scan complete. Generating report.",
        delay: 500,
        progress: 100,
      },
    ].filter(Boolean);

    let totalDelay = 0;
    scanStages.forEach((stage, index) => {
      setTimeout(() => {
        setLiveLog((prevLog) => [...prevLog, stage.text]);
        setProgress(stage.progress);

        if (index === scanStages.length - 1) {
          const finalResult = {
            summary: `Scan completed on ${target}`,
            ports: [
              { port: 22, state: "open", service: "ssh" },
              { port: 80, state: "open", service: "http" },
              { port: 443, state: "open", service: "https" },
              { port: 3389, state: "closed", service: "ms-wbt-server" },
            ],
            os: osDetection ? "Linux" : "Unknown",
            services: serviceDetection ? ["SSH", "HTTP", "HTTPS"] : [],
            vulnerabilities: scriptScan ? ["CVE-2022-1234 (medium)"] : [],
          };
          
          setScanResult(finalResult);
          setIsScanning(false);
          setCurrentScanStatus("Scan completed.");

          const newScanEntry = {
            id: Date.now(),
            tool: "Nmap Scan",
            target: target,
            result: finalResult,
            status: "Completed",
            time: getFormattedTimestamp(),
          };

          addScanResult(target, newScanEntry);

          const storedResults = JSON.parse(localStorage.getItem("nmapScanResults")) || [];
          const updatedResults = [newScanEntry, ...storedResults].slice(0, 20);
          localStorage.setItem("nmapScanResults", JSON.stringify(updatedResults));
          setSavedResults(updatedResults);
        }
      }, totalDelay + stage.delay);
      totalDelay += stage.delay;
    });
  };

  const getStatusIcon = (status) => {
    if (isScanning) {
      return <CircularProgress size={20} sx={{ color: "var(--accent)" }} />;
    }
    if (status === "Scan completed.") {
      return <CheckCircle sx={{ color: "green" }} />;
    }
    if (status.includes("alert") || status.includes("error")) {
      return <Error sx={{ color: "red" }} />;
    }
    return <Info sx={{ color: "grey" }} />;
  };

  const handleAccordionChange = (scanId) => (event, isExpanded) => {
    setExpandedScan(isExpanded ? scanId : null);
  };

  const handleDeleteAllHistory = () => {
    if (window.confirm("Are you sure you want to delete all saved scan history? This action cannot be undone.")) {
      localStorage.removeItem("nmapTargetHistory");
      localStorage.removeItem("nmapScanResults");
      setTargetHistory([]);
      setSavedResults([]);
      setExpandedScan(null);
    }
  };

  return (
    <div className="main">
      <Paper className="card" sx={{ p: 4, mb: 3, backgroundColor: "var(--card)" }}>
        <Box display="flex" alignItems="center" mb={2}>
          <NetworkCheck sx={{ color: "var(--accent)", mr: 1, fontSize: 32 }} />
          <Typography variant="h4" sx={{ color: "var(--accent)", fontWeight: "bold" }}>
            Nmap Scanner
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: "var(--text-light)", mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          {currentScanStatus} {getStatusIcon(currentScanStatus)}
        </Typography>
        <Box style={{ position: "relative", marginBottom: "16px" }}>
          <TextField
            label="Target IP or Domain"
            variant="outlined"
            fullWidth
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            onFocus={() => setShowHistory(true)}
            disabled={isScanning}
            autoComplete="off"
            sx={{
              "& .MuiInputBase-root": {
                color: "var(--text)",
                backgroundColor: "var(--panel)",
                "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
                "&:hover fieldset": { borderColor: "var(--accent)" },
              },
              "& .MuiInputLabel-root": { color: "var(--muted)" },
            }}
          />
          {showHistory && targetHistory.length > 0 && (
            <Paper
              ref={historyRef}
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                zIndex: 10,
                mt: 1,
                backgroundColor: "var(--card)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "4px",
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
              <List>
                {targetHistory.map((item, index) => (
                  <ListItem
                    key={index}
                    onClick={() => {
                      setTarget(item);
                      setShowHistory(false);
                    }}
                    sx={{
                      cursor: "pointer",
                      color: "var(--text)",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                    }}
                  >
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Box>
        <Button
          variant="contained"
          onClick={handleScan}
          disabled={isScanning || !target}
          fullWidth
          sx={{
            backgroundColor: "var(--accent)",
            color: "var(--bg)",
            "&:hover": { backgroundColor: "var(--accent)" },
            whiteSpace: "nowrap",
          }}
        >
          {isScanning ? (
            <CircularProgress size={24} sx={{ color: "var(--bg)" }} />
          ) : (
            "Run Scan"
          )}
        </Button>
        <Accordion sx={{ marginTop: "16px", backgroundColor: "var(--panel)" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "var(--accent)" }} />}>
            <Build sx={{ color: "var(--muted)", mr: 1 }} />
            <Typography variant="h6" sx={{ color: "var(--accent)" }}>
              Scan Options
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <TextField
              label="Port Range (e.g., 1-1000 or 80,443)"
              variant="outlined"
              fullWidth
              value={portRange}
              onChange={(e) => setPortRange(e.target.value)}
              disabled={isScanning}
              sx={{
                "& .MuiInputBase-root": {
                  color: "var(--text)",
                  backgroundColor: "var(--bg)",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
                  "&:hover fieldset": { borderColor: "var(--accent)" },
                },
                "& .MuiInputLabel-root": { color: "var(--muted)" },
              }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={osDetection}
                  onChange={(e) => setOsDetection(e.target.checked)}
                  disabled={isScanning}
                  sx={{
                    "& .MuiSwitch-track": { backgroundColor: "var(--muted)" },
                    "& .MuiSwitch-thumb": { backgroundColor: "var(--text)" },
                    "& .Mui-checked .MuiSwitch-thumb": { backgroundColor: "var(--accent)" },
                    "& .Mui-checked + .MuiSwitch-track": { backgroundColor: "var(--accent)" },
                  }}
                />
              }
              label={<Typography sx={{ color: "var(--muted)" }}>OS Detection (-O)</Typography>}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={serviceDetection}
                  onChange={(e) => setServiceDetection(e.target.checked)}
                  disabled={isScanning}
                  sx={{
                    "& .MuiSwitch-track": { backgroundColor: "var(--muted)" },
                    "& .MuiSwitch-thumb": { backgroundColor: "var(--text)" },
                    "& .Mui-checked .MuiSwitch-thumb": { backgroundColor: "var(--accent)" },
                    "& .Mui-checked + .MuiSwitch-track": { backgroundColor: "var(--accent)" },
                  }}
                />
              }
              label={<Typography sx={{ color: "var(--muted)" }}>Service Version Detection (-sV)</Typography>}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={scriptScan}
                  onChange={(e) => setScriptScan(e.target.checked)}
                  disabled={isScanning}
                  sx={{
                    "& .MuiSwitch-track": { backgroundColor: "var(--muted)" },
                    "& .MuiSwitch-thumb": { backgroundColor: "var(--text)" },
                    "& .Mui-checked .MuiSwitch-thumb": { backgroundColor: "var(--accent)" },
                    "& .Mui-checked + .MuiSwitch-track": { backgroundColor: "var(--accent)" },
                  }}
                />
              }
              label={<Typography sx={{ color: "var(--muted)" }}>Default Script Scan (-sC)</Typography>}
            />
          </AccordionDetails>
        </Accordion>
      </Paper>
      {isScanning && (
        <Paper className="card" sx={{ p: 2, mt: 3, backgroundColor: "var(--card)" }}>
          <Typography variant="h6" sx={{ color: "var(--accent)", marginBottom: 1 }}>
            Live Scan Log
          </Typography>
          <Box
            ref={logRef}
            sx={{
              color: "var(--text)",
              backgroundColor: "var(--panel)",
              padding: "12px",
              borderRadius: "8px",
              overflowY: "scroll",
              maxHeight: "200px",
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
            }}
          >
            {liveLog.map((log, index) => (
              <p key={index} style={{ margin: "4px 0" }}>
                <Terminal sx={{ fontSize: 16, verticalAlign: "bottom" }} /> {log}
              </p>
            ))}
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                mt: 2,
                height: 8,
                borderRadius: 4,
                backgroundColor: "rgba(255,255,255,0.1)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "var(--accent)",
                },
              }}
            />
          </Box>
        </Paper>
      )}
      {scanResult && (
        <Paper className="card" sx={{ p: 2, mt: 3, backgroundColor: "var(--card)" }}>
          <Typography variant="h5" gutterBottom sx={{ color: "var(--accent)" }}>
            Scan Results for {target}
          </Typography>
          <Box
            sx={{
              color: "var(--text)",
              backgroundColor: "var(--panel)",
              padding: "12px",
              borderRadius: "8px",
              overflowX: "auto",
            }}
          >
            <Typography variant="body1" sx={{ color: "var(--text)", mb: 1 }}>
              **Open Ports:**
            </Typography>
            <List>
              {scanResult.ports.map((port, index) => (
                <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36, color: "green" }}>
                    <CheckCircle />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ color: "var(--text)" }}>
                        Port {port.port}/{port.state} - Service: {port.service}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
            <Typography variant="body1" sx={{ color: "var(--text)", mt: 2, mb: 1 }}>
              **Detected OS:**
              <Typography component="span" sx={{ color: "var(--accent)" }}> {scanResult.os}</Typography>
            </Typography>
            {scanResult.vulnerabilities.length > 0 && (
              <Typography variant="body1" sx={{ color: "var(--text)", mt: 2, mb: 1 }}>
                **Vulnerabilities:**
                <List>
                  {scanResult.vulnerabilities.map((vuln, index) => (
                    <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36, color: "red" }}>
                        <Warning />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ color: "var(--text)" }}>
                            {vuln}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Typography>
            )}
          </Box>
        </Paper>
      )}
      {savedResults.length > 0 && (
        <Paper className="card" sx={{ p: 2, mt: 3, backgroundColor: "var(--card)" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6" gutterBottom sx={{ color: "var(--accent)" }}>
              Saved Scan History
            </Typography>
            <Button
              variant="text"
              color="error"
              size="small"
              startIcon={<DeleteForever />}
              onClick={handleDeleteAllHistory}
            >
              Clear All
            </Button>
          </Box>
          <List>
            {savedResults.map((res) => (
              <Accordion 
                key={res.id} 
                expanded={expandedScan === res.id}
                onChange={handleAccordionChange(res.id)}
                sx={{ 
                  mt: 1, 
                  backgroundColor: "var(--panel)", 
                  "&.Mui-expanded": { margin: '8px 0' },
                  "&::before": { display: 'none' }
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "var(--muted)" }} />}
                  aria-controls={`panel-${res.id}-content`}
                  id={`panel-${res.id}-header`}
                >
                  <ListItemText
                    primary={<Typography sx={{ color: "var(--text)" }}>{`${res.tool} on ${res.target}`}</Typography>}
                    secondary={<Typography sx={{ color: "var(--muted)" }}>{`Time: ${res.time} | Status: ${res.status}`}</Typography>}
                    sx={{ m: 0 }}
                  />
                </AccordionSummary>
                <AccordionDetails sx={{ p: 2 }}>
                  <Typography variant="body2" sx={{ color: "var(--text-light)", mb: 1 }}>
                    **Summary:** {res.result.summary}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "var(--text-light)", mb: 1 }}>
                    **Detected OS:** {res.result.os}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "var(--text-light)", mb: 1 }}>
                    **Services:** {res.result.services.join(", ")}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "var(--text-light)", mb: 1 }}>
                    **Vulnerabilities:** {res.result.vulnerabilities.length > 0 ? res.result.vulnerabilities.join(", ") : "None"}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </List>
        </Paper>
      )}
    </div>
  );
}