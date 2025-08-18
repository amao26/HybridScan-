import React, { useState } from "react";

function AIPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAsk = () => {
    setAnswer(`AI Analysis for: "${question}"
- Possible vulnerabilities detected
- Suggested patches applied
- Risk level: Medium`);
  };

  return (
    <div className="main">
      <div className="card">
        <h2>🤖 AI Security Assistant</h2>
        <div className="form-row">
          <input
            className="input"
            placeholder="Ask security question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button className="btn" onClick={handleAsk}>Ask</button>
        </div>
      </div>
      {answer && (
        <div className="card">
          <h3>Answer</h3>
          <pre className="results-pre">{answer}</pre>
        </div>
      )}
    </div>
  );
}

export default AIPage;