import * as React from 'react';
import clsx from 'clsx';
import { useForkRef } from '@material-ui/core/utils';
import NoSsr from '@material-ui/core/NoSsr';
import { GridRootPropsContext } from '../../context/GridRootPropsContext';
import { optionsSelector } from '../../hooks/utils/optionsSelector';
import { GridRootContainerRef } from '../../models/gridRootContainerRef';
import { useStyles } from './GridRootStyles';
import { visibleGridColumnsLengthSelector } from '../../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { useGridState } from '../../hooks/features/core/useGridState';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';

export type GridRootProps = React.HTMLAttributes<HTMLDivElement>;

export const GridRoot = React.forwardRef<HTMLDivElement, GridRootProps>(function GridRoot(
  props,
  ref,
) {
  const classes = useStyles();
  const apiRef = useGridApiContext();
  const rootProps = React.useContext(GridRootPropsContext)!;
  const { children, className: classNameProp, ...other } = props;
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
        className={clsx(classes.root, options.classes?.root, rootProps.className, classNameProp, {
          'MuiDataGrid-autoHeight': rootProps.autoHeight,
        })}
        role="grid"
        aria-colcount={visibleColumnsLength}
        aria-rowcount={gridState.rows.totalRowCount}
        aria-multiselectable={!rootProps.disableMultipleSelection}
        aria-label={rootProps['aria-label']}
        aria-labelledby={rootProps['aria-labelledby']}
        style={rootProps.style}
        {...other}
      >
        {children}
      </div>
    </NoSsr>
  );
});
