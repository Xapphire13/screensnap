enum IpcChannel {
  ShowOverlay = 'show-overlay',
  SetViewFinderSize = 'set-view-finder-size',
  OverlayReady = 'overlay-ready',
  GetOverlayWindowInfo = 'get-overlay-window-info',
  CaptureScreenshot = 'capture-screenshot',
}

export interface ShowOverlayOptions {
  fullscreen?: boolean;
  bounds?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export default IpcChannel;
