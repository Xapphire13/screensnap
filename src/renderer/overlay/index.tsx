import React, { useRef, useEffect, useState, useCallback } from 'react';
import { styled } from 'linaria/react';
import { ipcRenderer } from 'electron';
import bootstrapWindow from '../bootstrapWindow';
import IpcChannel from '../../IpcChannel';
import ViewFinder from './ViewFinder';
import { BoundingRectangle } from '../../BoundingRectangle';

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
  const viewFinderRef = useRef<HTMLDivElement>(null);
  const [mouseDownInViewFinder, setMouseDownInViewFinder] = useState(false);
  const [{ height, width }, setOverlaySize] = useState({ width: 0, height: 0 });
  const [viewFinderBounds, setViewFinderBounds] = useState({
    top: 100,
    bottom: 200,
    left: 100,
    right: 200,
  });
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

        return updated;
      });
    },
    []
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
    const handler = (_, newBounds) => {
      setViewFinderBounds(newBounds);
    };

    ipcRenderer.on(IpcChannel.SetViewFinderSize, handler);

    return () => {
      ipcRenderer.removeListener(IpcChannel.SetViewFinderSize, handler);
    };
  }, []);

  const { bottom, left, right, top } = viewFinderBounds;

  return (
    <Container
      ref={containerRef}
      onMouseDown={({ clientX, clientY }) => {
        if (
          clientX >= left &&
          clientX <= right &&
          clientY >= top &&
          clientY <= bottom
        ) {
          setMouseDownInViewFinder(true);
        }
      }}
      onMouseUp={() => setMouseDownInViewFinder(false)}
      onMouseMove={({ movementX, movementY }) => {
        if (!mouseDownInViewFinder) {
          return;
        }

        setViewFinderBounds((prev) => ({
          ...prev,
          left: prev.left + movementX,
          right: prev.right + movementX,
          top: prev.top + movementY,
          bottom: prev.bottom + movementY,
        }));
      }}
    >
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
        viewFinderRef={viewFinderRef}
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
