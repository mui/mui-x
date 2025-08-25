"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridNoRowsOverlay = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var useGridApiContext_1 = require("../hooks/utils/useGridApiContext");
var GridOverlay_1 = require("./containers/GridOverlay");
var GridNoRowsOverlay = (0, forwardRef_1.forwardRef)(function GridNoRowsOverlay(props, ref) {
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var noRowsLabel = apiRef.current.getLocaleText('noRowsLabel');
    return (<GridOverlay_1.GridOverlay {...props} ref={ref}>
        {noRowsLabel}
      </GridOverlay_1.GridOverlay>);
});
exports.GridNoRowsOverlay = GridNoRowsOverlay;
GridNoRowsOverlay.propTypes = {
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
