const WebSocket = require("ws");
const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, req.url);

  if (req.url === "/") {
    filePath = path.join(__dirname, "display.html");
  }

  const ext = path.extname(filePath);
  const map = {
    ".html": "text/html",
    ".js": "text/javascript"
  };

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
    } else {
      res.writeHead(200, { "Content-Type": map[ext] || "text/plain" });
      res.end(content);
    }
  });
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  ws.on("message", (msg) => {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg.toString());
      }
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Server running"));
