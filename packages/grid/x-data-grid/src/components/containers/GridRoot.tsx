import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  unstable_useForkRef as useForkRef,
  unstable_useEnhancedEffect as useEnhancedEffect,
  unstable_capitalize as capitalize,
  unstable_composeClasses as composeClasses,
} from '@mui/utils';
import { SxProps, styled } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { GridRootStyles } from './GridRootStyles';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { gridDensityValueSelector } from '../../hooks/features/density/densitySelector';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { GridDensity } from '../../models/gridDensity';

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
  const { autoHeight, density, classes, showCellVerticalBorder } = ownerState;

  const slots = {
    root: [
      'root',
      autoHeight && 'autoHeight',
      `root--density${capitalize(density)}`,
      'withBorderColor',
      showCellVerticalBorder && 'withVerticalBorder',
    ],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridPanelAnchor = styled('div')({
  position: 'absolute',
  top: `var(--DataGrid-headersTotalHeight)`,
  left: 0,
});

const GridRoot = React.forwardRef<HTMLDivElement, GridRootProps>(function GridRoot(props, ref) {
  const rootProps = useGridRootProps();
  const { children, className, ...other } = props;
  const apiRef = useGridPrivateApiContext();
  const densityValue = useGridSelector(apiRef, gridDensityValueSelector);
  const rootElementRef = apiRef.current.rootElementRef;
  const handleRef = useForkRef(rootElementRef, ref);

  const ownerState = {
    ...rootProps,
    density: densityValue,
  };

  const classes = useUtilityClasses(ownerState);

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
    >
      <GridPanelAnchor role="presentation" data-id="gridPanelAnchor" />
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
