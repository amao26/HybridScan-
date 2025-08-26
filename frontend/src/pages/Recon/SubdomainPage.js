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
  Divider,
  Box,
  Grid,
  Chip,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/system";
import { ArrowBackIosNew } from "@mui/icons-material";

// Helper function to remove ANSI escape codes from log output
const cleanAnsiCodes = (text) => {
  return text.replace(/\u001b\[.*?m/g, "");
};

// --- Styled Components ---
const PageContainer = styled(Box)({
  maxWidth: 1200,
  margin: "40px auto",
  padding: "16px",
});

const StyledPaper = styled(Paper)({
  padding: "32px",
  backgroundColor: "#161b22", // Deeper background for the card
  borderRadius: "16px",
  boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
  transition: "box-shadow 0.3s ease-in-out",
  "&:hover": {
    boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
  },
});

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    borderRadius: "12px",
    color: "#c9d1d9",
    backgroundColor: "#21262d", // Slightly lighter than card background
    "& fieldset": { borderColor: "rgba(255,255,255,0.15)" },
    "&:hover fieldset": { borderColor: "#58a6ff" },
    "&.Mui-focused fieldset": {
      borderColor: "#58a6ff",
      borderWidth: "2px",
    },
  },
  "& .MuiInputLabel-root": { color: "#c9d1d9" },
});

const AnimatedButton = styled(Button)({
  backgroundColor: "#58a6ff",
  color: "#0d1117",
  fontWeight: "bold",
  padding: "12px 24px",
  transition: "all 0.3s ease-in-out",
  borderRadius: "12px",
  "&:hover": {
    backgroundColor: "#429eff",
    transform: "translateY(-2px)",
  },
});

const SubdomainResultCard = ({ subdomain }) => {
  const isHealthy = true; // Placeholder for actual status check
  const status = "200 OK"; // Placeholder for actual status
  const source = "Amass";

  return (
    <Paper
      elevation={6}
      sx={{
        p: 3,
        mb: 2,
        backgroundColor: "#21262d",
        borderRadius: "12px",
        border: `1px solid ${isHealthy ? "#58a6ff" : "rgba(255, 255, 255, 0.1)"}`,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
        },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" sx={{ color: "#c9d1d9", fontWeight: "bold" }}>
          {subdomain}
        </Typography>
        <Chip
          label={`Status: ${status}`}
          size="small"
          sx={{
            backgroundColor: isHealthy ? "green" : "red",
            color: "#fff",
            fontWeight: "bold",
          }}
        />
      </Box>
      <Divider sx={{ my: 2, backgroundColor: "rgba(255, 255, 255, 0.1)" }} />
      <Box>
        <Typography variant="body2" sx={{ color: "#8b949e" }}>
          Source: {source}
        </Typography>
      </Box>
    </Paper>
  );
};

// Main Component
export default function SubdomainPage({ updateTarget }) {
  const [domain, setDomain] = useState("");
  const [subdomains, setSubdomains] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [eventSource, setEventSource] = useState(null);
  const [fullLogs, setFullLogs] = useState([]);
  const [liveLogs, setLiveLogs] = useState([]);
  const [showFullLogs, setShowFullLogs] = useState(false);

  const handleScan = () => {
    if (!domain.trim()) {
      alert("⚠️ Please enter a valid domain.");
      return;
    }

    setIsScanning(true);
    setSubdomains([]);
    setFullLogs([]);
    setLiveLogs([]);
    setShowFullLogs(false);

    if (eventSource) {
      eventSource.close();
    }

    const apiUrl = `http://localhost:5000/subdomain/amass?domain=${domain}`;
    const source = new EventSource(apiUrl);
    setEventSource(source);

    source.addEventListener("message", (e) => {
      try {
        const parsed = JSON.parse(e.data);
        if (parsed.line) {
          const cleanedLogLine = cleanAnsiCodes(parsed.line);

          setFullLogs((prev) => [...prev, cleanedLogLine]);

          setLiveLogs((prev) => {
            const updatedLogs = [...prev, cleanedLogLine];
            return updatedLogs.slice(Math.max(updatedLogs.length - 10, 0));
          });

          const cleanedLineForSubdomainCheck = cleanedLogLine.trim().toLowerCase();
          if (cleanedLineForSubdomainCheck.includes(domain)) {
            setSubdomains((prev) => {
              if (!prev.includes(cleanedLineForSubdomainCheck)) {
                return [...prev, cleanedLineForSubdomainCheck];
              }
              return prev;
            });
          }
        }
      } catch (error) {
        console.error("Failed to parse log event:", error);
        setFullLogs((prev) => [...prev, `[Parsing Error] ${e.data}`]);
        setLiveLogs((prev) => [...prev, `[Parsing Error] ${e.data}`]);
      }
    });

    source.addEventListener("end", () => {
      setIsScanning(false);
      updateTarget(domain, "Subdomain", subdomains);
      source.close();
    });

    source.addEventListener("error", (e) => {
      console.error(`❌ Scan error (Amass):`, e);
      setFullLogs((prev) => [...prev, `[Tool Error - Amass] Connection lost or error.`]);
      setIsScanning(false);
      source.close();
    });
  };

  return (
    <PageContainer>
      <StyledPaper elevation={8}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                color: "#58a6ff",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              🌐 Subdomain Finder
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#8b949e", mb: 3, textAlign: "center" }}
            >
              Discover subdomains of your target domain using{" "}
              <b>Amass</b>.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <StyledTextField
              label="Target Domain"
              variant="outlined"
              fullWidth
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              disabled={isScanning}
            />
          </Grid>
          <Grid item xs={12}>
            <AnimatedButton
              fullWidth
              variant="contained"
              onClick={handleScan}
              disabled={isScanning}
            >
              {isScanning ? (
                <CircularProgress size={24} sx={{ color: "#0d1117" }} />
              ) : (
                "🚀 Start Scan"
              )}
            </AnimatedButton>
          </Grid>
        </Grid>
      </StyledPaper>

      {/* --- Live Log Section --- */}
      {(isScanning || fullLogs.length > 0) && !showFullLogs && (
        <Paper
          elevation={8}
          sx={{
            p: { xs: 2, sm: 3 },
            mt: 4,
            backgroundColor: "#21262d",
            borderRadius: 3,
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography
              variant="h5"
              sx={{ color: "#58a6ff", fontWeight: "bold" }}
            >
              Live Scan Logs ({subdomains.length} found)
            </Typography>
            {!isScanning && (
              <Button
                variant="outlined"
                sx={{ color: "#8b949e" }}
                onClick={() => setShowFullLogs(true)}
              >
                Show All Logs
              </Button>
            )}
          </Box>
          <Divider sx={{ mb: 2, backgroundColor: "rgba(255,255,255,0.1)" }} />
          <List dense sx={{ maxHeight: 300, overflow: "auto" }}>
            {liveLogs.map((log, index) => (
              <ListItem key={index} sx={{ py: 0.5 }}>
                <ListItemText primary={cleanAnsiCodes(log)} sx={{ color: "#c9d1d9" }} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* --- Full Log Section --- */}
      {showFullLogs && (
        <Paper
          elevation={8}
          sx={{
            p: { xs: 2, sm: 3 },
            mt: 4,
            backgroundColor: "#21262d",
            borderRadius: 3,
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography
              variant="h5"
              sx={{ color: "#58a6ff", fontWeight: "bold" }}
            >
              Full Scan Logs ({fullLogs.length} lines)
            </Typography>
            <Button
              variant="outlined"
              sx={{ color: "#8b949e" }}
              onClick={() => setShowFullLogs(false)}
              startIcon={<ArrowBackIosNew />}
            >
              Back to Live Logs
            </Button>
          </Box>
          <Divider sx={{ mb: 2, backgroundColor: "rgba(255,255,255,0.1)" }} />
          <List dense sx={{ maxHeight: 500, overflow: "auto" }}>
            {fullLogs.map((log, index) => (
              <ListItem key={index} sx={{ py: 0.5 }}>
                <ListItemText primary={cleanAnsiCodes(log)} sx={{ color: "#c9d1d9" }} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* --- Subdomain Results Section --- */}
      {subdomains.length > 0 && !showFullLogs && (
        <Paper
          elevation={8}
          sx={{
            p: { xs: 2, sm: 3 },
            mt: 4,
            backgroundColor: "#21262d",
            borderRadius: 3,
            transition: "box-shadow 0.3s ease-in-out",
            "&:hover": { boxShadow: "0 10px 20px rgba(0,0,0,0.3)" },
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography
              variant="h5"
              sx={{ color: "#58a6ff", fontWeight: "bold" }}
            >
              Results ({subdomains.length} found)
            </Typography>
          </Box>
          <Divider sx={{ mb: 2, backgroundColor: "rgba(255,255,255,0.1)" }} />
          <Grid container spacing={3}>
            {subdomains.map((sub, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <SubdomainResultCard subdomain={sub} />
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
    </PageContainer>
  );
}