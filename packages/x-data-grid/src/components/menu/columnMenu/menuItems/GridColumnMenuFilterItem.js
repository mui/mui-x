"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridColumnMenuFilterItem = GridColumnMenuFilterItem;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var useGridApiContext_1 = require("../../../../hooks/utils/useGridApiContext");
var useGridRootProps_1 = require("../../../../hooks/utils/useGridRootProps");
function GridColumnMenuFilterItem(props) {
    var colDef = props.colDef, onClick = props.onClick;
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var showFilter = React.useCallback(function (event) {
        onClick(event);
        apiRef.current.showFilterPanel(colDef.field);
    }, [apiRef, colDef.field, onClick]);
    if (rootProps.disableColumnFilter || !colDef.filterable) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)(rootProps.slots.baseMenuItem, { onClick: showFilter, iconStart: (0, jsx_runtime_1.jsx)(rootProps.slots.columnMenuFilterIcon, { fontSize: "small" }), children: apiRef.current.getLocaleText('columnMenuFilter') }));
}
GridColumnMenuFilterItem.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    colDef: prop_types_1.default.object.isRequired,
    onClick: prop_types_1.default.func.isRequired,
};
