import * as React from 'react';
import { useStyles } from './GridRootStyles';
import { visibleColumnsLengthSelector } from '../../hooks/features/columns/columnsSelector';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { useGridState } from '../../hooks/features/core/useGridState';
import { classnames } from '../../utils';
import { ApiContext } from '../api-context';

export type GridRootProps = React.HTMLAttributes<HTMLDivElement>;

export const GridRoot = React.forwardRef<HTMLDivElement, GridRootProps>(function GridRoot(
  props,
  ref,
) {
  const { className, ...other } = props;
  const classes = useStyles();
  const apiRef = React.useContext(ApiContext);
  const visibleColumnsLength = useGridSelector(apiRef, visibleColumnsLengthSelector);
  const [gridState] = useGridState(apiRef!);

  return (
    <div
      ref={ref}
      className={classnames(classes.root, className, {
        'MuiDataGrid-autoHeight': gridState.options.autoHeight,
      })}
      role="grid"
      aria-colcount={visibleColumnsLength}
      aria-rowcount={gridState.rows.totalRowCount}
      tabIndex={0}
      aria-label={apiRef!.current.getLocaleText('rootGridLabel')}
      aria-multiselectable={!gridState.options.disableMultipleSelection}
      {...other}
    />
  );
});
