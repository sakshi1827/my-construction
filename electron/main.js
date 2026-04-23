const { app, BrowserWindow } = require("electron");
const path = require("path");

// Start backend automatically
require("./backend/server");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
  });

  win.loadFile(path.join(__dirname, "build", "index.html"));
}

app.whenReady().then(createWindow);