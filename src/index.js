const {
  app,
  BrowserWindow,
  webContents
} = require('electron');
const path = require('path');
const { electron } = require('process');
let loadingScreen;
let width = 1280, height = 720;

const createLoadingScreen = () => {
  loadingScreen = new BrowserWindow(
    Object.assign({
      width: width,
      height: height,
      frame: false,
      transparent: true
    })
  );

  loadingScreen.setResizable(false);
  loadingScreen.loadURL(
    'file://'+__dirname+'/windows/loading/loading.html'
  );

  loadingScreen.on('closed', () => (loadingScreen = null));
  loadingScreen.webContents.on('did-finish-load', () => {
    loadingScreen.show();
  });
};


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}


const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
      width: width,
      height: height,
      show: false,
      autoHideMenuBar: true,
      useContentSize: true,
      icon: path.join(__dirname, 'icon.ico'),
      webPreferences: {
        nodeIntegration: true
      },
  });

  // and load the index.html of the app.
  mainWindow.loadURL("https://san-peautes.bernie-staging.work");

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
  // mainWindow.webContents.once('dom-ready', function() {
  //     mainWindow.show();
  // })

  mainWindow.webContents.on('did-finish-load', () => {
    if (loadingScreen) {
      loadingScreen.close();
    }
    mainWindow.show();
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {

  createLoadingScreen();
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
      app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.