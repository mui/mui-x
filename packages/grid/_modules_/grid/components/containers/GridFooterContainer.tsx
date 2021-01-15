import * as React from 'react';
import { classnames } from '../../utils';

type GridFooterProps = React.HTMLAttributes<HTMLDivElement>;

export const GridFooterContainer = function GridFooter(props: GridFooterProps) {
  const { className, ...other } = props;
  return <div className={classnames('MuiDataGrid-footer', className)} {...other} />;
};
