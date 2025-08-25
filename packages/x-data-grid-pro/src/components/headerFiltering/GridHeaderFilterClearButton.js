"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridHeaderFilterClearButton = GridHeaderFilterClearButton;
var React = require("react");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
function GridHeaderFilterClearButton(props) {
    var _a;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    return (<rootProps.slots.baseIconButton tabIndex={-1} aria-label="Clear filter" size="small" {...(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseIconButton} {...props}>
      <rootProps.slots.columnMenuClearIcon fontSize="inherit"/>
    </rootProps.slots.baseIconButton>);
}
