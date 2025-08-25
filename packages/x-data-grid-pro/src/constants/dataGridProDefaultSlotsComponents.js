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
exports.DATA_GRID_PRO_DEFAULT_SLOTS_COMPONENTS = void 0;
var internals_1 = require("@mui/x-data-grid/internals");
var GridProColumnMenu_1 = require("../components/GridProColumnMenu");
var GridColumnHeaders_1 = require("../components/GridColumnHeaders");
var GridHeaderFilterMenu_1 = require("../components/headerFiltering/GridHeaderFilterMenu");
var GridHeaderFilterCell_1 = require("../components/headerFiltering/GridHeaderFilterCell");
var GridDetailPanels_1 = require("../components/GridDetailPanels");
var GridPinnedRows_1 = require("../components/GridPinnedRows");
var material_1 = require("../material");
exports.DATA_GRID_PRO_DEFAULT_SLOTS_COMPONENTS = __assign(__assign(__assign({}, internals_1.DATA_GRID_DEFAULT_SLOTS_COMPONENTS), material_1.default), { columnMenu: GridProColumnMenu_1.GridProColumnMenu, columnHeaders: GridColumnHeaders_1.GridColumnHeaders, detailPanels: GridDetailPanels_1.GridDetailPanels, headerFilterCell: GridHeaderFilterCell_1.GridHeaderFilterCell, headerFilterMenu: GridHeaderFilterMenu_1.GridHeaderFilterMenu, pinnedRows: GridPinnedRows_1.GridPinnedRows });
