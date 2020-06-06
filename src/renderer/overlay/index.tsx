import React from 'react';
import { styled } from 'linaria/react';
import bootstrapWindow from '../bootstrapWindow';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #00000055;
`;

export default function Overlay() {
  return <Container />;
}

bootstrapWindow(Overlay);
