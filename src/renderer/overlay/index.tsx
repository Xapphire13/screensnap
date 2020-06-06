import React, { useRef, useEffect, useState } from 'react';
import { styled } from 'linaria/react';
import { ipcRenderer } from 'electron';
import bootstrapWindow from '../bootstrapWindow';
import IpcChannel from '../../IpcChannel';
import ViewFinder from './ViewFinder';

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
  const [{ bottom, left, right, top }, setViewFinderBounds] = useState({
    top: 100,
    bottom: 200,
    left: 100,
    right: 200,
  });

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
        top={top}
        left={left}
        width={right - left}
        height={bottom - top}
      />
    </Container>
  );
}

bootstrapWindow(Overlay);
