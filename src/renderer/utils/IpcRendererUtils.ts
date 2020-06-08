import { ipcRenderer, remote, BrowserView, BrowserWindow } from 'electron';
import IpcChannel, { ShowOverlayOptions } from '../../IpcChannel';
import { BoundingRectangle } from '../../BoundingRectangle';

export function sendOverlayReady() {
  ipcRenderer.send(IpcChannel.OverlayReady);
}

export function sendShowOverlay(options: ShowOverlayOptions = {}) {
  ipcRenderer.send(IpcChannel.ShowOverlay, options);
}

export function sendGetOverlayWindowInfo(): Promise<[number, number]> {
  return ipcRenderer.invoke(IpcChannel.GetOverlayWindowInfo);
}

export function sendCaptureScreenshot(
  overlayWindow: BrowserWindow,
  screenId: number
) {
  overlayWindow.webContents.send(IpcChannel.CaptureScreenshot, screenId);
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

export const onCaptureScreenshot = createChannelListener<
  (displayId: number) => void
>(IpcChannel.CaptureScreenshot);
