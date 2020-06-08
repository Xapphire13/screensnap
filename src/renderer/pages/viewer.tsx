import React, { useEffect, useState } from 'react';
import { styled } from 'linaria/react';
import bootstrapWindow from '../bootstrapWindow';
import { onFilePath, sendViewerReady } from '../utils/IpcRendererUtils';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Img = styled.img`
  object-fit: contain;
`;

export default function Viewer() {
  const [filePath, setFilePath] = useState<string>();

  useEffect(() => {
    sendViewerReady();
  });

  useEffect(() => {
    const cleanup = onFilePath(setFilePath);

    return cleanup;
  }, []);

  return (
    <Container>
      <Img src={filePath} alt="" />
    </Container>
  );
}

bootstrapWindow(Viewer);
