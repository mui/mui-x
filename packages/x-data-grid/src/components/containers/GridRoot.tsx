import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  unstable_useForkRef as useForkRef,
  unstable_useEnhancedEffect as useEnhancedEffect,
  unstable_capitalize as capitalize,
  unstable_composeClasses as composeClasses,
} from '@mui/utils';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { GridRootStyles } from './GridRootStyles';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { gridDensitySelector } from '../../hooks/features/density/densitySelector';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { GridDensity } from '../../models/gridDensity';

export interface GridRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState, density: GridDensity) => {
  const { autoHeight, classes, showCellVerticalBorder } = ownerState;

  const slots = {
    root: [
      'root',
      autoHeight && 'autoHeight',
      `root--density${capitalize(density)}`,
      ownerState.slots.toolbar === null && 'root--noToolbar',
      'withBorderColor',
      showCellVerticalBorder && 'withVerticalBorder',
    ],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridRoot = React.forwardRef<HTMLDivElement, GridRootProps>(function GridRoot(props, ref) {
  const rootProps = useGridRootProps();
  const { className, ...other } = props;
  const apiRef = useGridPrivateApiContext();
  const density = useGridSelector(apiRef, gridDensitySelector);
  const rootElementRef = apiRef.current.rootElementRef;
  const handleRef = useForkRef(rootElementRef, ref);

  const ownerState = rootProps;

  const classes = useUtilityClasses(ownerState, density);

  // Our implementation of <NoSsr />
  const [mountedState, setMountedState] = React.useState(false);
  useEnhancedEffect(() => {
    setMountedState(true);
  }, []);

  if (!mountedState) {
    return null;
  }

  return (
    <GridRootStyles
      ref={handleRef}
      className={clsx(className, classes.root)}
      ownerState={ownerState}
      {...other}
    />
  );
});

GridRoot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
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
