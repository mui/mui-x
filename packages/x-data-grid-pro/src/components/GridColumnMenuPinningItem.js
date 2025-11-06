"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridColumnMenuPinningItem = GridColumnMenuPinningItem;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var RtlProvider_1 = require("@mui/system/RtlProvider");
var prop_types_1 = require("prop-types");
var x_data_grid_1 = require("@mui/x-data-grid");
var useGridApiContext_1 = require("../hooks/utils/useGridApiContext");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
function GridColumnMenuPinningItem(props) {
    var colDef = props.colDef, onClick = props.onClick;
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var isRtl = (0, RtlProvider_1.useRtl)();
    var pinColumn = React.useCallback(function (side) { return function (event) {
        apiRef.current.pinColumn(colDef.field, side);
        onClick(event);
    }; }, [apiRef, colDef.field, onClick]);
    var unpinColumn = function (event) {
        apiRef.current.unpinColumn(colDef.field);
        onClick(event);
    };
    var pinToLeftMenuItem = ((0, jsx_runtime_1.jsx)(rootProps.slots.baseMenuItem, { onClick: pinColumn(x_data_grid_1.GridPinnedColumnPosition.LEFT), iconStart: (0, jsx_runtime_1.jsx)(rootProps.slots.columnMenuPinLeftIcon, { fontSize: "small" }), children: apiRef.current.getLocaleText('pinToLeft') }));
    var pinToRightMenuItem = ((0, jsx_runtime_1.jsx)(rootProps.slots.baseMenuItem, { onClick: pinColumn(x_data_grid_1.GridPinnedColumnPosition.RIGHT), iconStart: (0, jsx_runtime_1.jsx)(rootProps.slots.columnMenuPinRightIcon, { fontSize: "small" }), children: apiRef.current.getLocaleText('pinToRight') }));
    if (!colDef) {
        return null;
    }
    var side = apiRef.current.isColumnPinned(colDef.field);
    if (side) {
        var otherSide = side === x_data_grid_1.GridPinnedColumnPosition.RIGHT
            ? x_data_grid_1.GridPinnedColumnPosition.LEFT
            : x_data_grid_1.GridPinnedColumnPosition.RIGHT;
        var label = otherSide === x_data_grid_1.GridPinnedColumnPosition.RIGHT ? 'pinToRight' : 'pinToLeft';
        var Icon = side === x_data_grid_1.GridPinnedColumnPosition.RIGHT
            ? rootProps.slots.columnMenuPinLeftIcon
            : rootProps.slots.columnMenuPinRightIcon;
        return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [(0, jsx_runtime_1.jsx)(rootProps.slots.baseMenuItem, { onClick: pinColumn(otherSide), iconStart: (0, jsx_runtime_1.jsx)(Icon, { fontSize: "small" }), children: apiRef.current.getLocaleText(label) }), (0, jsx_runtime_1.jsx)(rootProps.slots.baseMenuItem, { onClick: unpinColumn, iconStart: (0, jsx_runtime_1.jsx)("span", {}), children: apiRef.current.getLocaleText('unpin') })] }));
    }
    if (isRtl) {
        return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [pinToRightMenuItem, pinToLeftMenuItem] }));
    }
    return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [pinToLeftMenuItem, pinToRightMenuItem] }));
}
GridColumnMenuPinningItem.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    colDef: prop_types_1.default.object.isRequired,
    onClick: prop_types_1.default.func.isRequired,
};
