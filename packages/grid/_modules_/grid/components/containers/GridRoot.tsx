import * as React from 'react';
import clsx from 'clsx';
import { useStyles } from './GridRootStyles';
import { visibleGridColumnsLengthSelector } from '../../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { useGridState } from '../../hooks/features/core/useGridState';
import { GridApiContext } from '../GridApiContext';

export type GridRootProps = React.HTMLAttributes<HTMLDivElement>;

export const GridRoot = React.forwardRef<HTMLDivElement, GridRootProps>(function GridRoot(
  props,
  ref,
) {
  const { className, ...other } = props;
  const classes = useStyles();
  const apiRef = React.useContext(GridApiContext);
  const visibleColumnsLength = useGridSelector(apiRef, visibleGridColumnsLengthSelector);
  const [gridState] = useGridState(apiRef!);

  return (
    <div
      ref={ref}
      className={clsx(classes.root, className, {
        'MuiDataGrid-autoHeight': gridState.options.autoHeight,
      })}
      role="grid"
      aria-colcount={visibleColumnsLength}
      aria-rowcount={gridState.rows.totalRowCount}
      aria-multiselectable={!gridState.options.disableMultipleSelection}
      {...other}
    />
  );
});
