import * as React from 'react';
import { ElementSize } from '../models';

interface GridStickyContainerProps extends ElementSize {
  children: React.ReactNode;
}

export const GridStickyContainer = (props: GridStickyContainerProps) => {
  const { height, width, children } = props;
  return (
    <div
      className="MuiDataGrid-viewport"
      style={{
        minWidth: width,
        maxWidth: width,
        maxHeight: height,
      }}
    >
      {children}
    </div>
  );
};
