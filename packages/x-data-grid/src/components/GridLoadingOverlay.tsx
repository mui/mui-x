import * as React from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import { GridOverlay, GridOverlayProps } from './containers/GridOverlay';
import { GridSkeletonLoadingOverlay } from './GridSkeletonLoadingOverlay';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';

type GridLoadingOverlayVariant = 'circular-progress' | 'linear-progress' | 'skeleton';

export interface GridLoadingOverlayProps extends GridOverlayProps {
  /**
   * The variant of the overlay.
   * @default 'circular-progress'
   */
  variant?: GridLoadingOverlayVariant;
  /**
   * The variant of the overlay when no rows are displayed.
   * @default 'circular-progress'
   */
  noRowsVariant?: GridLoadingOverlayVariant;
}

const LOADING_COMPONENTS: Record<GridLoadingOverlayVariant, React.ComponentType> = {
  'circular-progress': CircularProgress,
  'linear-progress': LinearProgress,
  skeleton: GridSkeletonLoadingOverlay,
};

const GridLoadingOverlay = React.forwardRef<HTMLDivElement, GridLoadingOverlayProps>(
  function GridLoadingOverlay(
    { variant = 'circular-progress', noRowsVariant = 'circular-progress', sx, ...props },
    ref,
  ) {
    const apiRef = useGridApiContext();
    const rowsCount = apiRef.current.getRowsCount();
    const loadingVariant = rowsCount === 0 ? noRowsVariant : variant;
    const LoadingComponent = LOADING_COMPONENTS[loadingVariant];

    return (
      <GridOverlay
        ref={ref}
        sx={{
          display: loadingVariant === 'circular-progress' ? 'flex' : 'block',
          ...sx,
        }}
        {...props}
      >
        <LoadingComponent />
      </GridOverlay>
    );
  },
);

GridLoadingOverlay.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The variant of the overlay when no rows are displayed.
   * @default 'circular-progress'
   */
  noRowsVariant: PropTypes.oneOf(['circular-progress', 'linear-progress', 'skeleton']),
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * The variant of the overlay.
   * @default 'circular-progress'
   */
  variant: PropTypes.oneOf(['circular-progress', 'linear-progress', 'skeleton']),
} as any;

export { GridLoadingOverlay };
