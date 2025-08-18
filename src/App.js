import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LinearProgress, Typography, Box } from "@mui/material";
import  Layout  from "./components/Layout";
// In App.js
import { ScanProvider, useScan } from './components/ScanContext'; 

// Pages
import DashboardPage from "./pages/DashboardPage";
import NmapPage from "./pages/Recon/NmapPage";
import SubdomainPage from "./pages/Recon/SubdomainPage";
import OSINTPage from "./pages/Recon/OSINTPage";
import WebVulnPage from "./pages/Vuln/WebVulnPage";
import DBScanPage from "./pages/Vuln/DBScanPage";
import ExploitSimPage from "./pages/Exploit/ExploitSimPage";
import PrivEscPage from "./pages/Exploit/PrivEscPage";
import PostExPage from "./pages/Exploit/PostExPage";
import ResultsPage from "./pages/Results/ResultsPage";
import AIPage from "./pages/Results/AIPage";

// Component to display the global scan status
const GlobalScanStatus = () => {
  const { scanState } = useScan();

  if (!scanState.isScanning) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '80%',
        maxWidth: '500px',
        p: 2,
        bgcolor: 'var(--card)',
        borderRadius: 2,
        boxShadow: 3,
        zIndex: 100,
      }}
    >
      <Typography variant="body2" sx={{ color: "var(--text)", textAlign: "center", mb: 1 }}>
        Running {scanState.tool} scan... ({scanState.progress}%)
      </Typography>
      <LinearProgress
        variant="determinate"
        value={scanState.progress}
        sx={{
          backgroundColor: "var(--muted)",
          '& .MuiLinearProgress-bar': { backgroundColor: "var(--accent)" }
        }}
      />
    </Box>
  );
};

export default function App() {
  return (
    <Router>
      <ScanProvider>
        <Layout>
          <Routes>
            {/* Recon */}
            <Route path="/" element={<DashboardPage />} />
            <Route path="/recon/nmappage" element={<NmapPage />} />
            <Route path="/recon/subdomain" element={<SubdomainPage />} />
            <Route path="/recon/osint" element={<OSINTPage />} />

            {/* Vuln */}
            <Route path="/vuln/web" element={<WebVulnPage />} />
            <Route path="/vuln/dbscan" element={<DBScanPage />} />

            {/* Exploit */}
            <Route path="/exploit/sim" element={<ExploitSimPage />} />
            <Route path="/exploit/privesc" element={<PrivEscPage />} />
            <Route path="/exploit/postex" element={<PostExPage />} />

            {/* Results */}
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/ai" element={<AIPage />} />
            
            <Route path="*" element={<h2>Not found</h2>} />
          </Routes>
        </Layout>
        <GlobalScanStatus />
      </ScanProvider>
    </Router>
  );
}