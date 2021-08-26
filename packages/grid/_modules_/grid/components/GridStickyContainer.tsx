import * as React from 'react';
import clsx from 'clsx';
import { gridClasses } from '../gridClasses';
import { ElementSize } from '../models';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';

interface GridStickyContainerProps extends ElementSize {
  children: React.ReactNode;
}

export function GridStickyContainer(props: GridStickyContainerProps) {
  const { height, width, children } = props;
  const rootProps = useGridRootProps();
  return (
    <div
      className={clsx(gridClasses.viewport, rootProps.classes?.viewport)}
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
