import * as React from 'react';
import { classnames } from '../../utils';

type GridDataContainerProps = React.HTMLAttributes<HTMLDivElement>;

export const GridDataContainer = React.forwardRef<HTMLDivElement, GridDataContainerProps>(
  function GridDataContainer(props, ref) {
    const { className, ...other } = props;
    return (
      <div ref={ref} className={classnames('MuiDataGrid-dataContainer', className)} {...other} />
    );
  },
);
