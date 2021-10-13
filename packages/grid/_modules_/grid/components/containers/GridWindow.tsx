import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import {
  gridDensityHeaderHeightSelector,
  gridDensityRowHeightSelector,
} from '../../hooks/features/density/densitySelector';
import { gridDataContainerHeightSelector } from '../../hooks/features/container/gridContainerSizesSelector';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { getDataGridUtilityClass } from '../../gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { composeClasses } from '../../utils/material-ui-utils';
import { GridComponentProps } from '../../GridComponentProps';

export interface GridWindowProps extends React.HTMLAttributes<HTMLDivElement> {
  size: { width: number; height: number };
}

type OwnerState = GridWindowProps & {
  classes?: GridComponentProps['classes'];
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['windowContainer'],
    window: ['window'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridWindow = React.forwardRef<HTMLDivElement, GridWindowProps>(function GridWindow(
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
    // refs are run before effect. Waiting for an effect guarantees that
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

GridWindow.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  size: PropTypes /* @typescript-to-proptypes-ignore */.shape({
    height: PropTypes.number,
    width: PropTypes.number,
  }).isRequired,
} as any;

export { GridWindow };
