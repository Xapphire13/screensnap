import React from 'react';
import { styled } from 'linaria/react';
import {
  Crop,
  MoreHorizontal,
  Maximize,
  Crosshair,
  Aperture,
} from 'react-feather';
import bootstrapWindow from '../bootstrapWindow';
import ToolbarButton from './ToolbarButton';

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

export default function Toolbar() {
  return (
    <Container>
      <ToolbarButton icon={Crop} />
      <ToolbarButton icon={Crosshair} />
      <ToolbarButton icon={Aperture} size="large" />
      <ToolbarButton icon={Maximize} />
      <ToolbarButton icon={MoreHorizontal} />
    </Container>
  );
}

bootstrapWindow(Toolbar);
