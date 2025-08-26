import React, { useState, useRef, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Grid,
  Box,
  Divider,
  Chip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import { styled } from "@mui/system";
import axios from "axios";

// --- Styled Components ---
const PageContainer = styled(Box)({
  maxWidth: 1200,
  margin: "40px auto",
  padding: "16px",
});

const StyledPaper = styled(Paper)({
  padding: "32px",
  backgroundColor: "#161b22",
  borderRadius: "16px",
});

const AnimatedButton = styled(Button)({
  backgroundColor: "#58a6ff",
  color: "#0d1117",
  fontWeight: "bold",
  borderRadius: "12px",
});

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    borderRadius: "12px",
    color: "#c9d1d9",
    backgroundColor: "#21262d",
  },
  "& .MuiInputLabel-root": { color: "#c9d1d9" },
});

const ResultCard = styled(Paper)({
  p: 2,
  backgroundColor: "#21262d",
  borderRadius: "12px",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": { transform: "translateY(-4px)", boxShadow: "0 8px 20px rgba(0,0,0,0.4)" },
});

export default function AdvancedOSINTPage() {
  const [query, setQuery] = useState("");
  const [liveLog, setLiveLog] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanStart, setScanStart] = useState(null);
  const [scanEnd, setScanEnd] = useState(null);
  const [showFullResults, setShowFullResults] = useState(false);
  const esRef = useRef(null);

  const closeStream = () => {
    if (esRef.current) { esRef.current.close(); esRef.current = null; }
  };
  useEffect(() => { return () => closeStream(); }, []);

  const handleSearch = () => {
    if (!query.trim()) return;
    closeStream();
    setIsSearching(true);
    setLiveLog([]);
    setScanResult(null);
    setShowFullResults(false);
    setScanStart(new Date());
    setScanEnd(null);

    const url = `http://localhost:5000/osint/username?username=${query}`;
    const es = new EventSource(url);
    esRef.current = es;

    const resultsFound = {};
    const fullLogData = [];

    es.addEventListener("log", (evt) => {
      try {
        const { line } = JSON.parse(evt.data);
        const cleanedLine = line.replace(/\u001b\[.*?m/g, "");
        fullLogData.push(cleanedLine);
        setLiveLog([...fullLogData].slice(-10));

        const foundMatch = cleanedLine.match(/\+\] (.*): (https?:\/\/(.*))/);
        if (foundMatch) resultsFound[foundMatch[1]] = foundMatch[2];
      } catch (e) { console.error("Failed to parse log event:", e); }
    });

    es.addEventListener("end", async () => {
      setIsSearching(false);
      setScanEnd(new Date());
      setScanResult(resultsFound);
      setLiveLog([...fullLogData].slice(-10));

      // --- 保存到 MongoDB ---
      try {
        await axios.post("http://localhost:5000/scan/saveScan", {
          target: query,
          tool: "OSINT",
          status: "completed",
          detectedOS: null,
          ports: [],
          timestamp: new Date(),
          results: resultsFound,
        });
        console.log("OSINT result saved to MongoDB");
      } catch (err) { console.error("Failed to save OSINT result", err); }

      closeStream();
    });

    es.addEventListener("error", () => {
      setLiveLog((prev) => [...prev, "❌ Stream error or connection lost"]);
      setIsSearching(false);
      closeStream();
    });
  };

  const handleCopy = (text) => navigator.clipboard.writeText(text);

  const getLogColor = (log) => {
    if (log.startsWith("🔍")) return "#58a6ff";
    if (log.startsWith("[*]")) return "#f9c74f";
    if (log.startsWith("[+]")) return "#4caf50";
    if (log.startsWith("❌")) return "#f94144";
    return "#c9d1d9";
  };

  return (
    <PageContainer>
      {/* --- Search Panel --- */}
      <StyledPaper>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" sx={{ color: "#58a6ff", fontWeight: "bold", textAlign: "center" }}>
              👤 Username OSINT Lookup
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <StyledTextField
              fullWidth
              label="Enter a username"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isSearching}
            />
          </Grid>
          <Grid item xs={12}>
            <AnimatedButton
              fullWidth
              onClick={handleSearch}
              disabled={isSearching || !query.trim()}
            >
              {isSearching ? <CircularProgress size={24} sx={{ color: "#0d1117" }} /> : "🚀 Start Search"}
            </AnimatedButton>
          </Grid>
        </Grid>
      </StyledPaper>

      <Divider sx={{ my: 4, backgroundColor: "rgba(255,255,255,0.1)" }} />

      {/* --- Live Log --- */}
      {isSearching && (
        <Paper sx={{ p: 2, mt: 4, backgroundColor: "#21262d", borderRadius: 3 }}>
          <Typography variant="h5" sx={{ color: "#58a6ff", mb: 1 }}>Live Search Logs</Typography>
          <List dense sx={{ maxHeight: 300, overflow: "auto", fontFamily: "monospace", fontSize: "0.9rem" }}>
            {liveLog.map((log, idx) => (
              <ListItem key={idx} sx={{ py: 0.5 }}>
                <ListItemText primary={log} sx={{ color: getLogColor(log), whiteSpace: "pre-wrap" }} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* --- Summary + Expandable Results --- */}
      {!isSearching && scanResult && (
        <Paper sx={{ p: 2, mt: 4, backgroundColor: "#21262d", borderRadius: 3 }}>
          <Typography variant="h6" sx={{ color: "#58a6ff", mb: 1 }}>Summary</Typography>
          <Typography>Target: {query}</Typography>
          <Typography>Start: {scanStart?.toLocaleString()}</Typography>
          <Typography>End: {scanEnd?.toLocaleString()}</Typography>
          <Typography>Total Found: {Object.keys(scanResult).length}</Typography>
          <Button onClick={() => setShowFullResults(!showFullResults)} sx={{ mt: 1 }}>
            {showFullResults ? "Hide Details" : "Show All Results"}
          </Button>

          {showFullResults && (
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {Object.keys(scanResult).map((platform) => (
                <Grid item xs={12} sm={6} md={4} key={platform}>
                  <ResultCard>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography sx={{ color: "#c9d1d9", fontWeight: "bold" }}>{platform}</Typography>
                      <Chip label="Found" size="small" sx={{ backgroundColor: "green", color: "#fff" }} />
                    </Box>
                    <Typography
                      component="a"
                      href={scanResult[platform]}
                      target="_blank"
                      sx={{ color: "#8b949e", wordBreak: "break-word" }}
                    >
                      {scanResult[platform]}
                    </Typography>
                    <Box textAlign="right">
                      <IconButton size="small" onClick={() => handleCopy(scanResult[platform])} sx={{ color: "#c9d1d9" }}>
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Box>
                  </ResultCard>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      )}
    </PageContainer>
  );
}
