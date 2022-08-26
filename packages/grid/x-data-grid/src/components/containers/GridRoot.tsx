import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  useForkRef,
  unstable_useEnhancedEffect as useEnhancedEffect,
  capitalize,
} from '@mui/material/utils';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { GridRootContainerRef } from '../../models/gridRootContainerRef';
import { GridRootStyles, OwnerState } from './GridRootStyles';
import { gridVisibleColumnDefinitionsSelector } from '../../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { gridDensityHeaderGroupingMaxDepthSelector } from '../../hooks/features/density/densitySelector';
import {
  gridPinnedRowsCountSelector,
  gridRowCountSelector,
} from '../../hooks/features/rows/gridRowsSelector';

export interface GridRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}

const useUtilityClasses = (ownerState: OwnerState) => {
  const { autoHeight, density, classes } = ownerState;

  const slots = {
    root: ['root', autoHeight && 'autoHeight', `root--density${capitalize(density)}`],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridRoot = React.forwardRef<HTMLDivElement, GridRootProps>(function GridRoot(props, ref) {
  const rootProps = useGridRootProps();
  const { children, className, ...other } = props;
  const apiRef = useGridApiContext();
  const visibleColumns = useGridSelector(apiRef, gridVisibleColumnDefinitionsSelector);
  const totalRowCount = useGridSelector(apiRef, gridRowCountSelector);
  const headerGroupingMaxDepth = useGridSelector(apiRef, gridDensityHeaderGroupingMaxDepthSelector);
  const rootContainerRef: GridRootContainerRef = React.useRef<HTMLDivElement>(null);
  const handleRef = useForkRef(rootContainerRef, ref);
  const pinnedRowsCount = useGridSelector(apiRef, gridPinnedRowsCountSelector);

  const ownerState = rootProps;

  const classes = useUtilityClasses(ownerState);

  apiRef.current.rootElementRef = rootContainerRef;

  // Our implementation of <NoSsr />
  const [mountedState, setMountedState] = React.useState(false);
  useEnhancedEffect(() => {
    setMountedState(true);
  }, []);

  useEnhancedEffect(() => {
    if (mountedState) {
      apiRef.current.unstable_updateGridDimensionsRef();
    }
  }, [apiRef, mountedState]);

  if (!mountedState) {
    return null;
  }

  return (
    <GridRootStyles
      ref={handleRef}
      className={clsx(className, classes.root)}
      ownerState={ownerState}
      role="grid"
      aria-colcount={visibleColumns.length}
      aria-rowcount={headerGroupingMaxDepth + 1 + pinnedRowsCount + totalRowCount}
      aria-multiselectable={!rootProps.disableMultipleSelection}
      aria-label={rootProps['aria-label']}
      aria-labelledby={rootProps['aria-labelledby']}
      {...other}
    >
      {children}
    </GridRootStyles>
  );
});

GridRoot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { GridRoot };
