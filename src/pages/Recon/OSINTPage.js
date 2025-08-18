import React, { useState } from "react";

export default function OSINTPage() {
  const [query, setQuery] = useState("");
  const [info, setInfo] = useState([]);

  const handleSearch = () => {
    setInfo([
      `Found LinkedIn profile for ${query || "john_doe"}`,
      `Email leaked: ${query || "john"}@mail.com`,
      `Related domains: ${query || "john"}corp.com`,
    ]);
  };

  return (
    <div className="main">
      <div className="card">
        <h2>🕵️ OSINT Lookup</h2>
        <div className="form-row">
          <input
            className="input"
            placeholder="Enter name/email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn" onClick={handleSearch}>Search</button>
        </div>
      </div>
      {info.length > 0 && (
        <div className="card">
          <h3>Results</h3>
          <ul className="history-list">
            {info.map((item, i) => (
              <li key={i} className="history-item">{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
