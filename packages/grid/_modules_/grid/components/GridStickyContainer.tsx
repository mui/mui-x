import * as React from 'react';
import { ElementSize } from '../models';

export const GridStickyContainer: React.FC<ElementSize> = ({ height, width, children }) => (
  <div
    className="MuiDataGrid-viewport"
    style={{
      minWidth: width,
      maxWidth: width,
      minHeight: height,
      maxHeight: height,
    }}
  >
    {children}
  </div>
);
GridStickyContainer.displayName = 'GridStickyContainer';
