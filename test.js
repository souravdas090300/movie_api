const http = require("http");

const hostname = "127.0.0.10";
const port = 3000;

const server = http
  .createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Hello World");
  })
  .listen(8080);

console.log("my first is running on port 8080");

server.listen(port, hostname, () => {
  console.log("Server running at http://${hostname}:${port}/");
});

console.log("Hello,node!");
console.log("Goodbye");

const fs = require("fs");

fs.readFile("input.txt", (err, data) => {
  if (err) {
    throw err;
  }
  console.log("File content: " + data.toString());
});
