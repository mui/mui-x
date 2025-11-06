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
exports.GridPremiumColumnMenu = exports.GRID_COLUMN_MENU_SLOT_PROPS_PREMIUM = exports.GRID_COLUMN_MENU_SLOTS_PREMIUM = void 0;
exports.GridColumnMenuGroupingItem = GridColumnMenuGroupingItem;
var jsx_runtime_1 = require("react/jsx-runtime");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var GridColumnMenuAggregationItem_1 = require("./columnMenu/menuItems/GridColumnMenuAggregationItem");
var rowGrouping_1 = require("../hooks/features/rowGrouping");
var GridColumnMenuRowGroupItem_1 = require("./columnMenu/menuItems/GridColumnMenuRowGroupItem");
var GridColumnMenuRowUngroupItem_1 = require("./columnMenu/menuItems/GridColumnMenuRowUngroupItem");
var GridColumnMenuManagePanelItem_1 = require("./columnMenu/menuItems/GridColumnMenuManagePanelItem");
function GridColumnMenuGroupingItem(props) {
    var colDef = props.colDef;
    if ((0, rowGrouping_1.isGroupingColumn)(colDef.field)) {
        return (0, jsx_runtime_1.jsx)(GridColumnMenuRowGroupItem_1.GridColumnMenuRowGroupItem, __assign({}, props));
    }
    return (0, jsx_runtime_1.jsx)(GridColumnMenuRowUngroupItem_1.GridColumnMenuRowUngroupItem, __assign({}, props));
}
exports.GRID_COLUMN_MENU_SLOTS_PREMIUM = __assign(__assign({}, x_data_grid_pro_1.GRID_COLUMN_MENU_SLOTS), { columnMenuAggregationItem: GridColumnMenuAggregationItem_1.GridColumnMenuAggregationItem, columnMenuGroupingItem: GridColumnMenuGroupingItem, columnMenuManagePanelItem: GridColumnMenuManagePanelItem_1.GridColumnMenuManagePanelItem });
exports.GRID_COLUMN_MENU_SLOT_PROPS_PREMIUM = __assign(__assign({}, x_data_grid_pro_1.GRID_COLUMN_MENU_SLOT_PROPS), { columnMenuAggregationItem: { displayOrder: 23 }, columnMenuGroupingItem: { displayOrder: 27 }, columnMenuManagePanelItem: { displayOrder: 28 } });
exports.GridPremiumColumnMenu = (0, forwardRef_1.forwardRef)(function GridPremiumColumnMenuSimple(props, ref) {
    return ((0, jsx_runtime_1.jsx)(x_data_grid_pro_1.GridGenericColumnMenu, __assign({}, props, { defaultSlots: exports.GRID_COLUMN_MENU_SLOTS_PREMIUM, defaultSlotProps: exports.GRID_COLUMN_MENU_SLOT_PROPS_PREMIUM, ref: ref })));
});
