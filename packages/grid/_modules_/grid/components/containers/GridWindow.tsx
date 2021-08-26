import * as React from 'react';
import clsx from 'clsx';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import {
  gridDensityHeaderHeightSelector,
  gridDensityRowHeightSelector,
} from '../../hooks/features/density/densitySelector';
import { gridDataContainerHeightSelector } from '../../hooks/root/gridContainerSizesSelector';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';
import { getDataGridUtilityClass } from '../../gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { composeClasses } from '../../utils/material-ui-utils';

export interface GridWindowProps extends React.HTMLAttributes<HTMLDivElement> {
  size: { width: number; height: number };
}

const useUtilityClasses = (ownerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['windowContainer'],
    window: ['window'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

export const GridWindow = React.forwardRef<HTMLDivElement, GridWindowProps>(function GridWindow(
  props,
  ref,
) {
  const { className, size, ...other } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const headerHeight = useGridSelector(apiRef, gridDensityHeaderHeightSelector);
  const rowHeight = useGridSelector(apiRef, gridDensityRowHeightSelector);
  const dataContainerHeight = useGridSelector(apiRef, gridDataContainerHeightSelector);
  const ownerProps = { ...props, classes: rootProps.classes };
  const classes = useUtilityClasses(ownerProps);

  React.useEffect(() => {
    // refs are run before effect. Waiting for an effect guarentees that
    // windowRef is resolved first.
    // Once windowRef is resolved, we can update the size of the container.
    apiRef.current.resize();
  }, [apiRef]);

  const containerHeight = React.useMemo(() => {
    if (!rootProps.autoHeight) {
      return size.height;
    }
    // If we have no rows, we give the size of 2 rows to display the no rows overlay
    const dataHeight = dataContainerHeight < rowHeight ? rowHeight * 2 : dataContainerHeight;
    return headerHeight + dataHeight;
  }, [rootProps.autoHeight, dataContainerHeight, headerHeight, rowHeight, size.height]);

  return (
    <div
      className={classes.root}
      style={{
        width: size.width,
        height: containerHeight,
      }}
    >
      <div
        ref={ref}
        className={clsx(classes.window, className)}
        {...other}
        style={{ top: headerHeight, overflowY: rootProps.autoHeight ? 'hidden' : 'auto' }}
      />
    </div>
  );
});
