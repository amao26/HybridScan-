import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Collapse,
  IconButton,
  Checkbox,
  TextField,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from "@mui/material";
import { ChevronRight, ExpandMore, Folder, BugReport, ReportProblem } from "@mui/icons-material";

const generateAIPayload = (selectedDetails, type) => {
  const allOpenPorts = new Set();
  const allVulnerabilities = new Set();
  const allTargets = new Set();
  const allTools = new Set();
  const allOS = new Set();
  let totalHighSeverity = 0;

  selectedDetails.forEach(detail => {
    allTargets.add(detail.target);
    allTools.add(detail.tool);
    if (detail.os) {
      allOS.add(detail.os);
    }
    detail.ports.forEach(port => allOpenPorts.add(`${port.port}/${port.service}`));
    detail.vulnerabilities.forEach(vuln => {
      allVulnerabilities.add(`${vuln.severity}: ${vuln.description}`);
      if (vuln.severity.toLowerCase() === 'high') {
        totalHighSeverity++;
      }
    });
  });

  const targetsString = Array.from(allTargets).join(', ');
  const toolsString = Array.from(allTools).join(', ');
  const osString = Array.from(allOS).join(', ') || 'Unknown';
  const openPortsString = Array.from(allOpenPorts).join(', ') || 'None';
  const vulnerabilitiesString = Array.from(allVulnerabilities).join(', ') || 'None';
  const riskLevel = totalHighSeverity > 0 ? 'Critical' : 'Medium to High';

  if (type === "technical") {
    return {
      targets: targetsString,
      tools: toolsString,
      openPorts: openPortsString,
      os: osString,
      vulnerabilities: vulnerabilitiesString,
      advice: [
        `Summary: A comprehensive analysis of scans targeting ${targetsString} using tools like ${toolsString} reveals a combined total of ${Array.from(allOpenPorts).length} open ports and ${Array.from(allVulnerabilities).length} vulnerabilities.`,
        `Reconnaissance: The consolidated findings confirm the completion of the reconnaissance phase. Proceed with advanced enumeration of identified targets.`,
        `Exploitation: Open ports are primary attack vectors. Investigate known exploits for services such as \`ssh\`, \`http\`, and \`https\`. Web vulnerabilities should be chained for escalated impact.`,
        `Prioritization: ${totalHighSeverity} High-severity vulnerabilities are to be prioritized immediately. These findings present the highest probability of a significant bounty. Focus on common misconfigurations, including default credentials, public directories, and exposed APIs on the open ports.`,
        `Reporting: All steps for vulnerability reproduction must be documented clearly. A professional report with proof-of-concept (PoC) videos or screenshots is essential for a successful submission.`,
        `Analysis: Low or medium-severity findings can often be chained to escalate impact. A thorough analysis of all data is recommended.`
      ]
    };
  } else if (type === "management") {
    return {
      targets: targetsString,
      tools: toolsString,
      summary: `The collective security scans of ${targetsString} identified a current risk level assessed as ${riskLevel}. Key findings include exposed services and ${totalHighSeverity} high-severity vulnerabilities.`,
      businessImpact: `Identified vulnerabilities across these targets present significant business risks, including unauthorized data access, service disruption, and reputational damage. An attacker could leverage these findings to compromise systems.`,
      recommendedAction: `Immediate action is recommended. A dedicated team should be assigned to investigate these consolidated findings. The ${totalHighSeverity} high-severity vulnerabilities are a priority for patching. All unnecessary open ports must be closed to minimize the attack surface.`
    };
  }
  return null;
};

export default function AIPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [targets, setTargets] = useState([]);
  const [expandedTarget, setExpandedTarget] = useState(null);
  const [selectedScans, setSelectedScans] = useState([]);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedScanDetails, setSelectedScanDetails] = useState(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [openAnswerDialog, setOpenAnswerDialog] = useState(false);

  useEffect(() => {
    try {
      const storedTargets = localStorage.getItem("targets");
      if (storedTargets) {
        setTargets(JSON.parse(storedTargets));
      }
    } catch (error) {
      console.error("Failed to load targets from localStorage", error);
      setTargets([]);
    }
  }, []);

  const handleToggle = (targetName) => {
    setExpandedTarget(expandedTarget === targetName ? null : targetName);
  };

  const handleCheckboxChange = (scanId) => {
    setSelectedScans((prevSelected) =>
      prevSelected.includes(scanId)
        ? prevSelected.filter((id) => id !== scanId)
        : [...prevSelected, scanId]
    );
  };

  const handleAsk = (type) => {
    if (selectedScans.length === 0) {
      setAnswer({
        type: "error",
        message: "Please select at least one scan result.",
      });
      setOpenAnswerDialog(true);
      return;
    }

    setIsAnalyzing(true);

    setTimeout(() => {
      const allSelectedDetails = selectedScans.map((scanId) => {
        for (const target of targets) {
          const foundScan = target.scans.find((scan) => scan.id === scanId);
          if (foundScan) {
            return {
              target: target.name,
              tool: foundScan.tool,
              ports: foundScan.result.ports || [],
              os: foundScan.result.os || "Unknown",
              vulnerabilities: foundScan.result.vulnerabilities || [],
              summary: foundScan.result.summary || "No summary available.",
              findings: foundScan.result.findings || [],
            };
          }
        }
        return null;
      }).filter(detail => detail !== null);

      const payload = generateAIPayload(allSelectedDetails, type);

      setAnswer({
        type: type,
        payload: payload,
        question: question || `Provide a ${type} analysis.`,
      });

      setIsAnalyzing(false);
      setOpenAnswerDialog(true);
    }, 2000);
  };

  const handleOpenDetailsDialog = (scan) => {
    setSelectedScanDetails(scan);
    setOpenDetailsDialog(true);
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setSelectedScanDetails(null);
  };

  const handleCloseAnswerDialog = () => {
    setOpenAnswerDialog(false);
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return '#ef5350';
      case 'medium':
        return '#ffb300';
      case 'low':
        return '#66bb6a';
      default:
        return 'primary';
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#212121', minHeight: '100vh', color: '#e0e0e0' }}>
      <Typography variant="h4" sx={{ color: "#4fc3f7", mb: 3, fontWeight: 'bold', textShadow: '1px 1px 2px #000' }}>
        AI Assistant 🤖
      </Typography>

      <Typography variant="h6" sx={{ mb: 1, color: '#bdbdbd' }}>
        Selected: {selectedScans.length}
      </Typography>
      <Paper
        className="card"
        sx={{
          p: 2,
          mb: 3,
          backgroundColor: "#333",
          border: "1px solid #424242",
          borderRadius: '12px',
        }}
      >
        <List>
          {targets.length === 0 && (
            <Typography variant="h6" sx={{ textAlign: 'center', py: 2, color: '#9e9e9e' }}>
              No scan results found.
            </Typography>
          )}
          {targets.map((target) => (
            <React.Fragment key={target.name}>
              <ListItem
                component="a"
                onClick={() => handleToggle(target.name)}
                sx={{
                  border: "1px solid #444",
                  borderRadius: "8px",
                  mb: 1,
                  backgroundColor: '#424242',
                  "&:hover": {
                    backgroundColor: "#555",
                  },
                }}
              >
                <Folder sx={{ mr: 2, color: "#e0e0e0" }} />
                <ListItemText
                  primary={
                    <Typography
                      variant="h5"
                      sx={{ color: "#e0e0e0", fontWeight: "bold" }}
                    >
                      {target.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body1" sx={{ color: "#bdbdbd" }}>
                      Scans: {target.scans.length}
                    </Typography>
                  }
                />
                <IconButton>
                  {expandedTarget === target.name ? (
                    <ExpandMore sx={{ color: "#4fc3f7" }} />
                  ) : (
                    <ChevronRight sx={{ color: "#4fc3f7" }} />
                  )}
                </IconButton>
              </ListItem>
              <Collapse in={expandedTarget === target.name} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ ml: 4 }}>
                  {target.scans.map((scan) => (
                    <Paper
                      key={scan.id}
                      onClick={() => handleOpenDetailsDialog(scan)}
                      sx={{
                        p: 2,
                        mb: 2,
                        backgroundColor: "#2c2c2c",
                        border: "1px solid #444",
                        borderRadius: '8px',
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "#383838",
                        },
                      }}
                    >
                      <Checkbox
                        checked={selectedScans.includes(scan.id)}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => handleCheckboxChange(scan.id)}
                        sx={{ color: "#e0e0e0" }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{ color: "#4fc3f7", fontWeight: "bold" }}
                        >
                          {scan.tool}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ color: "#bdbdbd", mt: 1 }}
                        >
                          {scan.result.summary}
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

      <TextField
        label="Ask your question"
        fullWidth
        multiline
        rows={3}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#333',
            color: '#e0e0e0',
            '& fieldset': {
              borderColor: '#424242',
            },
            '&:hover fieldset': {
              borderColor: '#4fc3f7',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#4fc3f7',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#bdbdbd',
          },
        }}
      />

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          onClick={() => handleAsk("technical")}
          sx={{ flex: 1, backgroundColor: '#1e88e5', '&:hover': { backgroundColor: '#1565c0' } }}
        >
          Technical
        </Button>
        <Button
          variant="contained"
          onClick={() => handleAsk("management")}
          sx={{ flex: 1, backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#388e3c' } }}
        >
          General
        </Button>
      </Box>

      {/* Analyzing Progress Dialog */}
      <Dialog open={isAnalyzing} PaperProps={{ sx: { backgroundColor: '#2c2c2c', color: '#e0e0e0' } }}>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          Analyzing Results...
        </DialogTitle>
        <DialogContent sx={{ minWidth: 300, p: 4 }}>
          <LinearProgress color="primary" sx={{ my: 2 }} />
          <Typography variant="body1" sx={{ textAlign: 'center', color: '#9e9e9e' }}>
            Please wait while the AI processes the data.
          </Typography>
        </DialogContent>
      </Dialog>
      
      {/* New AI Answer Dialog (Updated to show single summary) */}
      <Dialog open={openAnswerDialog} onClose={handleCloseAnswerDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ backgroundColor: "#4fc3f7", color: "#212121", fontWeight: "bold", borderBottom: '1px solid #444' }}>
          <Typography variant="h5" sx={{ color: "inherit", fontWeight: "bold" }}>
            AI Answer 🤖
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ backgroundColor: "#2c2c2c" }}>
          {answer && answer.type === "error" ? (
            <Typography color="error" sx={{ fontStyle: 'italic', p: 2, color: '#ef5350' }}>{answer.message}</Typography>
          ) : (
            <Box>
              <Typography variant="body1" sx={{ mt: 2, fontStyle: 'italic', color: "#bdbdbd" }}>
                **Your Question:** "{answer?.question}"
              </Typography>
              {answer?.type === "technical" && answer.payload && (
                <Paper className="card" sx={{ p: 3, my: 3, border: "1px solid #444", backgroundColor: '#333', borderRadius: '12px' }}>
                  <Typography variant="h6" sx={{ color: "#4fc3f7", fontWeight: 'bold' }}>
                    <BugReport sx={{ mr: 1 }} /> Combined Technical Analysis
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" sx={{ color: "#e0e0e0", mb: 1 }}>
                      <Typography component="span" sx={{ fontWeight: 'bold', color: '#bdbdbd' }}>Targets:</Typography> {answer.payload.targets}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#e0e0e0", mb: 1 }}>
                      <Typography component="span" sx={{ fontWeight: 'bold', color: '#bdbdbd' }}>Tools Used:</Typography> {answer.payload.tools}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#e0e0e0", mb: 1 }}>
                      <Typography component="span" sx={{ fontWeight: 'bold', color: '#bdbdbd' }}>Operating Systems:</Typography> {answer.payload.os}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#e0e0e0", mb: 1 }}>
                      <Typography component="span" sx={{ fontWeight: 'bold', color: '#bdbdbd' }}>Open Ports:</Typography> {answer.payload.openPorts}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#e0e0e0", mb: 1 }}>
                      <Typography component="span" sx={{ fontWeight: 'bold', color: '#bdbdbd' }}>Vulnerabilities:</Typography> {answer.payload.vulnerabilities}
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ color: "#66bb6a", mt: 2, fontWeight: 'bold' }}>
                    Bug Bounty Advice:
                  </Typography>
                  <Box component="ul" sx={{ pl: 3, mt: 1, color: '#bdbdbd' }}>
                    {answer.payload.advice.map((item, i) => (
                      <li key={i}><Typography variant="body1" sx={{ color: "inherit" }}>{item}</Typography></li>
                    ))}
                  </Box>
                </Paper>
              )}
              {answer?.type === "management" && answer.payload && (
                <Paper className="card" sx={{ p: 3, my: 3, border: "1px solid #444", backgroundColor: '#333', borderRadius: '12px' }}>
                  <Typography variant="h6" sx={{ color: "#ffb300", fontWeight: 'bold' }}>
                    <ReportProblem sx={{ mr: 1 }} /> Combined Management Summary
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" sx={{ color: "#e0e0e0", mb: 1 }}>
                      <Typography component="span" sx={{ fontWeight: 'bold', color: '#bdbdbd' }}>Summary:</Typography> {answer.payload.summary}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#e0e0e0", mb: 1 }}>
                      <Typography component="span" sx={{ fontWeight: 'bold', color: '#bdbdbd' }}>Business Impact:</Typography> {answer.payload.businessImpact}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#e0e0e0", mb: 1 }}>
                      <Typography component="span" sx={{ fontWeight: 'bold', color: '#bdbdbd' }}>Recommended Action:</Typography> {answer.payload.recommendedAction}
                    </Typography>
                  </Box>
                </Paper>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#2c2c2c", borderTop: '1px solid #444' }}>
          <Button onClick={handleCloseAnswerDialog} variant="contained" sx={{ backgroundColor: '#4fc3f7', color: '#212121' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Existing Scan Details Dialog (Unchanged) */}
      <Dialog open={openDetailsDialog} onClose={handleCloseDetailsDialog} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            backgroundColor: "#4fc3f7",
            color: "#212121",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="h6" sx={{ color: "inherit", fontWeight: "bold" }}>
            {selectedScanDetails?.tool}
          </Typography>
          <Typography variant="body1" sx={{ color: "inherit", opacity: 0.8 }}>
            (ID: {selectedScanDetails?.id})
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ backgroundColor: "#2c2c2c" }}>
          {selectedScanDetails && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box mb={3}>
                  <Typography variant="body1" sx={{ color: "#bdbdbd" }}>
                    Summary: {selectedScanDetails.result.summary}
                  </Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4fc3f7' }}>
                    Scan Status
                  </Typography>
                  <Typography sx={{ color: "#e0e0e0" }}>
                    {selectedScanDetails.status} at {selectedScanDetails.time}
                  </Typography>
                </Box>
                {selectedScanDetails.result.os && (
                  <Box mb={2}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4fc3f7' }}>
                      Operating System
                    </Typography>
                    <Typography sx={{ color: "#e0e0e0" }}>
                      {selectedScanDetails.result.os}
                    </Typography>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                {selectedScanDetails.result.ports && selectedScanDetails.result.ports.length > 0 && (
                  <Box mb={3}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4fc3f7', mb: 1 }}>
                      Open Ports
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedScanDetails.result.ports.map((p, index) => (
                        <Chip
                          key={index}
                          label={`${p.port} (${p.service || 'N/A'})`}
                          variant="outlined"
                          sx={{ borderColor: '#4fc3f7', color: '#e0e0e0' }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
                {selectedScanDetails.result.vulnerabilities && selectedScanDetails.result.vulnerabilities.length > 0 && (
                  <Box mb={3}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4fc3f7', mb: 1 }}>
                      Vulnerabilities
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedScanDetails.result.vulnerabilities.map((v, index) => (
                        <Chip
                          key={index}
                          label={`${v.severity}: ${v.description}`}
                          sx={{
                            backgroundColor: getSeverityColor(v.severity),
                            color: "white"
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
                {selectedScanDetails.result.findings && selectedScanDetails.result.findings.length > 0 && (
                  <Box mb={3}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4fc3f7', mb: 1 }}>
                      Other Findings
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedScanDetails.result.findings.map((finding, index) => (
                        <Chip
                          key={index}
                          label={finding}
                          variant="outlined"
                          sx={{ borderColor: '#bdbdbd', color: '#bdbdbd' }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#2c2c2c", borderTop: '1px solid #444' }}>
          <Button onClick={handleCloseDetailsDialog} variant="contained" sx={{ backgroundColor: '#4fc3f7', color: '#212121' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}