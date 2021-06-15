import * as React from 'react';
import clsx from 'clsx';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { gridDensityHeaderHeightSelector } from '../../hooks/features/density/densitySelector';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';

type GridColumnsContainerProps = React.HTMLAttributes<HTMLDivElement>;

export const GridColumnsContainer = React.forwardRef<HTMLDivElement, GridColumnsContainerProps>(
  function GridColumnsContainer(props, ref) {
    const { className, style, ...other } = props;

    const apiRef = useGridApiContext();
    const height = useGridSelector(apiRef, gridDensityHeaderHeightSelector);

    return (
      <div
        ref={ref}
        className={clsx('MuiDataGrid-columnsContainer', className)}
        {...other}
        style={{ minHeight: height, maxHeight: height, lineHeight: `${height}px`, ...style }}
      />
    );
  },
);
