import * as React from 'react';
import { classnames } from '../../utils';

type GridColumnsContainerProps = React.HTMLAttributes<HTMLDivElement> & { height: number };

export const GridColumnsContainer = React.forwardRef<HTMLDivElement, GridColumnsContainerProps>(
  function GridColumnsContainer(props, ref) {
    const { className, height, style, ...other } = props;
    return (
      <div
        ref={ref}
        className={classnames('MuiDataGrid-columnsContainer', className)}
        {...other}
        style={{ minHeight: height, maxHeight: height, lineHeight: `${height}px`, ...style }}
      />
    );
  },
);
