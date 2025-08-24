import React, { useRef, useState, useEffect } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  LinearProgress,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid, // <-- This line was added to fix the error
} from "@mui/material";

export default function NmapPage() {
  const [target, setTarget] = useState("");
  const [portRange, setPortRange] = useState("");
  const [osDetection, setOsDetection] = useState(false);
  const [serviceDetection, setServiceDetection] = useState(false);
  const [scriptScan, setScriptScan] = useState(false);

  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState("calculating...");
  const [liveLog, setLiveLog] = useState([]);
  const [scanResult, setScanResult] = useState(null);

  const esRef = useRef(null);

  const closeStream = () => {
    if (esRef.current) {
      try {
        esRef.current.close();
      } catch (e) {
        console.error("Error closing EventSource:", e);
      }
      esRef.current = null;
    }
  };

  const handleScan = () => {
    if (!target) return alert("Enter a target IP or domain");

    closeStream();
    setIsScanning(true);
    setProgress(0);
    setEta("calculating...");
    setLiveLog([`🚀 Starting scan on ${target}...`]);
    setScanResult(null);

    const params = new URLSearchParams({
      target,
      os: String(osDetection),
      service: String(serviceDetection),
      scripts: String(scriptScan),
    });
    if (portRange) params.set("ports", portRange);

    const url = `http://localhost:5000/scan/stream?${params.toString()}`;

    const es = new EventSource(url);
    esRef.current = es;

    es.addEventListener("log", (evt) => {
      try {
        const { line } = JSON.parse(evt.data);
        setLiveLog((prev) => [...prev, line]);
      } catch (e) {
        console.error("Failed to parse log event:", e);
      }
    });

    es.addEventListener("progress", (evt) => {
      try {
        const { percent, eta } = JSON.parse(evt.data);
        setProgress(parseFloat(percent));
        setEta(eta);
      } catch (e) {
        console.error("Failed to parse progress event:", e);
      }
    });

    es.addEventListener("result", (evt) => {
      try {
        const data = JSON.parse(evt.data);
        setScanResult(data);
      } catch (e) {
        setLiveLog((prev) => [...prev, "❌ Failed to parse result"]);
      }
    });

    es.addEventListener("end", () => {
      setProgress(100);
      setIsScanning(false);
      closeStream();
    });

    es.addEventListener("error", () => {
      setLiveLog((prev) => [...prev, "❌ Stream error or connection lost"]);
      setIsScanning(false);
      closeStream();
    });
  };

  useEffect(() => {
    return () => closeStream();
  }, []);

  return (
    <div className="main">
      {/* Input Card */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Nmap Scanner
        </Typography>

        <TextField
          label="Target (IP / Domain)"
          fullWidth
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          sx={{
            mb: 2,
            "& .MuiInputLabel-root": { color: 'white' },
            "& .MuiInputBase-root": {
              color: 'white',
              "& fieldset": { borderColor: 'rgba(255,255,255,0.2)' },
              "&:hover fieldset": { borderColor: 'white' },
            },
          }}
        />

        <TextField
          label="Port Range (e.g. 1-1000 or 80,443)"
          fullWidth
          value={portRange}
          onChange={(e) => setPortRange(e.target.value)}
          sx={{
            mb: 2,
            "& .MuiInputLabel-root": { color: 'white' },
            "& .MuiInputBase-root": {
              color: 'white',
              "& fieldset": { borderColor: 'rgba(255,255,255,0.2)' },
              "&:hover fieldset": { borderColor: 'white' },
            },
          }}
        />

        <Box>
          <FormControlLabel
            control={
              <Switch
                checked={osDetection}
                onChange={(e) => setOsDetection(e.target.checked)}
              />
            }
            label="OS Detection (-O)"
          />
          <FormControlLabel
            control={
              <Switch
                checked={serviceDetection}
                onChange={(e) => setServiceDetection(e.target.checked)}
              />
            }
            label="Service Detection (-sV)"
          />
          <FormControlLabel
            control={
              <Switch
                checked={scriptScan}
                onChange={(e) => setScriptScan(e.target.checked)}
              />
            }
            label="Script Scan (-sC)"
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleScan}
            disabled={isScanning}
          >
            {isScanning ? "Scanning..." : "Start Scan"}
          </Button>

          <Button
            variant="outlined"
            color="primary"
            onClick={() => setTarget("scanme.nmap.org")}
            disabled={isScanning}
          >
            Example
          </Button>
        </Box>
      </Paper>

      {/* Progress */}
      {isScanning && (
        <Box sx={{ my: 2 }}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="body2" align="center">
            {progress < 100
              ? `Scanning... ${progress.toFixed(2)}% (ETA: ${eta})`
              : "Completed"}
          </Typography>
        </Box>
      )}

      {/* Logs */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Live Log</Typography>
        <List sx={{ maxHeight: 260, overflow: "auto" }}>
          {liveLog.map((log, idx) => (
            <ListItem key={idx} sx={{ py: 0.5 }}>
              <ListItemText primary={log} />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Results */}
      {scanResult && (
        <Paper sx={{ p: 4, bgcolor: '#121212', color: 'white', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Scan Results for
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#4caf50', ml: 1 }}>
              {scanResult.target}
            </Typography>
          </Box>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Status: <Box component="span" sx={{ color: '#4caf50' }}>{scanResult.status === 'completed' ? '✅ Completed' : scanResult.status}</Box>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Detected OS: <Box component="span" sx={{ color: 'rgba(255,255,255,0.7)' }}>{scanResult.detectedOS}</Box>
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Open Ports
          </Typography>
          <List dense>
            {scanResult.ports.length > 0 ? (
              scanResult.ports.map((port, idx) => (
                <ListItem key={idx} sx={{
                  bgcolor: '#1e1e1e',
                  mb: 1,
                  borderRadius: 1,
                  borderLeft: '4px solid #4caf50',
                  transition: 'background-color 0.3s',
                  '&:hover': {
                    bgcolor: '#2c2c2c'
                  }
                }}>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'white' }}>
                        {`Port ${port.port}/${port.protocol}`}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {`State: ${port.state} | Service: ${port.service}`}
                      </Typography>
                    }
                  />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No open ports found" sx={{ color: 'rgba(255,255,255,0.7)' }} />
              </ListItem>
            )}
          </List>
        </Paper>
      )}
    </div>
  );
}