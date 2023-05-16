import * as React from 'react';
import { DrawingContext } from '../context/DrawingProvider';

export type ClipPathProps = {
  id: string;
};

export function ClipPath(props) {
  const { id } = props;
  const { left, top, width, height } = React.useContext(DrawingContext);

  return (
    <clipPath id={id}>
      <rect x={left} y={top} width={width} height={height} />
    </clipPath>
  );
}
