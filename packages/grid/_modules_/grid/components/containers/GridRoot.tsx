import * as React from 'react';
import clsx from 'clsx';
import { useForkRef } from '@material-ui/core/utils';
import NoSsr from '@material-ui/core/NoSsr';
import { GridPropsContext } from '../../context/GridPropsContext';
import { optionsSelector } from '../../hooks/utils/optionsSelector';
import { GridRootContainerRef } from '../../models/gridRootContainerRef';
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
  const classes = useStyles();
  const apiRef = React.useContext(GridApiContext)!;
  const propsContext = React.useContext(GridPropsContext)!;
  const { className } = propsContext;
  const visibleColumnsLength = useGridSelector(apiRef, visibleGridColumnsLengthSelector);
  const [gridState] = useGridState(apiRef!);
  const options = useGridSelector(apiRef, optionsSelector);
  const rootContainerRef: GridRootContainerRef = React.useRef<HTMLDivElement>(null);
  const handleRef = useForkRef(rootContainerRef, ref);
  apiRef.current.rootElementRef = rootContainerRef;

  return (
    <NoSsr>
      <div
        ref={handleRef}
        className={clsx(classes.root, options.classes?.root, className, {
          'MuiDataGrid-autoHeight': gridState.options.autoHeight,
        })}
        role="grid"
        aria-colcount={visibleColumnsLength}
        aria-rowcount={gridState.rows.totalRowCount}
        aria-multiselectable={!gridState.options.disableMultipleSelection}
        aria-label={propsContext['aria-label']}
        aria-labelledby={propsContext['aria-labelledby']}
      >
        {props.children}
      </div>
    </NoSsr>
  );
});
