const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");
require("electron-reload")(__dirname, {
  electron: require("electron-prebuilt")
});
let win;
createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    experimentalFeatures: true,
    blinkFeatures: "CSSGridLayout",
    backgroundColor: '#303030',
    icon: path.join(__dirname, './assets/icons/png/appicon.png')
  });
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, "./app/index.html"),
      protocol: "file",
      slashes: true
    })
  );

  win.webContents.openDevTools();

  win.on("closed", () => {
    win = null;
  });
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});
