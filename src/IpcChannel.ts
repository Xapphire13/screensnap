enum IpcChannel {
  ShowOverlay = 'show-overlay',
  SetViewFinderSize = 'set-view-finder-size',
  OverlayReady = 'overlay-ready',
  CaptureScreenshot = 'capture-screenshot',
  DisplayInfo = 'display-info',
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
