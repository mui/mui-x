import * as React from 'react';
import clsx from 'clsx';
import { gridClasses } from '../../gridClasses';

export type GridToolbarContainerProps = React.HTMLAttributes<HTMLDivElement>;

export const GridToolbarContainer = React.forwardRef<HTMLDivElement, GridToolbarContainerProps>(
  function GridToolbarContainer(props, ref) {
    const { className, children, ...other } = props;

    if (!children) {
      return null;
    }

    return (
      <div ref={ref} className={clsx(gridClasses.toolbarContainer, className)} {...other}>
        {children}
      </div>
    );
  },
);
