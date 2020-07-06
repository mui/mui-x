import React from 'react';
import { ElementSize } from '../models';

export const StickyContainer: React.FC<ElementSize> = ({ height, width, children }) => (
  <div
    className={'viewport'}
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
StickyContainer.displayName = 'StickyContainer';
