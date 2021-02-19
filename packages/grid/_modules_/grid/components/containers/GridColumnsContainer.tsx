import * as React from 'react';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { gridDensityHeaderHeightSelector } from '../../hooks/features/density/densitySelector';
import { classnames } from '../../utils';
import { GridApiContext } from '../GridApiContext';

type GridColumnsContainerProps = React.HTMLAttributes<HTMLDivElement>;

export const GridColumnsContainer = React.forwardRef<HTMLDivElement, GridColumnsContainerProps>(
  function GridColumnsContainer(props, ref) {
    const { className, style, ...other } = props;

    const apiRef = React.useContext(GridApiContext);
    const height = useGridSelector(apiRef, gridDensityHeaderHeightSelector);

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
