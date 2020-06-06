import React from 'react';
import { styled } from 'linaria/react';

const BORDER_THICKNESS = 1;

const Container = styled.div<{
  top: number;
  left: number;
  width: number;
  height: number;
}>`
  position: absolute;
  cursor: move;
  border: ${BORDER_THICKNESS}px dashed white;
  top: ${({ top }) => top - BORDER_THICKNESS}px;
  left: ${({ left }) => left - BORDER_THICKNESS}px;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
`;

export type ViewFinderProps = {
  viewFinderRef: React.Ref<HTMLDivElement>;
  top: number;
  left: number;
  width: number;
  height: number;
};

export default function ViewFinder({
  viewFinderRef,
  ...rest
}: ViewFinderProps) {
  return <Container ref={viewFinderRef} {...rest} />;
}
