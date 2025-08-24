// App.js

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { LinearProgress, Typography, Box } from "@mui/material";
import Layout from "./components/Layout";
import { ScanProvider, useScan } from './components/ScanContext';

// Pages
import DashboardPage from "./pages/DashboardPage";
import NmapPage from "./pages/Recon/NmapPage";
import SubdomainPage from "./pages/Recon/SubdomainPage";
import OSINTPage from "./pages/Recon/OSINTPage";
import WebVulnPage from "./pages/Vuln/WebVulnPage";
import DBScanPage from "./pages/Vuln/DBScanPage";
import PrivEscPage from "./pages/Exploit/PrivEscPage";
import PostExPage from "./pages/Exploit/PostExPage";
import ResultsPage from "./pages/Results/ResultsPage";
import AIPage from "./pages/Results/AIPage";


export default function App() {
  const [selectedResult, setSelectedResult] = useState(null);

  const MainRoutes = () => {
    const navigate = useNavigate();

    const handleResultSelect = (result) => {
      setSelectedResult(result);
      navigate("/ai");
    };

    return (
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/recon/nmappage" element={<NmapPage />} />
        <Route path="/recon/subdomain" element={<SubdomainPage />} />
        <Route path="/recon/osint" element={<OSINTPage />} />
        <Route path="/vuln/web" element={<WebVulnPage />} />
        <Route path="/vuln/dbscan" element={<DBScanPage />} />
        <Route path="/exploit/privesc" element={<PrivEscPage />} />
        <Route path="/exploit/postex" element={<PostExPage />} />
        <Route path="/results" element={<ResultsPage onResultSelect={handleResultSelect} />} />
        <Route path="/ai" element={<AIPage selectedResult={selectedResult} />} />
        <Route path="*" element={<h2>Not found</h2>} />
      </Routes>
    );
  };

  return (
    <Router>
      <ScanProvider>
        <Layout>
          <MainRoutes />
        </Layout>
      </ScanProvider>
    </Router>
  );
}