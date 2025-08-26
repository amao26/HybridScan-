import React, { useRef, useState, useEffect } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import axios from "axios";


export default function NmapPage() {
  const [target, setTarget] = useState("");
  const [scanProfile, setScanProfile] = useState("quick");
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState("calculating...");
  const [liveLog, setLiveLog] = useState([]);
  const [scanResult, setScanResult] = useState(null);
  const [nmapCommand, setNmapCommand] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const esRef = useRef(null);

  const scanProfiles = {
    "Intense scan": "-T4 -A -v",
    "Intense scan plus UDP": "-T4 -A -v -sU",
    "Intense scan, all TCP ports": "-p 1-65535 -T4 -A -v",
    "Intense scan, no ping": "-T4 -A -v -Pn",
    "Ping scan": "-sn",
    "Quick scan": "-T4 -F",
    "Quick scan plus": "-sV -T4 -O -F --version-light",
    "Quick traceroute": "-sn --traceroute",
    "Regular scan": "",
    "Slow comprehensive scan": "-sS -sU -T4 -A -v -PE -PP -PS80,443 -PU40125 -PY -g 53 --script \"default or (discovery and safe)\"",
  };

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

  useEffect(() => {
    if (!isTyping) {
      const flags = scanProfiles[scanProfile] || "";
      const command = `nmap ${flags} ${target}`.trim();
      setNmapCommand(command);
    }
  }, [target, scanProfile, isTyping]);

  const handleScan = () => {
    if (!target) return alert("Enter a target IP or domain");

    closeStream();
    setIsScanning(true);
    setProgress(0);
    setEta("calculating...");
    setLiveLog([`🚀 Starting scan from command: ${nmapCommand}`]);
    setScanResult(null);

    const commandParts = nmapCommand.split(' ').filter(part => part.trim() !== '');
    const options = commandParts.slice(1, -1).join(' ');
    const finalTarget = commandParts.length > 1 ? commandParts[commandParts.length - 1] : target;

    const params = new URLSearchParams({
      target: finalTarget,
      options,
      tool: 'Nmap', 
    });

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

    es.addEventListener("result", async (evt) => {
      try {
        const data = JSON.parse(evt.data);
        data.tool = "Nmap"; // 固定工具名
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
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Nmap Scanner
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={7}>
            <TextField
              label="Target (IP / Domain)"
              fullWidth
              value={target}
              onChange={(e) => { setIsTyping(false); setTarget(e.target.value); }}
              sx={{
                "& .MuiInputLabel-root": { color: "white" },
                "& .MuiInputBase-root": {
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                  "&:hover fieldset": { borderColor: "white" },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <FormControl fullWidth>
              <InputLabel id="scan-profile-label" sx={{ color: "white" }}>
                Scan Profile
              </InputLabel>
              <Select
                labelId="scan-profile-label"
                value={scanProfile}
                label="Scan Profile"
                onChange={(e) => { setIsTyping(false); setScanProfile(e.target.value); }}
                sx={{
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.2)" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                  "& .MuiSelect-icon": { color: "white" },
                }}
              >
                {Object.keys(scanProfiles).map((profile) => (
                  <MenuItem key={profile} value={profile}>
                    {profile}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <TextField
          label="Nmap Command"
          fullWidth
          value={nmapCommand}
          onChange={(e) => { setIsTyping(true); setNmapCommand(e.target.value); }}
          sx={{
            mt: 2,
            "& .MuiInputLabel-root": { color: "white" },
            "& .MuiInputBase-root": {
              color: "#90caf9",
              fontFamily: "monospace",
              "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
            },
          }}
        />

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
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
            onClick={() => { setIsTyping(false); setTarget("scanme.nmap.org"); }}
            disabled={isScanning}
          >
            Example
          </Button>
        </Box>
      </Paper>

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

      {scanResult && (
        <Paper sx={{ p: 4, bgcolor: '#1e1e1e', color: 'white', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Tool: {scanResult.tool}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Scan Results for</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#4caf50', ml: 1 }}>
              {scanResult.target}
            </Typography>
          </Box>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Typography>Status: <Box component="span" sx={{ color: '#4caf50' }}>{scanResult.status === 'completed' ? '✅ Completed' : scanResult.status}</Box></Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>Detected OS: <Box component="span" sx={{ color: 'rgba(255,255,255,0.7)' }}>{scanResult.detectedOS || 'N/A'}</Box></Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
          <Typography variant="h6" sx={{ mb: 2 }}>Open Ports</Typography>
          <List dense>
            {scanResult.ports && scanResult.ports.length > 0 ? (
              scanResult.ports.map((port, idx) => (
                <ListItem key={idx} sx={{
                  bgcolor: '#1e1e1e',
                  mb: 1,
                  borderRadius: 1,
                  borderLeft: '4px solid #4caf50',
                  transitionF: 'background-color 0.3s',
                  '&:hover': { bgcolor: '#2c2c2c' }
                }}>
                  <ListItemText
                    primary={<Typography sx={{ fontWeight: 'bold', color: 'white' }}>{`Port ${port.port}/${port.protocol}`}</Typography>}
                    secondary={<Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>{`State: ${port.state} | Service: ${port.service}`}</Typography>}
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
