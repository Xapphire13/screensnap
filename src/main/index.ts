// eslint-disable-next-line import/no-extraneous-dependencies
import {
  app,
  BrowserWindow,
  screen,
  ipcMain,
  systemPreferences,
} from 'electron';

const overlays = new Map<number, BrowserWindow>();

function createToolbarWindow() {
  const { x, y } = screen.getCursorScreenPoint();

  const toolbarWindow = new BrowserWindow({
    x,
    y,
    width: 500,
    height: 56,
    frame: false,
    resizable: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  toolbarWindow.setAlwaysOnTop(true, 'screen-saver', 2);
  toolbarWindow.loadFile('toolbar.html');

  toolbarWindow.show();
}

function createOverlayWindow() {
  const cursorScreen = screen.getDisplayNearestPoint(
    screen.getCursorScreenPoint()
  );

  if ([...overlays.keys()].includes(cursorScreen.id)) {
    // Already open
    return;
  }

  [...overlays.entries()].forEach(([windowId, window]) => {
    window.close();
    overlays.delete(windowId);
  });

  const { x, y, width, height } = cursorScreen.bounds;

  const overlayWindow = new BrowserWindow({
    x,
    y,
    width,
    height,
    hasShadow: false,
    enableLargerThanScreen: true,
    resizable: false,
    movable: false,
    frame: false,
    transparent: true,
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  overlayWindow.setAlwaysOnTop(true, 'screen-saver', 1);
  overlayWindow.loadFile('overlay.html');

  overlayWindow.showInactive();

  overlays.set(cursorScreen.id, overlayWindow);
}

ipcMain.on('show-overlay', () => {
  createOverlayWindow();
});

async function checkScreenRecordingPermissions() {
  const access = systemPreferences.getMediaAccessStatus('screen');

  if (access !== 'granted') {
    // @ts-expect-error
    await systemPreferences.askForMediaAccess('screen');

    app.exit();
  }
}

async function main() {
  await checkScreenRecordingPermissions();

  app.on('ready', createToolbarWindow);
}

main();
