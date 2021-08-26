import * as React from 'react';
import clsx from 'clsx';
import { ElementSize } from '../models';
import { gridClasses } from '../gridClasses';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';

type WithChildren = { children?: React.ReactNode };

export const GridRenderingZone = React.forwardRef<HTMLDivElement, ElementSize & WithChildren>(
  function GridRenderingZone(props, ref) {
    const { height, width, children } = props;
    const rootProps = useGridRootProps();
    return (
      <div
        ref={ref}
        className={clsx(gridClasses.renderingZone, rootProps.classes?.renderingZone)}
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
