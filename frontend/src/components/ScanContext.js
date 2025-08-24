// src/components/ScanContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const ScanContext = createContext();

const generateId = () => Math.random().toString(36).substr(2, 9);

export const ScanProvider = ({ children }) => {
  const [targets, setTargets] = useState(() => {
    try {
      const storedTargets = localStorage.getItem("targets");
      return storedTargets ? JSON.parse(storedTargets) : [];
    } catch (error) {
      console.error("Failed to load targets from localStorage", error);
      return [];
    }
  });

  // 👇 New global scan state
  const [scanState, setScanState] = useState({
    isScanning: false,
    tool: null,
    progress: 0,
  });

  const addScanResult = (targetName, newScan) => {
    setTargets((prevTargets) => {
      const targetExists = prevTargets.some((target) => target.name === targetName);
      if (targetExists) {
        return prevTargets.map((target) =>
          target.name === targetName
            ? { ...target, scans: [...target.scans, { id: generateId(), ...newScan }] }
            : target
        );
      } else {
        return [
          ...prevTargets,
          { name: targetName, scans: [{ id: generateId(), ...newScan }] },
        ];
      }
    });
  };

  // Persist targets to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("targets", JSON.stringify(targets));
    } catch (error) {
      console.error("Failed to save targets to localStorage", error);
    }
  }, [targets]);

  return (
    <ScanContext.Provider value={{ targets, addScanResult, scanState, setScanState }}>
      {children}
    </ScanContext.Provider>
  );
};

export const useScan = () => useContext(ScanContext);
