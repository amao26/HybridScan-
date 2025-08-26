// src/components/ScanContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const ScanContext = createContext();

export const ScanProvider = ({ children }) => {
  const [completedScans, setCompletedScans] = useState(() => {
    try {
      const storedScans = localStorage.getItem("completedScans");
      return storedScans ? JSON.parse(storedScans) : [];
    } catch (error) {
      console.error("Failed to load completed scans from localStorage", error);
      return [];
    }
  });

  const [inProgressScan, setInProgressScan] = useState(null);

  const startNewScan = (target, tool, scanId) => {
    setInProgressScan({
      _id: scanId,
      target: target,
      tool: tool,
      status: "in-progress",
      progress: 0,
      eta: "N/A",
      timestamp: new Date().toISOString(),
    });
  };

  const updateScanProgress = (scanId, progressData) => {
    if (inProgressScan && inProgressScan._id === scanId) {
      setInProgressScan((prev) => ({
        ...prev,
        progress: progressData.percent,
        eta: progressData.eta,
      }));
    }
  };

  const finalizeScan = (scanId, resultData) => {
    if (inProgressScan && inProgressScan._id === scanId) {
      setCompletedScans((prev) => [resultData, ...prev]);
      setInProgressScan(null);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem("completedScans", JSON.stringify(completedScans));
    } catch (error) {
      console.error("Failed to save completed scans to localStorage", error);
    }
  }, [completedScans]);

  const value = {
    completedScans,
    inProgressScan,
    startNewScan,
    updateScanProgress,
    finalizeScan,
  };

  return <ScanContext.Provider value={value}>{children}</ScanContext.Provider>;
};

export const useScan = () => {
  const context = useContext(ScanContext);
  if (!context) {
    throw new Error("useScan must be used within a ScanProvider");
  }
  return context;
};