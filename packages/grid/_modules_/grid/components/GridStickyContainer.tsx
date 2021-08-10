import * as React from 'react';
import { gridClasses } from '../gridClasses';
import { ElementSize } from '../models';

interface GridStickyContainerProps extends ElementSize {
  children: React.ReactNode;
}

export function GridStickyContainer(props: GridStickyContainerProps) {
  const { height, width, children } = props;
  return (
    <div
      className={gridClasses.viewport}
      style={{
        minWidth: width,
        maxWidth: width,
        maxHeight: height,
      }}
    >
      {children}
    </div>
  );
}
