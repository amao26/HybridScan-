// src/contexts/ScanContext.js
import React, { createContext, useContext, useState } from 'react';

const ScanContext = createContext(null);

export function ScanProvider({ children }) {
    // Your state and functions here
    const [scanState, setScanState] = useState({
        isScanning: false,
        results: null,
        error: null,
    });

    // The function you want to expose
    const startScan = (tool, data) => {
        setScanState({
            isScanning: true,
            results: null,
            error: null,
        });
        // Simulate API call or some other async work
        setTimeout(() => {
            setScanState({
                isScanning: false,
                results: data, // Or the actual API results
                error: null,
            });
        }, 3000);
    };

    const value = { scanState, startScan };

    return (
        <ScanContext.Provider value={value}>
            {children}
        </ScanContext.Provider>
    );
}

export function useScan() {
    const context = useContext(ScanContext);
    if (context === null) {
        throw new Error('useScan must be used within a ScanProvider');
    }
    return context;
}