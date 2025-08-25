"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridOverlayWrapper = GridOverlayWrapper;
var React = require("react");
var prop_types_1 = require("prop-types");
var system_1 = require("@mui/system");
var composeClasses_1 = require("@mui/utils/composeClasses");
var gridRowsUtils_1 = require("../../hooks/features/rows/gridRowsUtils");
var useGridSelector_1 = require("../../hooks/utils/useGridSelector");
var dimensions_1 = require("../../hooks/features/dimensions");
var useGridApiContext_1 = require("../../hooks/utils/useGridApiContext");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var gridClasses_1 = require("../../constants/gridClasses");
var GridOverlayWrapperRoot = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'OverlayWrapper',
    shouldForwardProp: function (prop) {
        return prop !== 'overlayType' && prop !== 'loadingOverlayVariant' && prop !== 'right';
    },
})(function (_a) {
    var overlayType = _a.overlayType, loadingOverlayVariant = _a.loadingOverlayVariant, right = _a.right;
    // Skeleton overlay should flow with the scroll container and not be sticky
    return loadingOverlayVariant !== 'skeleton'
        ? {
            position: 'sticky', // To stay in place while scrolling
            top: 'var(--DataGrid-headersTotalHeight)', // TODO: take pinned rows into account
            left: 0,
            right: "".concat(right, "px"),
            width: 0, // To stay above the content instead of shifting it down
            height: 0, // To stay above the content instead of shifting it down
            zIndex: overlayType === 'loadingOverlay'
                ? 5 // Should be above pinned columns, pinned rows, and detail panel
                : 4, // Should be above pinned columns and detail panel
        }
        : {};
});
var GridOverlayWrapperInner = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'OverlayWrapperInner',
    shouldForwardProp: function (prop) { return prop !== 'overlayType' && prop !== 'loadingOverlayVariant'; },
})({});
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['overlayWrapper'],
        inner: ['overlayWrapperInner'],
    };
    return (0, composeClasses_1.default)(slots, gridClasses_1.getDataGridUtilityClass, classes);
};
function GridOverlayWrapper(props) {
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var dimensions = (0, useGridSelector_1.useGridSelector)(apiRef, dimensions_1.gridDimensionsSelector);
    var height = Math.max(dimensions.viewportOuterSize.height -
        dimensions.topContainerHeight -
        dimensions.bottomContainerHeight -
        (dimensions.hasScrollX ? dimensions.scrollbarSize : 0), 0);
    if (height === 0) {
        height = gridRowsUtils_1.minimalContentHeight;
    }
    var classes = useUtilityClasses(__assign(__assign({}, props), { classes: rootProps.classes }));
    return (<GridOverlayWrapperRoot className={classes.root} {...props} right={dimensions.columnsTotalWidth - dimensions.viewportOuterSize.width}>
      <GridOverlayWrapperInner className={classes.inner} style={{
            height: height,
            width: dimensions.viewportOuterSize.width,
        }} {...props}/>
    </GridOverlayWrapperRoot>);
}
GridOverlayWrapper.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    loadingOverlayVariant: prop_types_1.default.oneOf(['circular-progress', 'linear-progress', 'skeleton']),
    overlayType: prop_types_1.default.oneOf([
        'loadingOverlay',
        'noResultsOverlay',
        'noRowsOverlay',
        'noColumnsOverlay',
        'emptyPivotOverlay',
    ]),
};
