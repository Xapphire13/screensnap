import React, { useState } from 'react';
import { styled } from 'linaria/react';
import {
  Crop,
  MoreHorizontal,
  Maximize,
  Crosshair,
  Aperture,
} from 'react-feather';
import { desktopCapturer, remote, MenuItem as MenuItemType } from 'electron';
import bootstrapWindow from '../bootstrapWindow';
import ToolbarButton from '../components/ToolbarButton';
import {
  sendShowOverlay,
  sendCaptureScreenshot,
} from '../utils/IpcRendererUtils';

const { Menu, MenuItem, shell, BrowserWindow } = remote;

const Container = styled.div`
  -webkit-app-region: drag;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  background-color: #333;
  padding: 8px 16px;
  box-sizing: border-box;
`;

function showPopupMenu(menuItems: MenuItemType[], element: HTMLDivElement) {
  const menu = new Menu();
  menuItems.forEach(menu.append);

  menu.popup({ x: element.getBoundingClientRect().left, y: 64 });
}

async function showCaptureSources(element: HTMLDivElement) {
  const sources = await desktopCapturer.getSources({
    types: ['window'],
    fetchWindowIcons: true,
  });

  showPopupMenu(
    [
      new MenuItem({ label: 'Coming soon', enabled: false }),
      ...sources.map(
        (source) =>
          new MenuItem({
            label: source.name,
            icon: source.appIcon.resize({ height: 16 }),
            click: () => sendShowOverlay(),
            enabled: false,
          })
      ),
    ],
    element
  );
}

function showApplicationMenu(element: HTMLDivElement) {
  showPopupMenu(
    [
      new MenuItem({
        label: 'View on GitHub',
        click: () =>
          shell.openExternal('https://github.com/Xapphire13/screensnap'),
      }),
      new MenuItem({ label: 'About', role: 'about' }),
      new MenuItem({ type: 'separator' }),
      new MenuItem({ label: 'Exit', role: 'quit' }),
    ],
    element
  );
}

async function takeScreenshot(overlayWindowId: number) {
  const windows = BrowserWindow.getAllWindows();
  const overlayWindow = windows.find((window) => window.id === overlayWindowId);

  if (overlayWindow) {
    sendCaptureScreenshot(overlayWindow);
  }
}

export default function Toolbar() {
  const [overlayWindowId, setOverlayWindowId] = useState<number>();

  return (
    <Container>
      <ToolbarButton
        icon={Crop}
        onClick={async () => {
          const windowId = await sendShowOverlay();
          setOverlayWindowId(windowId);
        }}
      />
      <ToolbarButton
        icon={Crosshair}
        onClick={(event) => showCaptureSources(event.currentTarget)}
      />
      <ToolbarButton
        icon={Aperture}
        size="large"
        onClick={() => overlayWindowId && takeScreenshot(overlayWindowId)}
      />
      <ToolbarButton
        icon={Maximize}
        onClick={async () => {
          const windowId = await sendShowOverlay({ fullscreen: true });
          setOverlayWindowId(windowId);
        }}
      />
      <ToolbarButton
        icon={MoreHorizontal}
        onClick={(event) => showApplicationMenu(event.currentTarget)}
      />
    </Container>
  );
}

bootstrapWindow(Toolbar);
