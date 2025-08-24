// src/pages/Recon/ResultsPage.js

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
  Chip,
} from "@mui/material";
import {
  Folder,
  ChevronRight,
  ExpandMore,
  Delete,
  CreateNewFolder,
  MoreVert,
  Edit,
  DriveFileMove,
} from "@mui/icons-material";

export default function ResultsPage() {
  const [targets, setTargets] = useState([]);
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
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedScanDetails, setSelectedScanDetails] = useState(null);

  // New useEffect to fetch data from MongoDB
  useEffect(() => {
    const fetchTargets = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/scans");
        if (!response.ok) throw new Error("Failed to fetch scans");
        const allScans = await response.json();
        const groupedByTarget = allScans.reduce((acc, scan) => {
          if (!acc[scan.target]) {
            acc[scan.target] = { name: scan.target, scans: [] };
          }
          acc[scan.target].scans.push(scan);
          return acc;
        }, {});
        setTargets(Object.values(groupedByTarget));
      } catch (error) {
        console.error("Failed to fetch targets from DB:", error);
      }
    };
    fetchTargets();
  }, []); // The empty array ensures this runs only once on component mount

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

  // The rest of the handlers (handleRemoveSelected, handleDeleteFolder, etc.) can be modified
  // to also interact with the database if you want permanent changes.
  // For now, they will only modify the local state and not the database.
  const handleRemoveSelected = async () => {
    // ... (Your existing logic to remove from local state)
  };

  const handleDeleteFolder = async (folderName) => {
    // ... (Your existing logic to delete from local state)
  };

  // ... (All other handlers from your original code) ...

  const handleMoveScanToFolder = (destinationFolderName) => {
    // ... (Your existing logic for moving scans)
  };

  const handleOpenDetailsDialog = (scan) => {
    setSelectedScanDetails(scan);
    setOpenDetailsDialog(true);
  };

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
            // ... (rest of the button)
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
                // ... (rest of the button)
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
                    <Paper
                      key={scan._id} // Use MongoDB's _id
                      onClick={() => handleOpenDetailsDialog(scan)}
                      sx={{
                        p: 2,
                        mb: 2,
                        backgroundColor: "var(--panel)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <Checkbox
                        checked={selectedScans.includes(scan._id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleCheckboxChange(scan._id);
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
                        {/* Summary might not exist for a live scan */}
                        {scan.result && scan.result.summary && (
                          <Typography
                            variant="body2"
                            sx={{ color: "var(--text-light)", mt: 1 }}
                          >
                            {scan.result.summary}
                          </Typography>
                        )}
                        {/* Display live progress if the scan is running */}
                        {scan.status === "in-progress" && (
                          <Box mt={1}>
                            <LinearProgress
                              variant="indeterminate"
                              sx={{
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: "rgba(255,255,255,0.1)",
                                "& .MuiLinearProgress-bar": { backgroundColor: "var(--accent)" },
                              }}
                            />
                            <Typography variant="caption" sx={{ color: "var(--text-light)", mt: 0.5, display: "block" }}>
                              In Progress...
                            </Typography>
                          </Box>
                        )}
                        <Typography
                          variant="caption"
                          sx={{ color: "var(--muted)", mt: 1, display: "block" }}
                        >
                          Status: {scan.status} | Time: {new Date(scan.createdAt).toLocaleTimeString()}
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

      {/* ... Dialogs and Menus ... */}
    </div>
  );
}