import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  Storage,
  Dns,
  Wifi,
  InfoOutlined,
  BugReport,
  ChevronRight,
} from '@mui/icons-material';

// --- Helper Functions and Data ---
const getSeverityColor = (severity) => {
  switch (severity.toLowerCase()) {
    case 'critical':
      return '#ff073a'; // Bright Red
    case 'high':
    case 'medium':
    case 'low':
    default:
      return '#6c757d'; // Grey
  }
};

const demoData = {
  scanStatus: {
    totalTargets: 15,
    activeScans: 3,
    completedScans: 12,
  },
  vulnsPerSeverity: [
    { severity: 'Critical', count: 4, total: 69 },
    { severity: 'High', count: 61, total: 69 },
    { severity: 'Medium', count: 3, total: 69 },
    { severity: 'Low', count: 1, total: 69 },
  ],
  reconSummary: {
    openPorts: 24,
    subdomains: 112,
    emails: 3,
  },
  topVulnerabilities: [
    { name: 'SQL Injection', target: 'api.example.com', severity: 'critical' },
    { name: 'RCE via Unsafe Deserialization', target: 'beta.cloudapp.com', severity: 'high' },
    { name: 'XSS on login form', target: 'example.com', severity: 'medium' },
  ],
  exploitStatus: {
    privEscalation: 'Achieved',
    method: 'Kernel Exploit',
    exfiltrated: '2,400 user records',
  },
  recentActivity: [
    { target: 'example.com', tool: 'Nmap Scan Complete', summary: 'Found 7 open ports.', timestamp: 'Just now' },
    { target: 'beta.cloudapp.com', tool: 'WebVuln Scan Complete', summary: '5 new vulnerabilities found.', timestamp: '5 mins ago' },
    { target: '192.168.1.1', tool: 'DBScan Complete', summary: 'No credentials found.', timestamp: '1 hour ago' },
    { target: 'api.example.com', tool: 'OSINT Scan Complete', summary: '4 new subdomains discovered.', timestamp: '2 hours ago' },
    { target: 'example.com', tool: 'PrivEsc Attempt Failed', summary: 'Exploitation attempt failed.', timestamp: '4 hours ago' },
  ],
};

const CardLayout = ({ title, children, showInfo = false, actionButton = null }) => (
  <Card sx={{ bgcolor: '#121418', borderRadius: 2, height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#FFFFFF' }}>
          {title}
          {showInfo && <InfoOutlined sx={{ fontSize: 16, ml: 0.5, color: '#999' }} />}
        </Typography>
        {actionButton}
      </Box>
      <Divider sx={{ mb: 2, borderColor: '#333' }} />
      {children}
    </CardContent>
  </Card>
);

// --- Main Component ---
export default function DashboardPage() {
  return (
    <Box sx={{ p: 4, bgcolor: '#0c0e12', minHeight: '100vh', color: '#f0f0f0' }}>
      {/* Header and Top Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FFFFFF' }}>
          Overview
        </Typography>
        <Button variant="contained" sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }, color: '#FFFFFF' }}>
          Manage overview
        </Button>
      </Box>

      {/* Main Grid Layout */}
      <Grid container spacing={3}>
        {/* Left Panel */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={3}>
            {/* Target Scan Status */}
            <Grid item xs={12}>
              <CardLayout title="Target Scan Status">
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#0f0' }}>
                  Total Targets
                </Typography>
                <Typography variant="h4" sx={{ color: '#0f0', mb: 2 }}>
                  {demoData.scanStatus.totalTargets}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#0f0' }}>
                  Active Scans
                </Typography>
                <Typography variant="h4" sx={{ color: '#0f0' }}>
                  {demoData.scanStatus.activeScans}
                </Typography>
              </CardLayout>
            </Grid>
            {/* Vulnerabilities per Severity */}
            <Grid item xs={12}>
              <CardLayout title="Vulnerabilities by Severity" actionButton={<Button size="small" endIcon={<ChevronRight />} sx={{ color: '#FFFFFF' }}>See all</Button>}>
                {demoData.vulnsPerSeverity.map((vuln, index) => (
                  <Box key={index} sx={{ mb: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: getSeverityColor(vuln.severity) }}>
                        {vuln.severity}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#f0f0f0' }}>
                        {vuln.count}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(vuln.count / vuln.total) * 100}
                      sx={{
                        height: 8,
                        borderRadius: 5,
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: getSeverityColor(vuln.severity),
                        },
                      }}
                    />
                  </Box>
                ))}
              </CardLayout>
            </Grid>
            {/* Reconnaissance & OSINT Summary */}
            <Grid item xs={12}>
              <CardLayout title="Reconnaissance Summary">
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Dns sx={{ color: '#0f0' }} />
                    <Typography variant="body2" sx={{ color: '#f0f0f0' }}>Open Ports: {demoData.reconSummary.openPorts}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Wifi sx={{ color: '#0f0' }} />
                    <Typography variant="body2" sx={{ color: '#f0f0f0' }}>Subdomains: {demoData.reconSummary.subdomains}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BugReport sx={{ color: '#0f0' }} />
                    <Typography variant="body2" sx={{ color: '#f0f0f0' }}>Emails Found: {demoData.reconSummary.emails}</Typography>
                  </Box>
                </Box>
              </CardLayout>
            </Grid>
          </Grid>
        </Grid>

        {/* Middle Panel */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={3}>
            {/* Top 5 Critical Vulnerabilities */}
            <Grid item xs={12}>
              <CardLayout title="Top 5 Critical Vulnerabilities" actionButton={<Button size="small" endIcon={<ChevronRight />} sx={{ color: '#FFFFFF' }}>See all</Button>}>
                {demoData.topVulnerabilities.map((vuln, index) => (
                  <Box key={index} sx={{ mb: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#f0f0f0' }}>
                      {vuln.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#f0f0f0' }}>
                      <span style={{ color: '#00ff00', fontStyle: 'italic' }}>Affects:</span> {vuln.target}
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip
                        label={vuln.severity}
                        size="small"
                        sx={{
                          bgcolor: getSeverityColor(vuln.severity),
                          color: '#f0f0f0',
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </CardLayout>
            </Grid>
            {/* Exploitation & Post-Exploitation Status */}
            <Grid item xs={12}>
              <CardLayout title="Exploitation Status">
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#f0f0f0' }}>
                    Privilege Escalation:
                    <Box component="span" sx={{ ml: 1 }}>
                      <Chip
                        label={demoData.exploitStatus.privEscalation}
                        color={demoData.exploitStatus.privEscalation === 'Achieved' ? 'success' : 'error'}
                        sx={{ color: '#f0f0f0' }}
                      />
                    </Box>
                  </Typography>
                </Box>
                {demoData.exploitStatus.privEscalation === 'Achieved' && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ color: '#f0f0f0' }}>
                      Method: {demoData.exploitStatus.method}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#f0f0f0' }}>
                      Data Exfiltrated: {demoData.exploitStatus.exfiltrated}
                    </Typography>
                  </Box>
                )}
              </CardLayout>
            </Grid>
          </Grid>
        </Grid>

        {/* Right Panel */}
        <Grid item xs={12} md={4}>
          <CardLayout title="Recent Scan Activity">
            {demoData.recentActivity.map((activity, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#f0f0f0' }}>
                  {activity.tool}
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#999' }}>
                  {activity.timestamp}
                </Typography>
                <Typography variant="body2">
                  <Box component="span" sx={{ fontWeight: 'bold', color: '#00ff00' }}>{activity.target}:</Box> {activity.summary}
                </Typography>
              </Box>
            ))}
          </CardLayout>
        </Grid>
      </Grid>
    </Box>
  );
}