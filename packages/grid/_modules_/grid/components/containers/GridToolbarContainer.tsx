import * as React from 'react';
import clsx from 'clsx';

export type GridToolbarContainerProps = React.HTMLAttributes<HTMLDivElement>;

export const GridToolbarContainer = React.forwardRef<HTMLDivElement, GridToolbarContainerProps>(
  function GridToolbarContainer(props, ref) {
    const { className, children, ...other } = props;

    if (!children) {
      return null;
    }

    return (
      <div ref={ref} className={clsx('MuiDataGrid-toolbarContainer', className)} {...other}>
        {children}
      </div>
    );
  },
);
