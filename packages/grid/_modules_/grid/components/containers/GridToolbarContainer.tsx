import * as React from 'react';
import clsx from 'clsx';
import { gridClasses } from '../../gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export type GridToolbarContainerProps = React.HTMLAttributes<HTMLDivElement>;

export const GridToolbarContainer = React.forwardRef<HTMLDivElement, GridToolbarContainerProps>(
  function GridToolbarContainer(props, ref) {
    const { className, children, ...other } = props;
    const rootProps = useGridRootProps();

    if (!children) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={clsx(
          gridClasses.toolbarContainer,
          className,
          rootProps.classes?.toolbarContainer,
        )}
        {...other}
      >
        {children}
      </div>
    );
  },
);
