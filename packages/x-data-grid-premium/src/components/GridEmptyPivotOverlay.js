"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridEmptyPivotOverlay = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var x_data_grid_1 = require("@mui/x-data-grid");
var useGridApiContext_1 = require("../hooks/utils/useGridApiContext");
var GridEmptyPivotOverlay = (0, forwardRef_1.forwardRef)(function GridEmptyPivotOverlay(props, ref) {
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    return (<x_data_grid_1.GridOverlay {...props} ref={ref}>
        {apiRef.current.getLocaleText('emptyPivotOverlayLabel')}
      </x_data_grid_1.GridOverlay>);
});
exports.GridEmptyPivotOverlay = GridEmptyPivotOverlay;
GridEmptyPivotOverlay.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    sx: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
        prop_types_1.default.func,
        prop_types_1.default.object,
    ]),
};
