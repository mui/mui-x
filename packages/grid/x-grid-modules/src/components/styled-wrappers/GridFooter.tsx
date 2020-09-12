import * as React from 'react';
import { classnames } from '../../utils';

type GridFooterProps = React.HTMLAttributes<HTMLDivElement>;

export const GridFooter = React.forwardRef<HTMLDivElement, GridFooterProps>(function GridFooter(
  props,
  ref,
) {
  const { className, ...other } = props;
  return <div ref={ref} className={classnames('MuiDataGrid-footer', className)} {...other} />;
});
