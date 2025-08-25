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
exports.GridProColumnMenu = exports.GRID_COLUMN_MENU_SLOT_PROPS_PRO = exports.GRID_COLUMN_MENU_SLOTS_PRO = void 0;
var React = require("react");
var x_data_grid_1 = require("@mui/x-data-grid");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var GridColumnMenuPinningItem_1 = require("./GridColumnMenuPinningItem");
exports.GRID_COLUMN_MENU_SLOTS_PRO = __assign(__assign({}, x_data_grid_1.GRID_COLUMN_MENU_SLOTS), { columnMenuPinningItem: GridColumnMenuPinningItem_1.GridColumnMenuPinningItem });
exports.GRID_COLUMN_MENU_SLOT_PROPS_PRO = __assign(__assign({}, x_data_grid_1.GRID_COLUMN_MENU_SLOT_PROPS), { columnMenuPinningItem: {
        displayOrder: 15,
    } });
exports.GridProColumnMenu = (0, forwardRef_1.forwardRef)(function GridProColumnMenu(props, ref) {
    return (<x_data_grid_1.GridGenericColumnMenu {...props} defaultSlots={exports.GRID_COLUMN_MENU_SLOTS_PRO} defaultSlotProps={exports.GRID_COLUMN_MENU_SLOT_PROPS_PRO} ref={ref}/>);
});
