import * as React from 'react';
import { classnames } from '../../utils';

type GridToolbarProps = React.HTMLAttributes<HTMLDivElement>;

export const GridToolbar = React.forwardRef<HTMLDivElement, GridToolbarProps>(function GridToolbar(
  props,
  ref,
) {
  const { className, children, ...other } = props;

  if (!children) {
    return null;
  }

  return (
    <div ref={ref} className={classnames('MuiDataGrid-toolbar', className)} {...other}>
      {children}
    </div>
  );
});
