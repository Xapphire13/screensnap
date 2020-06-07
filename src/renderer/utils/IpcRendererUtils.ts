import { ipcRenderer } from 'electron';
import IpcChannel, { ShowOverlayOptions } from '../../IpcChannel';
import { BoundingRectangle } from '../../BoundingRectangle';

export function sendOverlayReady() {
  ipcRenderer.send(IpcChannel.OverlayReady);
}

export function sendShowOverlay(options: ShowOverlayOptions = {}) {
  ipcRenderer.send(IpcChannel.ShowOverlay, options);
}

export function onSetViewFinderSize(
  callback: (newBounds: BoundingRectangle) => void
) {
  const wrappedCallback = (
    _ev: Electron.IpcRendererEvent,
    ...args: Parameters<typeof callback>
  ) => callback(...args);

  ipcRenderer.on(IpcChannel.SetViewFinderSize, wrappedCallback);

  return () => {
    ipcRenderer.removeListener(IpcChannel.SetViewFinderSize, wrappedCallback);
  };
}
