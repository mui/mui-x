"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridOverlays = void 0;
var React = require("react");
var utils_1 = require("../../utils");
var useGridApiContext_1 = require("../../utils/useGridApiContext");
var useGridRootProps_1 = require("../../utils/useGridRootProps");
var filter_1 = require("../filter");
var rows_1 = require("../rows");
var gridRowsSelector_1 = require("../rows/gridRowsSelector");
var GridOverlays_1 = require("../../../components/base/GridOverlays");
var columns_1 = require("../columns");
var pivoting_1 = require("../pivoting");
/**
 * Uses the grid state to determine which overlay to display.
 * Returns the active overlay type and the active loading overlay variant.
 */
var useGridOverlays = function () {
    var _a, _b, _c;
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var totalRowCount = (0, utils_1.useGridSelector)(apiRef, rows_1.gridRowCountSelector);
    var visibleRowCount = (0, utils_1.useGridSelector)(apiRef, filter_1.gridExpandedRowCountSelector);
    var pinnedRowsCount = (0, utils_1.useGridSelector)(apiRef, gridRowsSelector_1.gridPinnedRowsCountSelector);
    var visibleColumns = (0, utils_1.useGridSelector)(apiRef, columns_1.gridVisibleColumnDefinitionsSelector);
    var noRows = totalRowCount === 0 && pinnedRowsCount === 0;
    var loading = (0, utils_1.useGridSelector)(apiRef, rows_1.gridRowsLoadingSelector);
    var pivotActive = (0, utils_1.useGridSelector)(apiRef, pivoting_1.gridPivotActiveSelector);
    var showNoRowsOverlay = !loading && noRows;
    var showNoResultsOverlay = !loading && totalRowCount > 0 && visibleRowCount === 0;
    var showNoColumnsOverlay = !loading && visibleColumns.length === 0;
    var showEmptyPivotOverlay = showNoRowsOverlay && pivotActive;
    var overlayType = null;
    var loadingOverlayVariant = null;
    if (showNoRowsOverlay) {
        overlayType = 'noRowsOverlay';
    }
    if (showNoColumnsOverlay) {
        overlayType = 'noColumnsOverlay';
    }
    if (showEmptyPivotOverlay) {
        overlayType = 'emptyPivotOverlay';
    }
    if (showNoResultsOverlay) {
        overlayType = 'noResultsOverlay';
    }
    if (loading) {
        overlayType = 'loadingOverlay';
        loadingOverlayVariant =
            (_c = (_b = (_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.loadingOverlay) === null || _b === void 0 ? void 0 : _b[noRows ? 'noRowsVariant' : 'variant']) !== null && _c !== void 0 ? _c : (noRows ? 'skeleton' : 'linear-progress');
    }
    var overlaysProps = {
        overlayType: overlayType,
        loadingOverlayVariant: loadingOverlayVariant,
    };
    var getOverlay = function () {
        var _a, _b;
        if (!overlayType) {
            return null;
        }
        var Overlay = (_a = rootProps.slots) === null || _a === void 0 ? void 0 : _a[overlayType];
        var overlayProps = (_b = rootProps.slotProps) === null || _b === void 0 ? void 0 : _b[overlayType];
        return (<GridOverlays_1.GridOverlayWrapper {...overlaysProps}>
        <Overlay {...overlayProps}/>
      </GridOverlays_1.GridOverlayWrapper>);
    };
    return { getOverlay: getOverlay, overlaysProps: overlaysProps };
};
exports.useGridOverlays = useGridOverlays;
