import * as React from 'react';
import { classnames } from '../../utils';

type GridToolbarProps = React.HTMLAttributes<HTMLDivElement>;

export const GridToolbar = React.forwardRef<HTMLDivElement, GridToolbarProps>(function GridToolbar(
  props,
  ref,
) {
  const { className, ...other } = props;
  return <div ref={ref} className={classnames('MuiDataGrid-toolbar', className)} {...other} />;
});
