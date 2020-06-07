import React, { useCallback, useMemo } from 'react';
import { styled } from 'linaria/react';
import { BoundingRectangle } from '../../BoundingRectangle';

const BORDER_THICKNESS = 1;

const Container = styled.div<{
  top: number;
  left: number;
  width: number;
  height: number;
}>`
  position: absolute;
  cursor: move;
  border: ${BORDER_THICKNESS}px solid white;
  top: ${({ top }) => top - BORDER_THICKNESS}px;
  left: ${({ left }) => left - BORDER_THICKNESS}px;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
`;

const ResizeHandle = styled.div<{
  hAnchor: 'left' | 'center' | 'right';
  vAnchor: 'top' | 'center' | 'bottom';
}>`
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: white;
  border: 1px solid grey;
  border-radius: 5px;
  left: ${({ hAnchor }) => {
    if (hAnchor === 'left') {
      return '-5px';
    }
    if (hAnchor === 'center') {
      return '50%';
    }

    return '';
  }};
  right: ${({ hAnchor }) => (hAnchor === 'right' ? '-5px' : '')};
  top: ${({ vAnchor }) => {
    if (vAnchor === 'top') {
      return '-5px';
    }
    if (vAnchor === 'center') {
      return '50%';
    }

    return '';
  }};
  bottom: ${({ vAnchor }) => (vAnchor === 'bottom' ? '-5px' : '')};
  transform: translate(
    ${({ hAnchor }) => (hAnchor === 'center' ? '-50%' : '0px')},
    ${({ vAnchor }) => (vAnchor === 'center' ? '-50%' : '0px')}
  );
  cursor: ${({ vAnchor, hAnchor }) => {
    if (vAnchor === 'top' && hAnchor === 'left') {
      return 'nwse-resize';
    }
    if (vAnchor === 'top' && hAnchor === 'center') {
      return 'ns-resize';
    }
    if (vAnchor === 'top' && hAnchor === 'right') {
      return 'nesw-resize';
    }
    if (vAnchor === 'center' && hAnchor === 'left') {
      return 'ew-resize';
    }
    if (vAnchor === 'center' && hAnchor === 'right') {
      return 'ew-resize';
    }
    if (vAnchor === 'bottom' && hAnchor === 'left') {
      return 'nesw-resize';
    }
    if (vAnchor === 'bottom' && hAnchor === 'center') {
      return 'ns-resize';
    }

    // Bottom right
    return 'nwse-resize';
  }};
`;

export type ViewFinderProps = {
  viewFinderRef: React.Ref<HTMLDivElement>;
  top: number;
  left: number;
  width: number;
  height: number;
  onResize: (deltas: Partial<BoundingRectangle>) => void;
};

function handleResizeHandleMove(
  handler: (this: HTMLElement, ev: MouseEvent) => void
) {
  const mouseUpListener: (this: HTMLElement, ev: MouseEvent) => void = () => {
    document.body.removeEventListener('mousemove', handler);
    document.body.removeEventListener('mouseup', mouseUpListener);
  };

  document.body.addEventListener('mousemove', handler);
  document.body.addEventListener('mouseup', mouseUpListener);
}

export default function ViewFinder({
  viewFinderRef,
  onResize,
  ...rest
}: ViewFinderProps) {
  const topLeftHandler = useCallback(
    (ev: React.MouseEvent<HTMLDivElement>) => {
      handleResizeHandleMove(({ movementX, movementY }) =>
        onResize({ left: movementX, top: movementY })
      );

      ev.stopPropagation();
    },
    [onResize]
  );
  const topCenterHandler = useCallback(
    (ev: React.MouseEvent<HTMLDivElement>) => {
      handleResizeHandleMove(({ movementY }) => onResize({ top: movementY }));

      ev.stopPropagation();
    },
    [onResize]
  );
  const topRightHandler = useCallback(
    (ev: React.MouseEvent<HTMLDivElement>) => {
      handleResizeHandleMove(({ movementX, movementY }) =>
        onResize({ right: movementX, top: movementY })
      );

      ev.stopPropagation();
    },
    [onResize]
  );
  const leftHandler = useCallback(
    (ev: React.MouseEvent<HTMLDivElement>) => {
      handleResizeHandleMove(({ movementX }) => onResize({ left: movementX }));

      ev.stopPropagation();
    },
    [onResize]
  );
  const rightHandler = useCallback(
    (ev: React.MouseEvent<HTMLDivElement>) => {
      handleResizeHandleMove(({ movementX }) => onResize({ right: movementX }));

      ev.stopPropagation();
    },
    [onResize]
  );
  const bottomLeftHandler = useCallback(
    (ev: React.MouseEvent<HTMLDivElement>) => {
      handleResizeHandleMove(({ movementX, movementY }) =>
        onResize({ left: movementX, bottom: movementY })
      );

      ev.stopPropagation();
    },
    [onResize]
  );
  const bottomCenterHandler = useCallback(
    (ev: React.MouseEvent<HTMLDivElement>) => {
      handleResizeHandleMove(({ movementY }) =>
        onResize({ bottom: movementY })
      );

      ev.stopPropagation();
    },
    [onResize]
  );
  const bottomRightHandler = useCallback(
    (ev: React.MouseEvent<HTMLDivElement>) => {
      handleResizeHandleMove(({ movementX, movementY }) =>
        onResize({ right: movementX, bottom: movementY })
      );

      ev.stopPropagation();
    },
    [onResize]
  );

  return (
    <Container ref={viewFinderRef} {...rest}>
      <ResizeHandle hAnchor="left" vAnchor="top" onMouseDown={topLeftHandler} />
      <ResizeHandle
        hAnchor="center"
        vAnchor="top"
        onMouseDown={topCenterHandler}
      />
      <ResizeHandle
        hAnchor="right"
        vAnchor="top"
        onMouseDown={topRightHandler}
      />
      <ResizeHandle hAnchor="left" vAnchor="center" onMouseDown={leftHandler} />
      <ResizeHandle
        hAnchor="right"
        vAnchor="center"
        onMouseDown={rightHandler}
      />
      <ResizeHandle
        hAnchor="left"
        vAnchor="bottom"
        onMouseDown={bottomLeftHandler}
      />
      <ResizeHandle
        hAnchor="center"
        vAnchor="bottom"
        onMouseDown={bottomCenterHandler}
      />
      <ResizeHandle
        hAnchor="right"
        vAnchor="bottom"
        onMouseDown={bottomRightHandler}
      />
    </Container>
  );
}
