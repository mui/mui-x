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
exports.GridNoColumnsOverlay = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var prop_types_1 = require("prop-types");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
var useGridApiContext_1 = require("../hooks/utils/useGridApiContext");
var GridOverlay_1 = require("./containers/GridOverlay");
var gridPreferencePanelsValue_1 = require("../hooks/features/preferencesPanel/gridPreferencePanelsValue");
var hooks_1 = require("../hooks");
var GridNoColumnsOverlay = (0, forwardRef_1.forwardRef)(function GridNoColumnsOverlay(props, ref) {
    var _a;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var columns = (0, hooks_1.useGridSelector)(apiRef, hooks_1.gridColumnFieldsSelector);
    var handleOpenManageColumns = function () {
        apiRef.current.showPreferences(gridPreferencePanelsValue_1.GridPreferencePanelsValue.columns);
    };
    var showManageColumnsButton = !rootProps.disableColumnSelector && columns.length > 0;
    return ((0, jsx_runtime_1.jsxs)(GridOverlay_1.GridOverlay, __assign({}, props, { ref: ref, children: [apiRef.current.getLocaleText('noColumnsOverlayLabel'), showManageColumnsButton && ((0, jsx_runtime_1.jsx)(rootProps.slots.baseButton, __assign({ size: "small" }, (_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseButton, { onClick: handleOpenManageColumns, children: apiRef.current.getLocaleText('noColumnsOverlayManageColumns') })))] })));
});
exports.GridNoColumnsOverlay = GridNoColumnsOverlay;
GridNoColumnsOverlay.propTypes = {
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
