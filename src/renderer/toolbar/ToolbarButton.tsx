import React from 'react';
import { styled } from 'linaria/react';
import { Props as FeatherProps, Icon } from 'react-feather';

type IconSize = 'normal' | 'large';

export type ToolbarButtonProps = {
  icon: React.ReactType<FeatherProps>;
  size?: IconSize;
};

const ICON_SIZES: Record<IconSize, number> = {
  large: 40,
  normal: 24,
};

const Container = styled.div<{ size: number }>`
  -webkit-app-region: no-drag;
  height: ${({ size }) => size}px;
  width: ${({ size }) => size}px;
  color: #888;

  :hover {
    color: #fff;
    cursor: pointer;
  }
`;

export default function ToolbarButton({
  icon: Icon,
  size = 'normal',
}: ToolbarButtonProps) {
  const sizeValue = ICON_SIZES[size];

  return (
    <Container size={sizeValue}>
      <Icon size={sizeValue} />
    </Container>
  );
}
