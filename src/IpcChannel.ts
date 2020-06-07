enum IpcChannel {
  ShowOverlay = 'show-overlay',
  SetViewFinderSize = 'set-view-finder-size',
  OverlayReady = 'overlay-ready',
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
