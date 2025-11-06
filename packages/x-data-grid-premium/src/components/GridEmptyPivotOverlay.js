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
exports.GridEmptyPivotOverlay = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var prop_types_1 = require("prop-types");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var x_data_grid_1 = require("@mui/x-data-grid");
var useGridApiContext_1 = require("../hooks/utils/useGridApiContext");
var GridEmptyPivotOverlay = (0, forwardRef_1.forwardRef)(function GridEmptyPivotOverlay(props, ref) {
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    return ((0, jsx_runtime_1.jsx)(x_data_grid_1.GridOverlay, __assign({}, props, { ref: ref, children: apiRef.current.getLocaleText('emptyPivotOverlayLabel') })));
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
