// eslint-disable-next-line import/no-extraneous-dependencies
import {
  app,
  BrowserWindow,
  screen,
  ipcMain,
  systemPreferences,
  Menu,
  MenuItem,
  DesktopCapturerSource,
} from 'electron';
import IpcChannel, { ShowOverlayOptions } from '../IpcChannel';

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
    return overlays.get(cursorScreen.id)!;
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

  return overlayWindow;
}

ipcMain.on(IpcChannel.ShowOverlay, (_, options: ShowOverlayOptions) => {
  const overlay = createOverlayWindow();

  const newBounds = options.fullscreen
    ? {
        top: 0,
        bottom: overlay.getBounds().height,
        left: 0,
        right: overlay.getBounds().width,
      }
    : options.bounds;

  setTimeout(() => {
    overlay.webContents.send(IpcChannel.SetViewFinderSize, newBounds);
  }, 500);
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
