'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { forwardRef } from '@mui/x-internals/forwardRef';
import composeClasses from '@mui/utils/composeClasses';
import { getDataGridUtilityClass, useGridRootProps } from '@mui/x-data-grid-pro';
import { GridSkeletonLoadingOverlayInner, useGridSelector } from '@mui/x-data-grid-pro/internals';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { gridAggregationModelSelector } from '../hooks/features/aggregation/gridAggregationSelectors';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        root: ['aggregationRowOverlayWrapper'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
const GridAggregationRowOverlay = forwardRef(function GridAggregationRowOverlay(props, forwardedRef) {
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses({ classes: rootProps.classes });
    const aggregationModel = useGridSelector(apiRef, gridAggregationModelSelector);
    const visibleColumns = new Set(Object.keys(aggregationModel));
    return (_jsx("div", { className: classes.root, children: _jsx(GridSkeletonLoadingOverlayInner, { ...props, skeletonRowsCount: 1, visibleColumns: visibleColumns, showFirstRowBorder: true, ref: forwardedRef }) }));
});
export { GridAggregationRowOverlay };
