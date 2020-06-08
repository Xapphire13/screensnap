enum IpcChannel {
  ShowOverlay = 'show-overlay',
  SetViewFinderSize = 'set-view-finder-size',
  OverlayReady = 'overlay-ready',
  CaptureScreenshot = 'capture-screenshot',
  DisplayInfo = 'display-info',
  FilePath = 'file-path',
  ShowViewer = 'show-viewer',
  ViewerReady = 'viewer-ready',
  CloseWindow = 'close-window',
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
