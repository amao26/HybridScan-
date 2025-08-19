import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Collapse,
  IconButton,
  Box,
  LinearProgress,
  Checkbox,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Menu,
  MenuItem,
  ListItemIcon,
  Grid,
  Chip, // Import Chip component
} from "@mui/material";
import {
  Folder,
  ChevronRight,
  ExpandMore,
  Save,
  Delete,
  CreateNewFolder,
  MoreVert,
  Edit,
  DriveFileMove,
} from "@mui/icons-material";

const getFormattedTimestamp = () => {
  const now = new Date();
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  return now.toLocaleTimeString("en-US", options);
};

// **CORRECTED defaultTargets DATA STRUCTURE**
const defaultTargets = [
  {
    name: "example.com",
    scans: [
      {
        id: 1,
        tool: "Nmap Scan",
        result: {
          summary: "3 ports open (22, 80, 443)",
          ports: [{ port: 22, service: "ssh" }, { port: 80, service: "http" }, { port: 443, service: "https" }],
          os: "Linux",
          services: ["ssh", "http", "https"],
          vulnerabilities: []
        },
        status: "Completed",
        time: "02:30 PM",
      },
      {
        id: 2,
        tool: "Subdomain Finder",
        result: {
          summary: "Found 2 subdomains",
          findings: ["subdomain-1.example.com", "subdomain-2.example.com"],
        },
        status: "Completed",
        time: "02:28 PM",
      },
    ],
  },
  {
    name: "192.168.1.1",
    scans: [
      {
        id: 3,
        tool: "Database Scan",
        result: {
          summary: "MongoDB: Exposed (Port 27017 is open)",
          findings: ["MySQL: Secure (Port 3306 is closed)", "MongoDB: Exposed (Port 27017 is open)"],
        },
        status: "Completed",
        time: "01:00 PM",
      },
    ],
  },
  {
    name: "test-site.org",
    scans: [
      {
        id: 4,
        tool: "Web Vulnerability Scan",
        result: {
          summary: "Findings: 1 High, 2 Medium",
          vulnerabilities: [{ severity: "High", description: "SQL Injection vulnerability" }, { severity: "Medium", description: "Cross-Site Scripting (XSS)" }],
        },
        status: "Completed",
        time: "10:15 AM",
      },
      {
        id: 5,
        tool: "OSINT Lookup",
        result: {
          summary: "Email found in data breach.",
          findings: ["Email found in data breach."],
        },
        status: "Completed",
        time: "10:10 AM",
      },
    ],
  },
];

export default function ResultsPage() {
  const [targets, setTargets] = useState(() => {
    try {
      const storedTargets = localStorage.getItem("targets");
      return storedTargets ? JSON.parse(storedTargets) : defaultTargets;
    } catch (error) {
      console.error("Failed to load targets from localStorage", error);
      return defaultTargets;
    }
  });

  const [expandedTarget, setExpandedTarget] = useState(null);
  const [selectedScans, setSelectedScans] = useState([]);
  const [editingTarget, setEditingTarget] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [currentMenuTarget, setCurrentMenuTarget] = useState(null);
  const [moveMenuAnchorEl, setMoveMenuAnchorEl] = useState(null);
  const [currentScanToMove, setCurrentScanToMove] = useState(null);

  // New state for the scan details dialog
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedScanDetails, setSelectedScanDetails] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem("targets", JSON.stringify(targets));
    } catch (error) {
      console.error("Failed to save targets to localStorage", error);
    }
  }, [targets]);

  const handleToggle = (targetName) => {
    if (editingTarget !== targetName) {
      setExpandedTarget(expandedTarget === targetName ? null : targetName);
    }
  };

  const handleCheckboxChange = (scanId) => {
    setSelectedScans((prevSelected) =>
      prevSelected.includes(scanId)
        ? prevSelected.filter((id) => id !== scanId)
        : [...prevSelected, scanId]
    );
  };

  const handleRemoveSelected = () => {
    if (selectedScans.length === 0) {
      alert("No scans selected to remove.");
      return;
    }
    const confirmed = window.confirm(
      `Are you sure you want to remove ${selectedScans.length} selected scans?`
    );
    if (!confirmed) return;

    setTargets((prevTargets) =>
      prevTargets.map((target) => ({
        ...target,
        scans: target.scans.filter(
          (scan) => !selectedScans.includes(scan.id)
        ),
      }))
    );
    setSelectedScans([]);
  };

  const handleDeleteFolder = (folderName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the folder "${folderName}" and all its contents?`
    );
    if (!confirmed) return;

    setTargets((prevTargets) =>
      prevTargets.filter((target) => target.name !== folderName)
    );
    if (expandedTarget === folderName) {
      setExpandedTarget(null);
    }
    handleMenuClose();
  };

  const handleOpenSaveDialog = () => {
    setOpenSaveDialog(true);
  };

  const handleCloseSaveDialog = () => {
    setOpenSaveDialog(false);
    setNewFolderName("");
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      alert("Please enter a valid folder name.");
      return;
    }

    const selectedScanData = [];
    const remainingTargets = targets.map(target => {
      const remainingScans = target.scans.filter(scan => {
        if (selectedScans.includes(scan.id)) {
          selectedScanData.push(scan);
          return false;
        }
        return true;
      });
      return { ...target, scans: remainingScans };
    });

    const newFolder = {
      name: newFolderName,
      scans: selectedScanData
    };

    setTargets([...remainingTargets, newFolder]);
    setSelectedScans([]);
    handleCloseSaveDialog();
  };

  const handleCreateNewFolder = () => {
    const newFolderNamePrompt = window.prompt("Enter the name for the new folder:");
    if (newFolderNamePrompt && newFolderNamePrompt.trim() !== "") {
      const newFolder = {
        name: newFolderNamePrompt.trim(),
        scans: []
      };
      setTargets(prevTargets => [...prevTargets, newFolder]);
    } else {
      alert("Please enter a valid folder name.");
    }
  };

  const handleStartEdit = (targetName) => {
    setEditingTarget(targetName);
    setEditingName(targetName);
    handleMenuClose();
  };

  const handleSaveEdit = (oldName) => {
    const newName = editingName.trim();
    if (newName !== "" && newName !== oldName) {
      setTargets((prevTargets) =>
        prevTargets.map((target) =>
          target.name === oldName ? { ...target, name: newName } : target
        )
      );
    }
    setEditingTarget(null);
    setEditingName("");
  };

  const handleKeyPress = (event, oldName) => {
    if (event.key === "Enter") {
      handleSaveEdit(oldName);
    }
  };

  const handleMenuClick = (event, targetName) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setCurrentMenuTarget(targetName);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setCurrentMenuTarget(null);
  };

  const handleMoveMenuClick = (event, scan, sourceFolderName) => {
    event.stopPropagation();
    setMoveMenuAnchorEl(event.currentTarget);
    setCurrentScanToMove({ scan, sourceFolderName });
  };

  const handleMoveMenuClose = () => {
    setMoveMenuAnchorEl(null);
    setCurrentScanToMove(null);
  };

  const handleMoveScanToFolder = (destinationFolderName) => {
    const scanToMove = currentScanToMove.scan;
    const sourceFolderName = currentScanToMove.sourceFolderName;

    if (!scanToMove || sourceFolderName === destinationFolderName) {
      handleMoveMenuClose();
      return;
    }

    setTargets(prevTargets => {
      let movedScan = null;
      const newTargets = prevTargets.map(target => {
        if (target.name === sourceFolderName) {
          const remainingScans = target.scans.filter(scan => {
            if (scan.id === scanToMove.id) {
              movedScan = scan;
              return false;
            }
            return true;
          });
          return { ...target, scans: remainingScans };
        }
        return target;
      });

      if (movedScan) {
        return newTargets.map(target => {
          if (target.name === destinationFolderName) {
            return { ...target, scans: [...target.scans, movedScan] };
          }
          return target;
        });
      }
      return newTargets;
    });

    handleMoveMenuClose();
  };

  // Handler to open the details dialog
  const handleOpenDetailsDialog = (scan) => {
    setSelectedScanDetails(scan);
    setOpenDetailsDialog(true);
  };

  // Handler to close the details dialog
  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setSelectedScanDetails(null);
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
        <Typography
          variant="h4"
          sx={{ color: "var(--accent)", fontWeight: "bold", mb: 2 }}
        >
          Targets Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: "var(--text-light)", mb: 3 }}>
          View and manage the scan history for your targets.
        </Typography>
        <Box sx={{ mb: 2, display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            startIcon={<CreateNewFolder />}
            onClick={handleCreateNewFolder}
            sx={{ backgroundColor: "#1e88e5", "&:hover": { backgroundColor: "#1565c0" } }}
          >
            New Folder
          </Button>
          {selectedScans.length > 0 && (
            <>
              <Button
                variant="contained"
                startIcon={<Delete />}
                onClick={handleRemoveSelected}
                sx={{ backgroundColor: "#e53935", "&:hover": { backgroundColor: "#c62828" } }}
              >
                Remove Selected
              </Button>
              <Button
                variant="contained"
                startIcon={<Folder />}
                onClick={handleOpenSaveDialog}
                sx={{ backgroundColor: "#4caf50", "&:hover": { backgroundColor: "#388e3c" } }}
              >
                Save to Folder
              </Button>
            </>
          )}
        </Box>
        <List>
          {targets.map((target) => (
            <React.Fragment key={target.name}>
              <ListItem
                component="a"
                onClick={() => handleToggle(target.name)}
                sx={{
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "8px",
                  mb: 1,
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.05)",
                  },
                }}
              >
                <Folder sx={{ mr: 2, color: "var(--text)" }} />
                <ListItemText
                  primary={
                    editingTarget === target.name ? (
                      <TextField
                        variant="standard"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, target.name)}
                        autoFocus
                        size="small"
                        sx={{ input: { color: "var(--text)", fontWeight: "bold", fontSize: "1.5rem" } }}
                      />
                    ) : (
                      <Typography
                        variant="h6"
                        sx={{ color: "var(--text)", fontWeight: "bold" }}
                      >
                        {target.name}
                      </Typography>
                    )
                  }
                  secondary={
                    <Typography variant="body2" sx={{ color: "var(--text-light)" }}>
                      Scans: {target.scans.length}
                    </Typography>
                  }
                />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton onClick={(e) => handleMenuClick(e, target.name)}>
                    <MoreVert sx={{ color: "var(--text)" }} />
                  </IconButton>
                  <IconButton>
                    {expandedTarget === target.name ? (
                      <ExpandMore sx={{ color: "var(--accent)" }} />
                    ) : (
                      <ChevronRight sx={{ color: "var(--accent)" }} />
                    )}
                  </IconButton>
                </Box>
              </ListItem>
              <Collapse in={expandedTarget === target.name} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ ml: 4 }}>
                  {target.scans.map((scan) => (
                    // Add onClick handler here to open the dialog
                    <Paper
                      key={scan.id}
                      onClick={() => handleOpenDetailsDialog(scan)}
                      sx={{
                        p: 2,
                        mb: 2,
                        backgroundColor: "var(--panel)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer", // Add a pointer cursor to indicate it's clickable
                      }}
                    >
                      <Checkbox
                        checked={selectedScans.includes(scan.id)}
                        onChange={(e) => {
                          e.stopPropagation(); // Prevents dialog from opening when checkbox is clicked
                          handleCheckboxChange(scan.id);
                        }}
                        sx={{ color: "var(--text-light)" }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Typography
                            variant="subtitle1"
                            sx={{ color: "var(--accent)", fontWeight: "bold" }}
                          >
                            {scan.tool}
                          </Typography>
                          <IconButton onClick={(e) => handleMoveMenuClick(e, scan, target.name)}>
                            <DriveFileMove sx={{ color: "var(--text)" }} />
                          </IconButton>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{ color: "var(--text-light)", mt: 1 }}
                        >
                          {scan.result.summary}
                        </Typography>
                        {scan.status === "Running" && scan.progress !== undefined && (
                          <Box mt={1}>
                            <LinearProgress
                              variant="determinate"
                              value={scan.progress}
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
                              {scan.progress}% Complete
                            </Typography>
                          </Box>
                        )}
                        <Typography
                          variant="caption"
                          sx={{ color: "var(--muted)", mt: 1, display: "block" }}
                        >
                          Status: {scan.status} | Time: {scan.time}
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Save to Folder Dialog */}
      <Dialog open={openSaveDialog} onClose={handleCloseSaveDialog}>
        <DialogTitle>Save to Folder</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for the new folder.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Folder Name"
            type="text"
            fullWidth
            variant="standard"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSaveDialog}>Cancel</Button>
          <Button onClick={handleCreateFolder} startIcon={<CreateNewFolder />}>Create Folder</Button>
        </DialogActions>
      </Dialog>
      
      {/* Folder Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleStartEdit(currentMenuTarget)}>
          <ListItemIcon><Edit /></ListItemIcon>Edit
        </MenuItem>
        <MenuItem onClick={() => handleDeleteFolder(currentMenuTarget)}>
          <ListItemIcon><Delete sx={{ color: "red" }} /></ListItemIcon>Delete
        </MenuItem>
      </Menu>

      {/* Move Scan Menu */}
      <Menu
        anchorEl={moveMenuAnchorEl}
        open={Boolean(moveMenuAnchorEl)}
        onClose={handleMoveMenuClose}
      >
        <MenuItem disabled>Move to:</MenuItem>
        {targets.map((target) => (
          <MenuItem
            key={target.name}
            onClick={() => handleMoveScanToFolder(target.name)}
            disabled={currentScanToMove && currentScanToMove.sourceFolderName === target.name}
          >
            <ListItemIcon><Folder /></ListItemIcon>{target.name}
          </MenuItem>
        ))}
      </Menu>

      {/* Scan Details Dialog (Advanced) */}
      <Dialog open={openDetailsDialog} onClose={handleCloseDetailsDialog} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            backgroundColor: "var(--accent-primary)",
            color: "var(--card)",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="h6" sx={{ color: "inherit", fontWeight: "bold" }}>
            {selectedScanDetails?.tool}
          </Typography>
          <Typography variant="body2" sx={{ color: "inherit", opacity: 0.8 }}>
            (ID: {selectedScanDetails?.id})
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ backgroundColor: "var(--card)" }}>
          {selectedScanDetails && (
            <Grid container spacing={4}>
              {/* Left Column: Summary and Basic Info */}
              <Grid item xs={12} md={6}>
                <Box mb={3}>
                  <Typography variant="body1" component="div" sx={{ color: "var(--text-light)" }}>
                    <b>Summary:</b> {selectedScanDetails.result.summary}
                  </Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'var(--accent)' }}>
                    Scan Status
                  </Typography>
                  <Typography sx={{ color: "var(--text)" }}>
                    {selectedScanDetails.status} at {selectedScanDetails.time}
                  </Typography>
                </Box>
                {selectedScanDetails.result.os && (
                  <Box mb={2}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'var(--accent)' }}>
                      Operating System
                    </Typography>
                    <Typography sx={{ color: "var(--text)" }}>
                      {selectedScanDetails.result.os}
                    </Typography>
                  </Box>
                )}
              </Grid>

              {/* Right Column: Findings (Chips) */}
              <Grid item xs={12} md={6}>
                {selectedScanDetails.result.ports && selectedScanDetails.result.ports.length > 0 && (
                  <Box mb={3}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'var(--accent)', mb: 1 }}>
                      Open Ports
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedScanDetails.result.ports.map((p, index) => (
                        <Chip
                          key={index}
                          label={`${p.port} (${p.service || 'N/A'})`}
                          variant="outlined"
                          sx={{ borderColor: 'var(--accent)', color: 'var(--text-light)' }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
                {selectedScanDetails.result.vulnerabilities && selectedScanDetails.result.vulnerabilities.length > 0 && (
                  <Box mb={3}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'var(--accent)', mb: 1 }}>
                      Vulnerabilities
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedScanDetails.result.vulnerabilities.map((v, index) => (
                        <Chip
                          key={index}
                          label={`${v.severity}: ${v.description}`}
                          sx={{
                            backgroundColor: v.severity === "High" ? "#d32f2f" : "#fbc02d",
                            color: "white"
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
                {selectedScanDetails.result.findings && selectedScanDetails.result.findings.length > 0 && (
                  <Box mb={3}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'var(--accent)', mb: 1 }}>
                      Other Findings
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedScanDetails.result.findings.map((finding, index) => (
                        <Chip
                          key={index}
                          label={finding}
                          variant="outlined"
                          sx={{ borderColor: 'var(--text-light)', color: 'var(--text-light)' }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "var(--card)" }}>
          <Button onClick={handleCloseDetailsDialog} variant="contained" sx={{ backgroundColor: 'var(--accent)', color: 'var(--card)' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}