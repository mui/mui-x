import * as React from 'react';
import { DATA_CONTAINER_CSS_CLASS } from '../../constants/cssClassesConstants';
import { classnames } from '../../utils';

type GridDataContainerProps = React.HTMLAttributes<HTMLDivElement>;

export const GridDataContainer = React.forwardRef<HTMLDivElement, GridDataContainerProps>(
  function GridDataContainer(props, ref) {
    const { className, ...other } = props;
    return (
      <div
        ref={ref}
        className={classnames('MuiDataGrid-dataContainer', DATA_CONTAINER_CSS_CLASS, className)}
        {...other}
      />
    );
  },
);
