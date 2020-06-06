import React from 'react';
import { styled } from 'linaria/react';
import bootstrapWindow from '../bootstrapWindow';

const Test = styled.p`
  color: blue;
`;

export default function Toolbar() {
  return (
    <div>
      <Test>Toolbar</Test>
    </div>
  );
}

bootstrapWindow(Toolbar);
