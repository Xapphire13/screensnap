// eslint-disable-next-line import/no-extraneous-dependencies
import {
  app,
  BrowserWindow,
  screen,
  ipcMain,
  systemPreferences,
} from 'electron';
import IpcChannel, { ShowOverlayOptions } from '../IpcChannel';

const overlays = new Map<number, BrowserWindow>();
let toolbarWindow: BrowserWindow;

function createToolbarWindow() {
  const { x, y } = screen.getCursorScreenPoint();

  const window = new BrowserWindow({
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

  window.setAlwaysOnTop(true, 'screen-saver', 2);
  window.loadFile('toolbar.html');

  window.show();

  return window;
}

async function createOverlayWindow(): Promise<BrowserWindow> {
  const cursorScreen = screen.getDisplayNearestPoint(
    screen.getCursorScreenPoint()
  );

  if ([...overlays.keys()].includes(cursorScreen.id)) {
    // Already open
    return Promise.resolve(overlays.get(cursorScreen.id)!);
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

  overlayWindow.on('close', () => {
    overlays.delete(cursorScreen.id);
  });

  overlayWindow.setAlwaysOnTop(true, 'screen-saver', 1);
  overlayWindow.loadFile('overlay.html');

  overlayWindow.showInactive();

  overlays.set(cursorScreen.id, overlayWindow);

  await new Promise((res) => {
    ipcMain.once(IpcChannel.OverlayReady, () => res());
  });

  overlayWindow.webContents.send(IpcChannel.DisplayInfo, cursorScreen.id);

  return overlayWindow;
}

async function createViewerWindow() {
  const viewerWindow = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  viewerWindow.on('close', () => {
    toolbarWindow = createToolbarWindow();
  });

  viewerWindow.loadFile('./viewer.html');

  await new Promise((res) => {
    ipcMain.once(IpcChannel.ViewerReady, () => res());
  });

  return viewerWindow;
}

ipcMain.handle(
  IpcChannel.ShowOverlay,
  async (_, options: ShowOverlayOptions) => {
    const overlay = await createOverlayWindow();
    const { height, width } = overlay.getBounds();

    const newBounds = options.fullscreen
      ? {
          top: 0,
          bottom: height,
          left: 0,
          right: width,
        }
      : options.bounds ?? {
          top: height / 2 - 50,
          bottom: height / 2 + 50,
          left: width / 2 - 100,
          right: width / 2 + 100,
        };

    overlay.webContents.send(IpcChannel.SetViewFinderSize, newBounds);

    return overlay.id;
  }
);

ipcMain.on(IpcChannel.ShowViewer, async (_, filePath: string) => {
  const viewerWindow = await createViewerWindow();

  toolbarWindow.webContents.send(IpcChannel.CloseWindow);
  viewerWindow.webContents.send(IpcChannel.FilePath, filePath);
});

async function ensureScreenRecordingPermissions() {
  const access = systemPreferences.getMediaAccessStatus('screen');

  if (access !== 'granted') {
    // @ts-expect-error
    await systemPreferences.askForMediaAccess('screen');

    app.exit();
  }
}

async function main() {
  await ensureScreenRecordingPermissions();

  await new Promise((resolve) => app.on('ready', resolve));

  toolbarWindow = createToolbarWindow();
}

main();
