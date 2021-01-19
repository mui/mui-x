import * as React from 'react';
import { classnames } from '../../utils';

type GridToolbarContainerProps = React.HTMLAttributes<HTMLDivElement>;

export const GridToolbarContainer = React.forwardRef<HTMLDivElement, GridToolbarContainerProps>(
  function GridToolbar(props, ref) {
    const { className, children, ...other } = props;

    if (!children) {
      return null;
    }

    return (
      <div ref={ref} className={classnames('MuiDataGrid-toolbar', className)} {...other}>
        {children}
      </div>
    );
  },
);
