import * as React from 'react';
import clsx from 'clsx';
import { useForkRef } from '@material-ui/core/utils';
import NoSsr from '@material-ui/core/NoSsr';
import { GridRootContainerRef } from '../../models/gridRootContainerRef';
import { useStyles } from './GridRootStyles';
import { visibleGridColumnsLengthSelector } from '../../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { useGridState } from '../../hooks/features/core/useGridState';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../gridClasses';
import { composeClasses } from '../../utils/material-ui-utils';
import { GridComponentProps } from '../../GridComponentProps';

export type GridRootProps = React.HTMLAttributes<HTMLDivElement>;

type OwnerState = GridRootProps & {
  classes?: GridComponentProps['classes'];
  autoHeight?: GridComponentProps['autoHeight'];
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { autoHeight, classes } = ownerState;

  const slots = {
    root: ['root', autoHeight && 'autoHeight'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

export const GridRoot = React.forwardRef<HTMLDivElement, GridRootProps>(function GridRoot(
  props,
  ref,
) {
  const stylesClasses = useStyles();
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const { children, className: classNameProp, ...other } = props;
  const visibleColumnsLength = useGridSelector(apiRef, visibleGridColumnsLengthSelector);
  const [gridState] = useGridState(apiRef);
  const rootContainerRef: GridRootContainerRef = React.useRef<HTMLDivElement>(null);
  const handleRef = useForkRef(rootContainerRef, ref);

  const ownerState = { ...props, autoHeight: rootProps.autoHeight, classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  apiRef.current.rootElementRef = rootContainerRef;

  return (
    <NoSsr>
      <div
        ref={handleRef}
        className={clsx(rootProps.className, classNameProp, stylesClasses.root, classes.root)}
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
