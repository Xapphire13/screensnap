import { ipcRenderer, BrowserWindow } from 'electron';
import IpcChannel, { ShowOverlayOptions } from '../../IpcChannel';
import { BoundingRectangle } from '../../BoundingRectangle';

export function sendOverlayReady() {
  ipcRenderer.send(IpcChannel.OverlayReady);
}

export function sendShowOverlay(
  options: ShowOverlayOptions = {}
): Promise<number> {
  return ipcRenderer.invoke(IpcChannel.ShowOverlay, options);
}

export function sendCaptureScreenshot(overlayWindow: BrowserWindow) {
  overlayWindow.webContents.send(IpcChannel.CaptureScreenshot);
}

function createChannelListener<T extends (...args: any) => void>(
  channel: IpcChannel
) {
  return (callback: T) => {
    const wrappedCallback = (_ev: Electron.IpcRendererEvent, ...args: any) =>
      callback(...args);
    ipcRenderer.on(channel, wrappedCallback);

    return () => {
      ipcRenderer.removeListener(channel, wrappedCallback);
    };
  };
}

export const onSetViewFinderSize = createChannelListener<
  (newBounds: BoundingRectangle) => void
>(IpcChannel.SetViewFinderSize);

export const onCaptureScreenshot = createChannelListener(
  IpcChannel.CaptureScreenshot
);

export const onDisplayInfo = createChannelListener<(displayId: number) => void>(
  IpcChannel.DisplayInfo
);
