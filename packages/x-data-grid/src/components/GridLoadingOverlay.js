'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { GridOverlay } from './containers/GridOverlay';
import { GridSkeletonLoadingOverlay } from './GridSkeletonLoadingOverlay';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { gridRowCountSelector, useGridSelector } from '../hooks';
const LOADING_VARIANTS = {
    'circular-progress': {
        component: (rootProps) => rootProps.slots.baseCircularProgress,
        style: {},
    },
    'linear-progress': {
        component: (rootProps) => rootProps.slots.baseLinearProgress,
        style: { display: 'block' },
    },
    skeleton: {
        component: () => GridSkeletonLoadingOverlay,
        style: { display: 'block' },
    },
};
const GridLoadingOverlay = forwardRef(function GridLoadingOverlay(props, ref) {
    const { variant = 'linear-progress', noRowsVariant = 'skeleton', style, ...other } = props;
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const rowsCount = useGridSelector(apiRef, gridRowCountSelector);
    const activeVariant = LOADING_VARIANTS[rowsCount === 0 ? noRowsVariant : variant];
    const Component = activeVariant.component(rootProps);
    return (_jsx(GridOverlay, { style: { ...activeVariant.style, ...style }, ...other, ref: ref, children: _jsx(Component, {}) }));
});
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
};
export { GridLoadingOverlay };
