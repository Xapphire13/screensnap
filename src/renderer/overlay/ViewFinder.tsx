import React from 'react';
import { styled } from 'linaria/react';
import { BoundingRectangle } from '../../BoundingRectangle';
import useOnDrag from '../hooks/useOnDrag';

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
  top: number;
  left: number;
  width: number;
  height: number;
  onResize: (deltas: Partial<BoundingRectangle>) => void;
};

export default function ViewFinder({ onResize, ...rest }: ViewFinderProps) {
  const [viewFinder] = useOnDrag(({ movementX, movementY }) => {
    onResize({
      bottom: movementY,
      left: movementX,
      right: movementX,
      top: movementY,
    });
  });
  const [topLeftHandle] = useOnDrag(({ movementX, movementY }) => {
    onResize({ left: movementX, top: movementY });
  });
  const [topCenterHandle] = useOnDrag(({ movementY }) => {
    onResize({ top: movementY });
  });
  const [topRightHandle] = useOnDrag(({ movementX, movementY }) => {
    onResize({ right: movementX, top: movementY });
  });
  const [leftHandle] = useOnDrag(({ movementX }) => {
    onResize({ left: movementX });
  });
  const [rightHandle] = useOnDrag(({ movementX }) => {
    onResize({ right: movementX });
  });
  const [bottomLeftHandle] = useOnDrag(({ movementX, movementY }) => {
    onResize({ left: movementX, bottom: movementY });
  });
  const [bottomCenterHandle] = useOnDrag(({ movementY }) => {
    onResize({ bottom: movementY });
  });
  const [bottomRightHandle] = useOnDrag(({ movementX, movementY }) => {
    onResize({ right: movementX, bottom: movementY });
  });

  return (
    <Container ref={viewFinder} {...rest}>
      <ResizeHandle ref={topLeftHandle} vAnchor="top" hAnchor="left" />
      <ResizeHandle ref={topCenterHandle} vAnchor="top" hAnchor="center" />
      <ResizeHandle ref={topRightHandle} vAnchor="top" hAnchor="right" />
      <ResizeHandle ref={leftHandle} vAnchor="center" hAnchor="left" />
      <ResizeHandle ref={rightHandle} vAnchor="center" hAnchor="right" />
      <ResizeHandle ref={bottomLeftHandle} vAnchor="bottom" hAnchor="left" />
      <ResizeHandle
        ref={bottomCenterHandle}
        vAnchor="bottom"
        hAnchor="center"
      />
      <ResizeHandle ref={bottomRightHandle} vAnchor="bottom" hAnchor="right" />
    </Container>
  );
}
