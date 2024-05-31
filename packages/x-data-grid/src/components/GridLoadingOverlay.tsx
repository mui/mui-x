import * as React from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import { Theme, SystemStyleObject } from '@mui/system';
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

const LOADING_VARIANTS: Record<
  GridLoadingOverlayVariant,
  {
    component: React.ComponentType;
    sx: SystemStyleObject<Theme>;
  }
> = {
  'circular-progress': {
    component: CircularProgress,
    sx: {},
  },
  'linear-progress': {
    component: LinearProgress,
    sx: { display: 'block' },
  },
  skeleton: {
    component: GridSkeletonLoadingOverlay,
    sx: {
      display: 'block',
      background: 'var(--DataGrid-containerBackground)',
    },
  },
};

const GridLoadingOverlay = React.forwardRef<HTMLDivElement, GridLoadingOverlayProps>(
  function GridLoadingOverlay(props, ref) {
    const {
      variant = 'circular-progress',
      noRowsVariant = 'circular-progress',
      sx,
      ...other
    } = props;
    const apiRef = useGridApiContext();
    const rowsCount = apiRef.current.getRowsCount();
    const activeVariant = LOADING_VARIANTS[rowsCount === 0 ? noRowsVariant : variant];

    return (
      <GridOverlay ref={ref} sx={{ ...activeVariant.sx, ...sx }} {...other}>
        <activeVariant.component />
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
