import * as React from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import { GridOverlay, GridOverlayProps } from './containers/GridOverlay';
import { GridSkeletonLoadingOverlay } from './GridSkeletonLoadingOverlay';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { gridRowCountSelector, useGridSelector } from '../hooks';

export type GridLoadingOverlayVariant = 'circular-progress' | 'linear-progress' | 'skeleton';

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
    style: React.CSSProperties;
  }
> = {
  'circular-progress': {
    component: CircularProgress,
    style: {},
  },
  'linear-progress': {
    component: LinearProgress,
    style: { display: 'block' },
  },
  skeleton: {
    component: GridSkeletonLoadingOverlay,
    style: { display: 'block' },
  },
};

const GridLoadingOverlay = React.forwardRef<HTMLDivElement, GridLoadingOverlayProps>(
  function GridLoadingOverlay(props, ref) {
    const {
      variant = 'circular-progress',
      noRowsVariant = 'circular-progress',
      style,
      ...other
    } = props;
    const apiRef = useGridApiContext();
    const rowsCount = useGridSelector(apiRef, gridRowCountSelector);
    const activeVariant = LOADING_VARIANTS[rowsCount === 0 ? noRowsVariant : variant];

    return (
      <GridOverlay ref={ref} style={{ ...activeVariant.style, ...style }} {...other}>
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
