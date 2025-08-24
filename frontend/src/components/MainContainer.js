import React, { useState } from 'react';
import NmapPage from './NmapPage';

function MainContainer() {
  const [scanEntries, setScanEntries] = useState([]);

  // The function to update the list of scan entries
  const updateTarget = (newScanEntry) => {
    setScanEntries(prevEntries => [...prevEntries, newScanEntry]);
  };

  return (
    <div className="main-container">
      {/* Pass the updateTarget function as a prop to the NmapPage component.
        This allows NmapPage to update the state in MainContainer.
      */}
      <NmapPage updateTarget={updateTarget} />
      
      {/* Display the scan history */}
      <h2>Scan History</h2>
      <ul>
        {scanEntries.map((entry, index) => (
          <li key={index}>
            <strong>Tool:</strong> {entry.tool}, <strong>Target:</strong> {entry.name}, <strong>Status:</strong> {entry.status}, <strong>Time:</strong> {entry.time}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MainContainer;