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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGroupingColDefForAllGroupingCriteria = exports.createGroupingColDefForOneGroupingCriteria = void 0;
var React = require("react");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var GridGroupingColumnFooterCell_1 = require("../../../components/GridGroupingColumnFooterCell");
var GridGroupingCriteriaCell_1 = require("../../../components/GridGroupingCriteriaCell");
var GridDataSourceGroupingCriteriaCell_1 = require("../../../components/GridDataSourceGroupingCriteriaCell");
var GridGroupingColumnLeafCell_1 = require("../../../components/GridGroupingColumnLeafCell");
var gridRowGroupingUtils_1 = require("./gridRowGroupingUtils");
var gridRowGroupingSelector_1 = require("./gridRowGroupingSelector");
var GROUPING_COL_DEF_DEFAULT_PROPERTIES = __assign(__assign({}, x_data_grid_pro_1.GRID_STRING_COL_DEF), { type: 'custom', disableReorder: true });
var GROUPING_COL_DEF_FORCED_PROPERTIES_DEFAULT = {
    editable: false,
    groupable: false,
};
var GROUPING_COL_DEF_FORCED_PROPERTIES_DATA_SOURCE = __assign(__assign({}, GROUPING_COL_DEF_FORCED_PROPERTIES_DEFAULT), { 
    // TODO: Support these features on the grouping column(s)
    filterable: false, sortable: false });
/**
 * When sorting two cells with different grouping criteria, we consider that the cell with the grouping criteria coming first in the model should be displayed below.
 * This can occur when some rows don't have all the fields. In which case we want the rows with the missing field to be displayed above.
 * TODO: Make this index comparator depth invariant, the logic should not be inverted when sorting in the "desc" direction (but the current return format of `sortComparator` does not support this behavior).
 */
var groupingFieldIndexComparator = function (v1, v2, cellParams1, cellParams2) {
    var _a, _b;
    var model = (0, gridRowGroupingSelector_1.gridRowGroupingSanitizedModelSelector)({ current: cellParams1.api });
    var groupingField1 = (_a = cellParams1.rowNode.groupingField) !== null && _a !== void 0 ? _a : null;
    var groupingField2 = (_b = cellParams2.rowNode.groupingField) !== null && _b !== void 0 ? _b : null;
    if (groupingField1 === groupingField2) {
        return 0;
    }
    if (groupingField1 == null) {
        return -1;
    }
    if (groupingField2 == null) {
        return 1;
    }
    if (model.indexOf(groupingField1) < model.indexOf(groupingField2)) {
        return -1;
    }
    return 1;
};
var getLeafProperties = function (leafColDef) {
    var _a;
    return ({
        headerName: (_a = leafColDef.headerName) !== null && _a !== void 0 ? _a : leafColDef.field,
        sortable: leafColDef.sortable,
        filterable: leafColDef.filterable,
        valueOptions: (0, internals_1.isSingleSelectColDef)(leafColDef) ? leafColDef.valueOptions : undefined,
        filterOperators: leafColDef.filterOperators,
        sortComparator: function (v1, v2, cellParams1, cellParams2) {
            // We only want to sort the leaves
            if (cellParams1.rowNode.type === 'leaf' && cellParams2.rowNode.type === 'leaf') {
                return leafColDef.sortComparator(v1, v2, cellParams1, cellParams2);
            }
            return groupingFieldIndexComparator(v1, v2, cellParams1, cellParams2);
        },
    });
};
var groupedByColValueFormatter = function (groupedByColDef) { return function (value, row, _, apiRef) {
    var rowId = (0, x_data_grid_pro_1.gridRowIdSelector)(apiRef, row);
    var rowNode = (0, x_data_grid_pro_1.gridRowNodeSelector)(apiRef, rowId);
    if (rowNode.type === 'group' && rowNode.groupingField === groupedByColDef.field) {
        return groupedByColDef.valueFormatter(value, row, groupedByColDef, apiRef);
    }
    return value;
}; };
var getGroupingCriteriaProperties = function (groupedByColDef, applyHeaderName) {
    var _a;
    var properties = {
        sortable: groupedByColDef.sortable,
        filterable: groupedByColDef.filterable,
        valueFormatter: groupedByColDef.valueFormatter
            ? groupedByColValueFormatter(groupedByColDef)
            : undefined,
        valueOptions: (0, internals_1.isSingleSelectColDef)(groupedByColDef) ? groupedByColDef.valueOptions : undefined,
        sortComparator: function (v1, v2, cellParams1, cellParams2) {
            // We only want to sort the groups of the current grouping criteria
            if (cellParams1.rowNode.type === 'group' &&
                cellParams2.rowNode.type === 'group' &&
                cellParams1.rowNode.groupingField === cellParams2.rowNode.groupingField) {
                var colDef = cellParams1.api.getColumn(cellParams1.rowNode.groupingField);
                return colDef.sortComparator(v1, v2, cellParams1, cellParams2);
            }
            return groupingFieldIndexComparator(v1, v2, cellParams1, cellParams2);
        },
        filterOperators: groupedByColDef.filterOperators,
    };
    if (applyHeaderName) {
        properties.headerName = (_a = groupedByColDef.headerName) !== null && _a !== void 0 ? _a : groupedByColDef.field;
    }
    return properties;
};
/**
 * Creates the `GridColDef` for a grouping column that only takes care of a single grouping criteria
 */
var createGroupingColDefForOneGroupingCriteria = function (_a) {
    var _b, _c;
    var columnsLookup = _a.columnsLookup, groupedByColDef = _a.groupedByColDef, groupingCriteria = _a.groupingCriteria, colDefOverride = _a.colDefOverride, _d = _a.strategy, strategy = _d === void 0 ? internals_1.RowGroupingStrategy.Default : _d;
    var _e = colDefOverride !== null && colDefOverride !== void 0 ? colDefOverride : {}, leafField = _e.leafField, mainGroupingCriteria = _e.mainGroupingCriteria, hideDescendantCount = _e.hideDescendantCount, colDefOverrideProperties = __rest(_e, ["leafField", "mainGroupingCriteria", "hideDescendantCount"]);
    var leafColDef = leafField ? columnsLookup[leafField] : null;
    var CriteriaCell = strategy === internals_1.RowGroupingStrategy.Default
        ? GridGroupingCriteriaCell_1.GridGroupingCriteriaCell
        : GridDataSourceGroupingCriteriaCell_1.GridDataSourceGroupingCriteriaCell;
    // The properties that do not depend on the presence of a `leafColDef` and that can be overridden by `colDefOverride`
    var commonProperties = {
        width: Math.max(((_b = groupedByColDef.width) !== null && _b !== void 0 ? _b : x_data_grid_pro_1.GRID_STRING_COL_DEF.width) + 40, (_c = leafColDef === null || leafColDef === void 0 ? void 0 : leafColDef.width) !== null && _c !== void 0 ? _c : 0),
        renderCell: function (params) {
            // Render footer
            if (params.rowNode.type === 'footer' || params.rowNode.type === 'pinnedRow') {
                return <GridGroupingColumnFooterCell_1.GridGroupingColumnFooterCell {...params}/>;
            }
            // Render leaves
            if (params.rowNode.type === 'leaf') {
                if (leafColDef) {
                    var leafParams = __assign(__assign({}, params.api.getCellParams(params.id, leafField)), { api: params.api, hasFocus: params.hasFocus });
                    if (leafColDef.renderCell) {
                        return leafColDef.renderCell(leafParams);
                    }
                    return <GridGroupingColumnLeafCell_1.GridGroupingColumnLeafCell {...leafParams}/>;
                }
                return '';
            }
            // Render current grouping criteria groups
            if (params.rowNode.groupingField === groupingCriteria) {
                return (<CriteriaCell {...params} hideDescendantCount={hideDescendantCount}/>);
            }
            return '';
        },
        valueGetter: function (value, row, column, apiRef) {
            var rowId = (0, x_data_grid_pro_1.gridRowIdSelector)(apiRef, row);
            var rowNode = (0, x_data_grid_pro_1.gridRowNodeSelector)(apiRef, rowId);
            if (!rowNode || rowNode.type === 'footer' || rowNode.type === 'pinnedRow') {
                return undefined;
            }
            if (rowNode.type === 'leaf') {
                if (leafColDef) {
                    return apiRef.current.getCellValue(rowId, leafField);
                }
                return undefined;
            }
            if (rowNode.groupingField === groupingCriteria) {
                return rowNode.groupingKey;
            }
            return undefined;
        },
    };
    // If we have a `mainGroupingCriteria` defined and matching the `groupingCriteria`
    // Then we apply the sorting / filtering on the groups of this column's grouping criteria based on the properties of `groupedByColDef`.
    // It can be useful to define a `leafField` for leaves rendering but still use the grouping criteria for the sorting / filtering
    //
    // If we have a `leafField` defined and matching an existing column
    // Then we apply the sorting / filtering on the leaves based on the properties of `leavesColDef`
    //
    // By default, we apply the sorting / filtering on the groups of this column's grouping criteria based on the properties of `groupedColDef`.
    var sourceProperties;
    if (mainGroupingCriteria && mainGroupingCriteria === groupingCriteria) {
        sourceProperties = getGroupingCriteriaProperties(groupedByColDef, true);
    }
    else if (leafColDef) {
        sourceProperties = getLeafProperties(leafColDef);
    }
    else {
        sourceProperties = getGroupingCriteriaProperties(groupedByColDef, true);
    }
    // The properties that can't be overridden with `colDefOverride`
    var forcedProperties = __assign({ field: (0, gridRowGroupingUtils_1.getRowGroupingFieldFromGroupingCriteria)(groupingCriteria) }, GROUPING_COL_DEF_FORCED_PROPERTIES_DEFAULT);
    return __assign(__assign(__assign(__assign(__assign({}, GROUPING_COL_DEF_DEFAULT_PROPERTIES), commonProperties), sourceProperties), colDefOverrideProperties), forcedProperties);
};
exports.createGroupingColDefForOneGroupingCriteria = createGroupingColDefForOneGroupingCriteria;
/**
 * Creates the `GridColDef` for a grouping column that takes care of all the grouping criteria
 */
var createGroupingColDefForAllGroupingCriteria = function (_a) {
    var _b;
    var apiRef = _a.apiRef, columnsLookup = _a.columnsLookup, rowGroupingModel = _a.rowGroupingModel, colDefOverride = _a.colDefOverride, _c = _a.strategy, strategy = _c === void 0 ? internals_1.RowGroupingStrategy.Default : _c;
    var _d = colDefOverride !== null && colDefOverride !== void 0 ? colDefOverride : {}, leafField = _d.leafField, mainGroupingCriteria = _d.mainGroupingCriteria, hideDescendantCount = _d.hideDescendantCount, colDefOverrideProperties = __rest(_d, ["leafField", "mainGroupingCriteria", "hideDescendantCount"]);
    var leafColDef = leafField ? columnsLookup[leafField] : null;
    var CriteriaCell = strategy === internals_1.RowGroupingStrategy.Default
        ? GridGroupingCriteriaCell_1.GridGroupingCriteriaCell
        : GridDataSourceGroupingCriteriaCell_1.GridDataSourceGroupingCriteriaCell;
    // The properties that do not depend on the presence of a `leafColDef` and that can be overridden by `colDefOverride`
    var commonProperties = {
        headerName: apiRef.current.getLocaleText('groupingColumnHeaderName'),
        width: Math.max.apply(Math, __spreadArray(__spreadArray([], rowGroupingModel.map(function (field) { var _a; return ((_a = columnsLookup[field].width) !== null && _a !== void 0 ? _a : x_data_grid_pro_1.GRID_STRING_COL_DEF.width) + 40; }), false), [(_b = leafColDef === null || leafColDef === void 0 ? void 0 : leafColDef.width) !== null && _b !== void 0 ? _b : 0], false)),
        renderCell: function (params) {
            // Render footer
            if (params.rowNode.type === 'footer' || params.rowNode.type === 'pinnedRow') {
                return <GridGroupingColumnFooterCell_1.GridGroupingColumnFooterCell {...params}/>;
            }
            // Render the leaves
            if (params.rowNode.type === 'leaf') {
                if (leafColDef) {
                    var leafParams = __assign(__assign({}, params.api.getCellParams(params.id, leafField)), { api: params.api, hasFocus: params.hasFocus });
                    if (leafColDef.renderCell) {
                        return leafColDef.renderCell(leafParams);
                    }
                    return <GridGroupingColumnLeafCell_1.GridGroupingColumnLeafCell {...leafParams}/>;
                }
                return '';
            }
            // Render the groups
            return (<CriteriaCell {...params} hideDescendantCount={hideDescendantCount}/>);
        },
        valueGetter: function (value, row) {
            var rowId = (0, x_data_grid_pro_1.gridRowIdSelector)(apiRef, row);
            var rowNode = (0, x_data_grid_pro_1.gridRowNodeSelector)(apiRef, rowId);
            if (!rowNode || rowNode.type === 'footer' || rowNode.type === 'pinnedRow') {
                return undefined;
            }
            if (rowNode.type === 'leaf') {
                if (leafColDef) {
                    return apiRef.current.getCellValue(rowId, leafField);
                }
                return undefined;
            }
            return rowNode.groupingKey;
        },
    };
    // If we have a `mainGroupingCriteria` defined and matching one of the `orderedGroupedByFields`
    // Then we apply the sorting / filtering on the groups of this column's grouping criteria based on the properties of `columnsLookup[mainGroupingCriteria]`.
    // It can be useful to use another grouping criteria than the top level one for the sorting / filtering
    //
    // If we have a `leafField` defined and matching an existing column
    // Then we apply the sorting / filtering on the leaves based on the properties of `leavesColDef`
    //
    // By default, we apply the sorting / filtering on the groups of the top level grouping criteria based on the properties of `columnsLookup[orderedGroupedByFields[0]]`.
    var sourceProperties;
    if (mainGroupingCriteria && rowGroupingModel.includes(mainGroupingCriteria)) {
        sourceProperties = getGroupingCriteriaProperties(columnsLookup[mainGroupingCriteria], true);
    }
    else if (leafColDef) {
        sourceProperties = getLeafProperties(leafColDef);
    }
    else {
        sourceProperties = getGroupingCriteriaProperties(columnsLookup[rowGroupingModel[0]], rowGroupingModel.length === 1);
    }
    // The properties that can't be overridden with `colDefOverride`
    var forcedProperties = __assign({ field: gridRowGroupingUtils_1.GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD }, (strategy === internals_1.RowGroupingStrategy.Default
        ? GROUPING_COL_DEF_FORCED_PROPERTIES_DEFAULT
        : GROUPING_COL_DEF_FORCED_PROPERTIES_DATA_SOURCE));
    return __assign(__assign(__assign(__assign(__assign({}, GROUPING_COL_DEF_DEFAULT_PROPERTIES), commonProperties), sourceProperties), colDefOverrideProperties), forcedProperties);
};
exports.createGroupingColDefForAllGroupingCriteria = createGroupingColDefForAllGroupingCriteria;
