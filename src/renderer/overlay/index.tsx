import React, { useRef, useEffect, useState, useCallback } from 'react';
import { styled } from 'linaria/react';
import { remote } from 'electron';
import bootstrapWindow from '../bootstrapWindow';
import ViewFinder from './ViewFinder';
import { BoundingRectangle } from '../../BoundingRectangle';
import {
  sendOverlayReady,
  onSetViewFinderSize,
  onCaptureScreenshot,
} from '../utils/IpcRendererUtils';
import captureScreenshot from '../utils/captureScreenshot';

const { screen } = remote;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const OverlayMask = styled.div<{
  top: number;
  bottom: number;
  left: number;
  right: number;
}>`
  background-color: #000000a0;
  position: absolute;
  top: ${({ top }) => top}px;
  bottom: ${({ bottom }) => bottom}px;
  left: ${({ left }) => left}px;
  right: ${({ right }) => right}px;
`;

export default function Overlay() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [{ height, width }, setOverlaySize] = useState({ width: 0, height: 0 });
  const [viewFinderBounds, setViewFinderBounds] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  const { bottom, left, right, top } = viewFinderBounds;

  const handleViewFinderResize = useCallback(
    (deltas: Partial<BoundingRectangle>) => {
      setViewFinderBounds((prev) => {
        const updated = {
          bottom: prev.bottom + (deltas.bottom ?? 0),
          left: prev.left + (deltas.left ?? 0),
          right: prev.right + (deltas.right ?? 0),
          top: prev.top + (deltas.top ?? 0),
        };

        if (updated.left > updated.right) {
          const clampedValue = deltas.left ? prev.right : prev.left;

          updated.left = clampedValue;
          updated.right = clampedValue;
        }

        if (updated.top > updated.bottom) {
          const clampedValue = deltas.top ? prev.bottom : prev.top;

          updated.top = clampedValue;
          updated.bottom = clampedValue;
        }

        const viewFinderWidth = updated.right - updated.left;
        const viewFinderHeight = updated.bottom - updated.top;

        if (updated.left < 0) {
          updated.left = 0;
          updated.right = updated.left + viewFinderWidth;
        }

        if (updated.right > width) {
          updated.right = width;
          updated.left = updated.right - viewFinderWidth;
        }

        if (updated.top < 0) {
          updated.top = 0;
          updated.bottom = updated.top + viewFinderHeight;
        }

        if (updated.bottom > height) {
          updated.bottom = height;
          updated.top = updated.bottom - viewFinderHeight;
        }

        return updated;
      });
    },
    [height, width]
  );

  useEffect(() => {
    if (containerRef.current) {
      const boundingRect = containerRef.current.getBoundingClientRect();
      setOverlaySize({
        width: boundingRect.width,
        height: boundingRect.height,
      });
    }
  }, []);

  useEffect(() => {
    const cleanup = onSetViewFinderSize((newBounds) => {
      setViewFinderBounds(newBounds);
    });

    return cleanup;
  }, []);

  useEffect(() => {
    const cleanup = onCaptureScreenshot((displayId) => {
      const display = screen.getAllDisplays().find((it) => it.id === displayId);

      if (display) {
        captureScreenshot(display, {
          x: left,
          y: top,
          width: right - left,
          height: bottom - top,
        });
      }
    });

    return cleanup;
  }, [bottom, left, right, top]);

  useEffect(() => {
    sendOverlayReady();
  });

  return (
    <Container ref={containerRef}>
      <OverlayMask top={0} bottom={height - top} left={0} right={0} />
      <OverlayMask top={bottom} bottom={0} left={0} right={0} />
      <OverlayMask
        top={top}
        bottom={height - bottom}
        left={0}
        right={width - left}
      />
      <OverlayMask top={top} bottom={height - bottom} left={right} right={0} />
      <ViewFinder
        onResize={handleViewFinderResize}
        top={top}
        left={left}
        width={right - left}
        height={bottom - top}
      />
    </Container>
  );
}

bootstrapWindow(Overlay);
