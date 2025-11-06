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
exports.GridPivotPanelSearch = GridPivotPanelSearch;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var system_1 = require("@mui/system");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var composeClasses_1 = require("@mui/utils/composeClasses");
var useGridApiContext_1 = require("../../hooks/utils/useGridApiContext");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        container: ['pivotPanelSearchContainer'],
    };
    return (0, composeClasses_1.default)(slots, x_data_grid_pro_1.getDataGridUtilityClass, classes);
};
var GridPivotPanelSearchContainer = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'PivotPanelSearchContainer',
})({
    padding: internals_1.vars.spacing(0, 1, 1),
});
function GridPivotPanelSearch(props) {
    var _a;
    var onClear = props.onClear, value = props.value, onChange = props.onChange;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var classes = useUtilityClasses(rootProps);
    var handleKeyDown = function (event) {
        if (event.key === 'Escape') {
            onClear();
        }
    };
    return ((0, jsx_runtime_1.jsx)(GridPivotPanelSearchContainer, { ownerState: rootProps, className: classes.container, children: (0, jsx_runtime_1.jsx)(rootProps.slots.baseTextField, __assign({ size: "small", "aria-label": apiRef.current.getLocaleText('pivotSearchControlLabel'), placeholder: apiRef.current.getLocaleText('pivotSearchControlPlaceholder'), onKeyDown: handleKeyDown, fullWidth: true, slotProps: {
                input: {
                    startAdornment: (0, jsx_runtime_1.jsx)(rootProps.slots.pivotSearchIcon, { fontSize: "small" }),
                    endAdornment: value ? ((0, jsx_runtime_1.jsx)(rootProps.slots.baseIconButton, { edge: "end", size: "small", onClick: onClear, "aria-label": apiRef.current.getLocaleText('pivotSearchControlClear'), children: (0, jsx_runtime_1.jsx)(rootProps.slots.pivotSearchClearIcon, { fontSize: "small" }) })) : null,
                },
                htmlInput: {
                    role: 'searchbox',
                },
            } }, (_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseTextField, { value: value, onChange: onChange })) }));
}
