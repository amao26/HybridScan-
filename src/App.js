import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

// Import all pages
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

function App() {
  console.log("NmapPage:", NmapPage);
  console.log("SubdomainPage:", SubdomainPage);
  console.log("OSINTPage:", OSINTPage);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/nmap" element={<NmapPage />} />
          <Route path="/subdomain" element={<SubdomainPage />} />
          <Route path="/osint" element={<OSINTPage />} />   {/* ✅ Added */}
          <Route path="/webvuln" element={<WebVulnPage />} />
          <Route path="/dbscan" element={<DBScanPage />} />
          <Route path="/exploit" element={<ExploitSimPage />} />
          <Route path="/privesc" element={<PrivEscPage />} />
          <Route path="/postex" element={<PostExPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/ai" element={<AIPage />} />
          <Route path="*" element={<h2>Welcome to HybridScan Dashboard</h2>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
