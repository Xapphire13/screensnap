// eslint-disable-next-line import/no-extraneous-dependencies
import { app, BrowserWindow } from 'electron';

function createWindow() {
  const toolbarWindow = new BrowserWindow({
    width: 500,
    height: 50,
    frame: false,
  });

  toolbarWindow.loadFile('toolbar.html');
}

app.on('ready', createWindow);
