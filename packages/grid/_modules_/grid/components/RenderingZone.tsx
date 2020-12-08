import * as React from 'react';
import { ElementSize } from '../models';

type WithChildren = { children?: React.ReactNode };

export const RenderingZone = React.forwardRef<HTMLDivElement, ElementSize & WithChildren>(
  ({ height, width, children }, ref) => {
    return (
      <div
        ref={ref}
        className="rendering-zone"
        style={{
          maxHeight: height,
          width,
        }}
      >
        {children}
      </div>
    );
  },
);
RenderingZone.displayName = 'RenderingZone';
