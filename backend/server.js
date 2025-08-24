import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { spawn } from "child_process";
import { createInterface } from "readline";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

/// MongoDB setup
mongoose.connect("mongodb://mongodb:27017/hybridScan", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

const scanResultSchema = new mongoose.Schema({
  target: String,
  status: String,
  detectedOS: String,
  ports: [{ port: String, protocol: String, state: String, service: String }],
  timestamp: { type: Date, default: Date.now },
});

const ScanResult = mongoose.model("ScanResult", scanResultSchema, "ScanResults");


// Nmap scan API

app.get("/scan/stream", (req, res) => {
  const { target, ports, os, service, scripts } = req.query;
  if (!target) return res.status(400).json({ error: "Target is required" });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  let cmdArgs = [];
  if (ports) cmdArgs.push("-p", ports);
  if (os === "true") cmdArgs.push("-O");
  if (service === "true") cmdArgs.push("-sV");
  if (scripts === "true") cmdArgs.push("-sC");
  cmdArgs.push("--stats-every", "5s");
  cmdArgs.push(target);

  const nmap = spawn("nmap", cmdArgs);
  let stdout = "";

  const rl = createInterface({
    input: nmap.stdout,
    terminal: false,
  });

  rl.on("line", (line) => {
    stdout += line + "\n";
    const progressMatch = line.match(/About\s+([\d.]+)%\s+done;.*ETC:\s+(.*)/);
    if (progressMatch) {
      const percent = progressMatch[1];
      const eta = progressMatch[2];
      res.write(`event: progress\ndata: ${JSON.stringify({ percent, eta })}\n\n`);
    } else {
      res.write(`event: log\ndata: ${JSON.stringify({ line })}\n\n`);
    }
  });

  nmap.on("close", (code) => {
    const result = {
      target,
      status: code === 0 ? "completed" : "failed",
      detectedOS: stdout.match(/OS details: (.*)/)?.[1] || "Unknown",
      ports: [...stdout.matchAll(/(\d+)\/(tcp|udp)\s+(\w+)\s+([\w\-\?]+)/g)].map(
        (m) => ({ port: m[1], protocol: m[2], state: m[3], service: m[4] })
      ),
    };

    // Save to MongoDB
    const scanDoc = new ScanResult(result);
    scanDoc.save()
      .then(() => console.log(`✅ Scan saved for ${target}`))
      .catch(err => console.error("❌ Failed to save scan result:", err));

    res.write(`event: result\ndata: ${JSON.stringify(result)}\n\n`);
    res.write(`event: end\ndata: Stream complete\n\n`);
    res.end();
  });

  nmap.on("error", (err) => {
    res.write(`event: error\ndata: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  });
});

//end nmap api




app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));