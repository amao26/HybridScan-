import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  List,
  Box,
  LinearProgress,
  Checkbox,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import {
  Delete,
  PlayCircleOutline,
  CheckCircleOutline,
} from "@mui/icons-material";

export default function ResultsPage() {
  const [scans, setScans] = useState([]);
  const [selectedScans, setSelectedScans] = useState([]);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedScanDetails, setSelectedScanDetails] = useState(null);
  const [filter, setFilter] = useState("all");

  const API_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const response = await fetch(`${API_URL}/results`);
        if (!response.ok) throw new Error("Failed to fetch scans");
        const allScans = await response.json();
        setScans(allScans);
      } catch (error) {
        console.error("Failed to fetch scans from DB:", error);
      }
    };

    fetchScans();
    const intervalId = setInterval(fetchScans, 5000);
    return () => clearInterval(intervalId);
  }, [API_URL]);

  const handleCheckboxChange = (scanId) => {
    setSelectedScans((prev) =>
      prev.includes(scanId) ? prev.filter((id) => id !== scanId) : [...prev, scanId]
    );
  };

  const handleRemoveSelected = async () => {
    try {
      const response = await fetch(`${API_URL}/results/batch-delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedScans }),
      });
      if (!response.ok) throw new Error("Failed to delete selected scans");
      
      setScans((prev) => prev.filter((s) => !selectedScans.includes(s._id)));
      setSelectedScans([]);
    } catch (error) {
      console.error("Error deleting selected scans:", error);
    }
  };

  const handleOpenDetailsDialog = (scan) => {
    setSelectedScanDetails(scan);
    setOpenDetailsDialog(true);
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setSelectedScanDetails(null);
  };

  const filteredScans = scans.filter(scan => {
    switch (filter) {
      case 'running':
        return scan.status === 'in-progress';
      case 'completed':
        return scan.status === 'completed';
      case 'all':
      default:
        return true;
    }
  });

  return (
    <Box className="main" p={3}>
      <Paper
        sx={{
          p: 4,
          mb: 3,
          backgroundColor: "var(--card)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Typography
          variant="h4"
          sx={{ color: "var(--accent)", fontWeight: "bold", mb: 2 }}
        >
          Scan Results Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: "var(--text-light)", mb: 3 }}>
          View and manage all scan history in a single list.
        </Typography>

        <Box sx={{ mb: 2, display: "flex", gap: 2, justifyContent: "flex-start", alignItems: "center" }}>
          <Button
            variant={filter === 'running' ? "contained" : "outlined"}
            startIcon={<PlayCircleOutline />}
            onClick={() => setFilter('running')}
            sx={{ border: "1px solid rgba(255,255,255,0.1)" }}
          >
            Running Scans
          </Button>
          <Button
            variant={filter === 'completed' ? "contained" : "outlined"}
            startIcon={<CheckCircleOutline />}
            onClick={() => setFilter('completed')}
            sx={{ border: "1px solid rgba(255,255,255,0.1)" }}
          >
            Completed Scans
          </Button>
          <Button
            variant={filter === 'all' ? "contained" : "outlined"}
            onClick={() => setFilter('all')}
            sx={{ border: "1px solid rgba(255,255,255,0.1)" }}
          >
            Show All
          </Button>
          {selectedScans.length > 0 && (
            <Button
              variant="contained"
              startIcon={<Delete />}
              onClick={handleRemoveSelected}
              sx={{
                backgroundColor: "#e53935",
                "&:hover": { backgroundColor: "#c62828" },
                ml: 'auto'
              }}
            >
              Remove Selected ({selectedScans.length})
            </Button>
          )}
        </Box>

        <List>
          {filteredScans.length > 0 ? (
            filteredScans.map((scan) => (
              <Grid
                container
                key={scan._id}
                alignItems="center"
                spacing={1}
                mb={2}
              >
                <Grid item>
                  <Checkbox
                    checked={selectedScans.includes(scan._id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleCheckboxChange(scan._id);
                    }}
                    sx={{ color: "var(--text-light)" }}
                  />
                </Grid>
                <Grid item xs>
                  <Paper
                    onClick={() => handleOpenDetailsDialog(scan)}
                    sx={{
                      p: 2,
                      backgroundColor: "var(--panel)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      cursor: "pointer",
                      "&:hover": {
                        border: "1px solid var(--accent)",
                        boxShadow: "0 0 8px rgba(128, 90, 213, 0.4)",
                      },
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ color: "var(--accent)", fontWeight: "bold" }}
                    >
                      {scan.target || "N/A"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "var(--text-light)", mt: 1 }}>
                      Tool: <Box component="span" fontWeight="bold">{scan.tool === 'nmap' ? 'Nmap' : 'N/A'}</Box>
                      <br />
                      Status: <Box component="span" fontWeight="bold">{scan.status || "N/A"}</Box>
                    </Typography>
                    {scan.status === "in-progress" && (
                      <Box mt={1}>
                        <LinearProgress
                          variant="indeterminate"
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: "rgba(255,255,255,0.1)",
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: "var(--accent)",
                            },
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{ color: "var(--text-light)", mt: 0.5, display: "block" }}
                        >
                          In Progress...
                        </Typography>
                      </Box>
                    )}
                    {scan.status === "completed" && scan.ports?.length > 0 && (
                        <Typography variant="body2" sx={{ color: "var(--text-light)", mt: 1 }}>
                          Found <Box component="span" fontWeight="bold">{scan.ports.length}</Box> open ports
                        </Typography>
                    )}
                    <Typography
                      variant="caption"
                      sx={{ color: "var(--muted)", mt: 1, display: "block" }}
                    >
                      Time:{" "}
                      {scan.createdAt
                        ? new Date(scan.createdAt).toLocaleString()
                        : "N/A"}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            ))
          ) : (
            <Typography variant="body1" sx={{ color: "var(--text-light)", textAlign: "center", mt: 4 }}>
              No scan results found.
            </Typography>
          )}
        </List>
      </Paper>

      <Dialog
        open={openDetailsDialog}
        onClose={handleCloseDetailsDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { backgroundColor: "var(--panel)", border: "1px solid rgba(255,255,255,0.1)" },
        }}
      >
        <DialogTitle sx={{ color: "var(--accent)", fontWeight: "bold" }}>
          Scan Details for {selectedScanDetails?.target}
        </DialogTitle>
        <DialogContent dividers>
          {selectedScanDetails ? (
            <Box>
              <Typography variant="body1" sx={{ color: "var(--text)" }}>
                <Box component="span" sx={{ fontWeight: 'bold' }}>Tool:</Box> {selectedScanDetails.tool === 'nmap' ? 'Nmap' : 'N/A'}
              </Typography>
              <Typography variant="body1" sx={{ color: "var(--text)" }}>
                <Box component="span" sx={{ fontWeight: 'bold' }}>Status:</Box> {selectedScanDetails.status || "N/A"}
              </Typography>
              <Typography variant="body1" sx={{ color: "var(--text)" }}>
                <Box component="span" sx={{ fontWeight: 'bold' }}>Timestamp:</Box>{" "}
                {selectedScanDetails.createdAt
                  ? new Date(selectedScanDetails.createdAt).toLocaleString()
                  : "N/A"}
              </Typography>
              <Box mt={3}>
                <Typography variant="h6" sx={{ color: "var(--text)", fontWeight: "bold" }}>
                  Scan Result Summary
                </Typography>
                <Typography variant="body2" sx={{ color: "var(--text-light)", mt: 1 }}>
                  <Box component="span" sx={{ fontWeight: 'bold' }}>Detected OS:</Box> {selectedScanDetails.detectedOS || "N/A"}
                </Typography>
              </Box>
              <Box mt={3}>
                <Typography variant="h6" sx={{ color: "var(--text)", fontWeight: "bold" }}>
                  Port Details ({selectedScanDetails.ports?.length || 0} Open)
                </Typography>
                <List dense sx={{ mt: 1 }}>
                  {selectedScanDetails.ports?.length > 0 ? (
                    selectedScanDetails.ports.map((port, index) => (
                      <Paper
                        key={index}
                        elevation={1}
                        sx={{
                          p: 1.5,
                          my: 1,
                          backgroundColor: "var(--card)",
                          border: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        <Typography sx={{ color: "var(--text)", fontWeight: "bold" }}>
                          Port {port.port}/{port.protocol}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "var(--text-light)", mt: 0.5 }}>
                          <Box component="span" sx={{ fontWeight: 'bold' }}>State:</Box> {port.state} | <Box component="span" sx={{ fontWeight: 'bold' }}>Service:</Box> {port.service || "N/A"}
                          {port.version && (
                            <Box component="span"> | <Box component="span" sx={{ fontWeight: 'bold' }}>Version:</Box> {port.version}</Box>
                          )}
                        </Typography>
                      </Paper>
                    ))
                  ) : (
                    <Typography sx={{ color: "var(--text-light)", fontStyle: "italic" }}>
                      No open ports detected.
                    </Typography>
                  )}
                </List>
              </Box>
            </Box>
          ) : (
            <Typography sx={{ color: "var(--text-light)", fontStyle: "italic" }}>
              No details available.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "var(--panel)" }}>
          <Button onClick={handleCloseDetailsDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}