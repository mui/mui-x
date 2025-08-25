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
exports.gridDateComparator = exports.gridNumberComparator = exports.gridStringOrNumberComparator = exports.getNextGridSortDirection = exports.buildAggregatedSortingApplier = exports.mergeStateWithSortModel = exports.sanitizeSortModel = void 0;
var warning_1 = require("@mui/x-internals/warning");
var gridRowsSelector_1 = require("../rows/gridRowsSelector");
var sanitizeSortModel = function (model, disableMultipleColumnsSorting) {
    if (disableMultipleColumnsSorting && model.length > 1) {
        if (process.env.NODE_ENV !== 'production') {
            (0, warning_1.warnOnce)([
                'MUI X: The `sortModel` can only contain a single item when the `disableMultipleColumnsSorting` prop is set to `true`.',
                'If you are using the community version of the Data Grid, this prop is always `true`.',
            ], 'error');
        }
        return [model[0]];
    }
    return model;
};
exports.sanitizeSortModel = sanitizeSortModel;
var mergeStateWithSortModel = function (sortModel, disableMultipleColumnsSorting) {
    return function (state) { return (__assign(__assign({}, state), { sorting: __assign(__assign({}, state.sorting), { sortModel: (0, exports.sanitizeSortModel)(sortModel, disableMultipleColumnsSorting) }) })); };
};
exports.mergeStateWithSortModel = mergeStateWithSortModel;
var isDesc = function (direction) { return direction === 'desc'; };
/**
 * Transform an item of the sorting model into a method comparing two rows.
 * @param {GridSortItem} sortItem The sort item we want to apply.
 * @param {RefObject<GridApiCommunity>} apiRef The API of the grid.
 * @returns {GridParsedSortItem | null} The parsed sort item. Returns `null` is the sort item is not valid.
 */
var parseSortItem = function (sortItem, apiRef) {
    var column = apiRef.current.getColumn(sortItem.field);
    if (!column || sortItem.sort === null) {
        return null;
    }
    var comparator;
    if (column.getSortComparator) {
        comparator = column.getSortComparator(sortItem.sort);
    }
    else {
        comparator = isDesc(sortItem.sort)
            ? function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return -1 * column.sortComparator.apply(column, args);
            }
            : column.sortComparator;
    }
    if (!comparator) {
        return null;
    }
    var getSortCellParams = function (id) { return ({
        id: id,
        field: column.field,
        rowNode: (0, gridRowsSelector_1.gridRowNodeSelector)(apiRef, id),
        value: apiRef.current.getCellValue(id, column.field),
        api: apiRef.current,
    }); };
    return { getSortCellParams: getSortCellParams, comparator: comparator };
};
/**
 * Compare two rows according to a list of valid sort items.
 * The `row1Params` and `row2Params` must have the same length as `parsedSortItems`,
 * and each of their index must contain the `GridSortCellParams` of the sort item with the same index.
 * @param {GridParsedSortItem[]} parsedSortItems All the sort items with which we want to compare the rows.
 * @param {GridRowAggregatedSortingParams} row1 The node and params of the 1st row for each sort item.
 * @param {GridRowAggregatedSortingParams} row2 The node and params of the 2nd row for each sort item.
 */
var compareRows = function (parsedSortItems, row1, row2) {
    return parsedSortItems.reduce(function (res, item, index) {
        if (res !== 0) {
            // return the results of the first comparator which distinguish the two rows
            return res;
        }
        var sortCellParams1 = row1.params[index];
        var sortCellParams2 = row2.params[index];
        res = item.comparator(sortCellParams1.value, sortCellParams2.value, sortCellParams1, sortCellParams2);
        return res;
    }, 0);
};
/**
 * Generates a method to easily sort a list of rows according to the current sort model.
 * @param {GridSortModel} sortModel The model with which we want to sort the rows.
 * @param {RefObject<GridApiCommunity>} apiRef The API of the grid.
 * @returns {GridSortingModelApplier | null} A method that generates a list of sorted row ids from a list of rows according to the current sort model. If `null`, we consider that the rows should remain in the order there were provided.
 */
var buildAggregatedSortingApplier = function (sortModel, apiRef) {
    var comparatorList = sortModel
        .map(function (item) { return parseSortItem(item, apiRef); })
        .filter(function (comparator) { return !!comparator; });
    if (comparatorList.length === 0) {
        return null;
    }
    return function (rowList) {
        return rowList
            .map(function (node) { return ({
            node: node,
            params: comparatorList.map(function (el) { return el.getSortCellParams(node.id); }),
        }); })
            .sort(function (a, b) { return compareRows(comparatorList, a, b); })
            .map(function (row) { return row.node.id; });
    };
};
exports.buildAggregatedSortingApplier = buildAggregatedSortingApplier;
var getNextGridSortDirection = function (sortingOrder, current) {
    var currentIdx = sortingOrder.indexOf(current);
    if (!current || currentIdx === -1 || currentIdx + 1 === sortingOrder.length) {
        return sortingOrder[0];
    }
    return sortingOrder[currentIdx + 1];
};
exports.getNextGridSortDirection = getNextGridSortDirection;
var gridNillComparator = function (v1, v2) {
    if (v1 == null && v2 != null) {
        return -1;
    }
    if (v2 == null && v1 != null) {
        return 1;
    }
    if (v1 == null && v2 == null) {
        return 0;
    }
    return null;
};
var collator = new Intl.Collator();
var gridStringOrNumberComparator = function (value1, value2) {
    var nillResult = gridNillComparator(value1, value2);
    if (nillResult !== null) {
        return nillResult;
    }
    if (typeof value1 === 'string') {
        return collator.compare(value1.toString(), value2.toString());
    }
    return value1 - value2;
};
exports.gridStringOrNumberComparator = gridStringOrNumberComparator;
var gridNumberComparator = function (value1, value2) {
    var nillResult = gridNillComparator(value1, value2);
    if (nillResult !== null) {
        return nillResult;
    }
    return Number(value1) - Number(value2);
};
exports.gridNumberComparator = gridNumberComparator;
var gridDateComparator = function (value1, value2) {
    var nillResult = gridNillComparator(value1, value2);
    if (nillResult !== null) {
        return nillResult;
    }
    if (value1 > value2) {
        return 1;
    }
    if (value1 < value2) {
        return -1;
    }
    return 0;
};
exports.gridDateComparator = gridDateComparator;
