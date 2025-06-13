import * as React from 'react';
import PropTypes from 'prop-types';
import { forwardRef } from '@mui/x-internals/forwardRef';
import type { DataGridProcessedProps } from '../models/props/DataGridProps';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { GridOverlay, GridOverlayProps } from './containers/GridOverlay';
import { GridSkeletonLoadingOverlay } from './GridSkeletonLoadingOverlay';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { gridRowCountSelector, useGridSelector } from '../hooks';

export type GridLoadingOverlayVariant = 'circular-progress' | 'linear-progress' | 'skeleton';

export interface GridLoadingOverlayProps extends GridOverlayProps {
  /**
   * The variant of the overlay.
   * @default 'linear-progress'
   */
  variant?: GridLoadingOverlayVariant;
  /**
   * The variant of the overlay when no rows are displayed.
   * @default 'skeleton'
   */
  noRowsVariant?: GridLoadingOverlayVariant;
}

const LOADING_VARIANTS: Record<
  GridLoadingOverlayVariant,
  {
    component: (rootProps: DataGridProcessedProps) => React.ComponentType;
    style: React.CSSProperties;
  }
> = {
  'circular-progress': {
    component: (rootProps: DataGridProcessedProps) => rootProps.slots.baseCircularProgress,
    style: {},
  },
  'linear-progress': {
    component: (rootProps: DataGridProcessedProps) => rootProps.slots.baseLinearProgress,
    style: { display: 'block' },
  },
  skeleton: {
    component: () => GridSkeletonLoadingOverlay,
    style: { display: 'block' },
  },
};

const GridLoadingOverlay = forwardRef<HTMLDivElement, GridLoadingOverlayProps>(
  function GridLoadingOverlay(props, ref) {
    const { variant = 'linear-progress', noRowsVariant = 'skeleton', style, ...other } = props;
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const rowsCount = useGridSelector(apiRef, gridRowCountSelector);
    const activeVariant = LOADING_VARIANTS[rowsCount === 0 ? noRowsVariant : variant];
    const Component = activeVariant.component(rootProps);

    return (
      <GridOverlay style={{ ...activeVariant.style, ...style }} {...other} ref={ref}>
        <Component />
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
   * @default 'skeleton'
   */
  noRowsVariant: PropTypes.oneOf(['circular-progress', 'linear-progress', 'skeleton']),
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * The variant of the overlay.
   * @default 'linear-progress'
   */
  variant: PropTypes.oneOf(['circular-progress', 'linear-progress', 'skeleton']),
} as any;

export { GridLoadingOverlay };
