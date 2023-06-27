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
import { GridRootContainerRef } from '../../models/gridRootContainerRef';
import { GridRootStyles } from './GridRootStyles';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { gridDensityValueSelector } from '../../hooks/features/density/densitySelector';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { GridDensity } from '../../models/gridDensity';
import { useGridAriaAttributes } from '../../hooks/utils/useGridAriaAttributes';

export interface GridRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}

type OwnerState = DataGridProcessedProps & {
  density: GridDensity;
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { autoHeight, density, classes } = ownerState;

  const slots = {
    root: [
      'root',
      autoHeight && 'autoHeight',
      `root--density${capitalize(density)}`,
      'withBorderColor',
    ],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridRoot = React.forwardRef<HTMLDivElement, GridRootProps>(function GridRoot(props, ref) {
  const rootProps = useGridRootProps();
  const { children, className, ...other } = props;
  const apiRef = useGridPrivateApiContext();
  const densityValue = useGridSelector(apiRef, gridDensityValueSelector);
  const rootContainerRef: GridRootContainerRef = React.useRef<HTMLDivElement>(null);
  const handleRef = useForkRef(rootContainerRef, ref);

  const getAriaAttributes = rootProps.experimentalFeatures?.ariaV7 // ariaV7 should never change
    ? null
    : useGridAriaAttributes;
  const ariaAttributes = typeof getAriaAttributes === 'function' ? getAriaAttributes() : null;

  const ownerState = {
    ...rootProps,
    density: densityValue,
  };

  const classes = useUtilityClasses(ownerState);

  apiRef.current.register('public', { rootElementRef: rootContainerRef });

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
      {...ariaAttributes}
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
