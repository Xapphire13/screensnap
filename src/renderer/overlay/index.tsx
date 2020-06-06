import React, { useEffect } from 'react';
import { styled } from 'linaria/react';
import { desktopCapturer } from 'electron';
import bootstrapWindow from '../bootstrapWindow';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #00000055;
`;

export default function Overlay() {
  useEffect(() => {
    desktopCapturer
      .getSources({ types: ['window'] })
      .then((sources) => console.log(sources));
  });

  return <Container />;
}

bootstrapWindow(Overlay);
