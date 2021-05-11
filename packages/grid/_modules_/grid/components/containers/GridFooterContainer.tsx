import * as React from 'react';
import { classnames } from '../../utils';

export type GridFooterContainerProps = React.HTMLAttributes<HTMLDivElement>;

export const GridFooterContainer = React.forwardRef<HTMLDivElement, GridFooterContainerProps>(
  function GridFooterContainer(props: GridFooterContainerProps, ref) {
    const { className, ...other } = props;

    return <div ref={ref} className={classnames('MuiDataGrid-footer', className)} {...other} />;
  },
);
