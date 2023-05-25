import * as React from 'react';
import { DrawingContext } from '../context/DrawingProvider';

export type ClipPathProps = {
  id: string;
  offset?: { top?: number; right?: number; bottom?: number; left?: number };
};

export function ClipPath(props: ClipPathProps) {
  const { id, offset: offsetProps } = props;
  const { left, top, width, height } = React.useContext(DrawingContext);

  const offset = { top: 0, right: 0, bottom: 0, left: 0, ...offsetProps };
  return (
    <clipPath id={id}>
      <rect
        x={left - offset.left}
        y={top - offset.top}
        width={width + offset.left + offset.right}
        height={height + offset.top + offset.bottom}
      />
    </clipPath>
  );
}
