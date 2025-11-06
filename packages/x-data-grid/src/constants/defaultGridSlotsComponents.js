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
exports.DATA_GRID_DEFAULT_SLOTS_COMPONENTS = void 0;
var components_1 = require("../components");
var GridCell_1 = require("../components/cell/GridCell");
var GridColumnHeaders_1 = require("../components/GridColumnHeaders");
var GridColumnMenu_1 = require("../components/menu/columnMenu/GridColumnMenu");
var GridDetailPanels_1 = require("../components/GridDetailPanels");
var GridPinnedRows_1 = require("../components/GridPinnedRows");
var GridNoResultsOverlay_1 = require("../components/GridNoResultsOverlay");
var material_1 = require("../material");
var GridBottomContainer_1 = require("../components/virtualization/GridBottomContainer");
var GridToolbar_1 = require("../components/toolbarV8/GridToolbar");
// TODO: camelCase these key. It's a private helper now.
// Remove then need to call `uncapitalizeObjectKeys`.
exports.DATA_GRID_DEFAULT_SLOTS_COMPONENTS = __assign(__assign({}, material_1.default), { cell: GridCell_1.GridCell, skeletonCell: components_1.GridSkeletonCell, columnHeaderFilterIconButton: components_1.GridColumnHeaderFilterIconButton, columnHeaderSortIcon: components_1.GridColumnHeaderSortIcon, columnMenu: GridColumnMenu_1.GridColumnMenu, columnHeaders: GridColumnHeaders_1.GridColumnHeaders, detailPanels: GridDetailPanels_1.GridDetailPanels, bottomContainer: GridBottomContainer_1.GridBottomContainer, footer: components_1.GridFooter, footerRowCount: components_1.GridRowCount, toolbar: GridToolbar_1.GridToolbar, pinnedRows: GridPinnedRows_1.GridPinnedRows, loadingOverlay: components_1.GridLoadingOverlay, noResultsOverlay: GridNoResultsOverlay_1.GridNoResultsOverlay, noRowsOverlay: components_1.GridNoRowsOverlay, noColumnsOverlay: components_1.GridNoColumnsOverlay, pagination: components_1.GridPagination, filterPanel: components_1.GridFilterPanel, columnsPanel: components_1.GridColumnsPanel, columnsManagement: components_1.GridColumnsManagement, panel: components_1.GridPanel, row: components_1.GridRow });
