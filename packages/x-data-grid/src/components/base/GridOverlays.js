import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import { minimalContentHeight } from '../../hooks/features/rows/gridRowsUtils';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridDimensionsSelector } from '../../hooks/features/dimensions';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
const GridOverlayWrapperRoot = styled('div', {
    name: 'MuiDataGrid',
    slot: 'OverlayWrapper',
    shouldForwardProp: (prop) => prop !== 'overlayType' && prop !== 'loadingOverlayVariant' && prop !== 'right',
})(({ overlayType, loadingOverlayVariant, right }) => 
// Skeleton overlay should flow with the scroll container and not be sticky
loadingOverlayVariant !== 'skeleton'
    ? {
        position: 'sticky', // To stay in place while scrolling
        top: 'var(--DataGrid-headersTotalHeight)', // TODO: take pinned rows into account
        left: 0,
        right: `${right}px`,
        width: 0, // To stay above the content instead of shifting it down
        height: 0, // To stay above the content instead of shifting it down
        zIndex: overlayType === 'loadingOverlay'
            ? 5 // Should be above pinned columns, pinned rows, and detail panel
            : 4, // Should be above pinned columns and detail panel
    }
    : {});
const GridOverlayWrapperInner = styled('div', {
    name: 'MuiDataGrid',
    slot: 'OverlayWrapperInner',
    shouldForwardProp: (prop) => prop !== 'overlayType' && prop !== 'loadingOverlayVariant',
})({});
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        root: ['overlayWrapper'],
        inner: ['overlayWrapperInner'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
export function GridOverlayWrapper(props) {
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const dimensions = useGridSelector(apiRef, gridDimensionsSelector);
    let height = Math.max(dimensions.viewportOuterSize.height -
        dimensions.topContainerHeight -
        dimensions.bottomContainerHeight -
        (dimensions.hasScrollX ? dimensions.scrollbarSize : 0), 0);
    if (height === 0) {
        height = minimalContentHeight;
    }
    const classes = useUtilityClasses({ ...props, classes: rootProps.classes });
    return (_jsx(GridOverlayWrapperRoot, { className: classes.root, ...props, right: dimensions.columnsTotalWidth - dimensions.viewportOuterSize.width, children: _jsx(GridOverlayWrapperInner, { className: classes.inner, style: {
                height,
                width: dimensions.viewportOuterSize.width,
            }, ...props }) }));
}
GridOverlayWrapper.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    loadingOverlayVariant: PropTypes.oneOf(['circular-progress', 'linear-progress', 'skeleton']),
    overlayType: PropTypes.oneOf([
        'loadingOverlay',
        'noResultsOverlay',
        'noRowsOverlay',
        'noColumnsOverlay',
        'emptyPivotOverlay',
    ]),
};
