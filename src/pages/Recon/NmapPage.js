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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { useScan } from "../../components/ScanContext";

export default function NmapPage() {
  const { scanState, startScan } = useScan();
  const [target, setTarget] = useState("");
  const [portRange, setPortRange] = useState("");
  const [osDetection, setOsDetection] = useState(false);
  const [serviceDetection, setServiceDetection] = useState(false);
  const [scriptScan, setScriptScan] = useState(false);
  const [targetHistory, setTargetHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [scannedTarget, setScannedTarget] = useState(null);
  const historyRef = useRef(null);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("nmapTargetHistory")) || [];
    setTargetHistory(storedHistory);
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

  const handleScan = () => {
    if (!target) {
      alert("Please enter a target IP or domain.");
      return;
    }

    const newHistory = [target, ...targetHistory.filter(t => t !== target)].slice(0, 10);
    setTargetHistory(newHistory);
    localStorage.setItem("nmapTargetHistory", JSON.stringify(newHistory));
    setShowHistory(false);
    setScannedTarget(target);

    let nmapCommand = `nmap -sS ${target}`;
    if (portRange) nmapCommand += ` -p ${portRange}`;
    if (osDetection) nmapCommand += " -O";
    if (serviceDetection) nmapCommand += " -sV";
    if (scriptScan) nmapCommand += " -sC";

    startScan("Nmap", {
      summary: `Scan completed on ${target}`,
      openPorts: [{ port: 22 }, { port: 80 }, { port: 443 }],
    });
  };

  return (
    <div className="main">
      <Paper className="card" sx={{ p: 2, mb: 3, backgroundColor: "var(--card)" }}>
        <Typography variant="h5" gutterBottom sx={{ color: "var(--accent)" }}>
          🔬 Nmap Scanner
        </Typography>
        <div style={{ position: "relative", marginBottom: "16px" }}>
          <TextField
            label="Target IP or Domain"
            variant="outlined"
            fullWidth
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            onFocus={() => setShowHistory(true)}
            disabled={scanState.isScanning}
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
                backgroundColor: "white", // 白色背景
                opacity: 1, // 确保完全不透明
                border: "1px solid rgba(255,255,255,0.08)", 
                borderRadius: "4px" 
              }}
            >
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {targetHistory.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setTarget(item);
                      setShowHistory(false);
                    }}
                    style={{
                      padding: "8px 12px",
                      cursor: "pointer",
                      color: "black", // <-- 修复字体颜色为黑色
                      backgroundColor: target === item ? "var(--accent)" : "transparent",
                      "&:hover": { backgroundColor: "rgba(0, 255, 153, 0.1)" },
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Paper>
          )}
        </div>
        <Button
          variant="contained"
          onClick={handleScan}
          disabled={scanState.isScanning}
          fullWidth
          sx={{
            backgroundColor: "var(--accent)",
            color: "var(--bg)",
            "&:hover": { backgroundColor: "var(--accent)" },
            whiteSpace: "nowrap"
          }}
        >
          {scanState.isScanning ? <CircularProgress size={24} sx={{ color: "var(--bg)" }} /> : "Run Scan"}
        </Button>

        <Accordion sx={{ marginTop: "16px", backgroundColor: "var(--panel)" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "var(--accent)" }} />}>
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
              disabled={scanState.isScanning}
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
                  disabled={scanState.isScanning}
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
                  disabled={scanState.isScanning}
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
                  disabled={scanState.isScanning}
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

      
      //scan status bar
      {scanState.isScanning && (
        <Paper className="card" sx={{ p: 2, mt: 3, backgroundColor: "var(--card)" }}>
          <Typography variant="h6" sx={{ color: "var(--accent)", marginBottom: 1 }}>
            Live Scan Log
          </Typography>
          <pre style={{ color: "var(--text)", backgroundColor: "var(--panel)", padding: "12px", borderRadius: "8px", overflowY: "scroll", maxHeight: "200px" }}>
            <p>Scanning...</p>
          </pre>
        </Paper>
      )}
      
      {scanState.results && (
        <Paper className="card" sx={{ p: 2, mt: 3, backgroundColor: "var(--card)" }}>
          <Typography variant="h5" gutterBottom sx={{ color: "var(--accent)" }}>
            Scan Results for {scannedTarget}
          </Typography>
          <pre style={{ color: "var(--text)", backgroundColor: "var(--panel)", padding: "12px", borderRadius: "8px", overflowX: "auto" }}>
            {JSON.stringify(scanState.results, null, 2)}
          </pre>
        </Paper>
      )}
    </div>
  );
}