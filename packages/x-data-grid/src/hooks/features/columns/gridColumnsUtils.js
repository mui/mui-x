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
exports.createColumnsState = exports.applyInitialState = exports.hydrateColumnsWidth = exports.COLUMNS_DIMENSION_PROPERTIES = void 0;
exports.computeFlexColumnsWidth = computeFlexColumnsWidth;
exports.getDefaultColTypeDef = getDefaultColTypeDef;
exports.getFirstNonSpannedColumnToRender = getFirstNonSpannedColumnToRender;
exports.getTotalHeaderHeight = getTotalHeaderHeight;
var resolveProps_1 = require("@mui/utils/resolveProps");
var colDef_1 = require("../../../colDef");
var gridColumnsSelector_1 = require("./gridColumnsSelector");
var utils_1 = require("../../../utils/utils");
var densitySelector_1 = require("../density/densitySelector");
var gridHeaderFilteringSelectors_1 = require("../headerFiltering/gridHeaderFilteringSelectors");
var gridColumnGroupsSelector_1 = require("../columnGrouping/gridColumnGroupsSelector");
exports.COLUMNS_DIMENSION_PROPERTIES = ['maxWidth', 'minWidth', 'width', 'flex'];
var COLUMN_TYPES = (0, colDef_1.getGridDefaultColumnTypes)();
/**
 * Computes width for flex columns.
 * Based on CSS Flexbox specification:
 * https://drafts.csswg.org/css-flexbox-1/#resolve-flexible-lengths
 */
function computeFlexColumnsWidth(_a) {
    var initialFreeSpace = _a.initialFreeSpace, totalFlexUnits = _a.totalFlexUnits, flexColumns = _a.flexColumns;
    var uniqueFlexColumns = new Set(flexColumns.map(function (col) { return col.field; }));
    var flexColumnsLookup = {
        all: {},
        frozenFields: [],
        freeze: function (field) {
            var value = flexColumnsLookup.all[field];
            if (value && value.frozen !== true) {
                flexColumnsLookup.all[field].frozen = true;
                flexColumnsLookup.frozenFields.push(field);
            }
        },
    };
    // Step 5 of https://drafts.csswg.org/css-flexbox-1/#resolve-flexible-lengths
    function loopOverFlexItems() {
        // 5a: If all the flex items on the line are frozen, free space has been distributed.
        if (flexColumnsLookup.frozenFields.length === uniqueFlexColumns.size) {
            return;
        }
        var violationsLookup = { min: {}, max: {} };
        var remainingFreeSpace = initialFreeSpace;
        var flexUnits = totalFlexUnits;
        var totalViolation = 0;
        // 5b: Calculate the remaining free space
        flexColumnsLookup.frozenFields.forEach(function (field) {
            remainingFreeSpace -= flexColumnsLookup.all[field].computedWidth;
            flexUnits -= flexColumnsLookup.all[field].flex;
        });
        for (var i = 0; i < flexColumns.length; i += 1) {
            var column = flexColumns[i];
            if (flexColumnsLookup.all[column.field] &&
                flexColumnsLookup.all[column.field].frozen === true) {
                continue;
            }
            // 5c: Distribute remaining free space proportional to the flex factors
            var widthPerFlexUnit = remainingFreeSpace / flexUnits;
            var computedWidth = widthPerFlexUnit * column.flex;
            // 5d: Fix min/max violations
            if (computedWidth < column.minWidth) {
                totalViolation += column.minWidth - computedWidth;
                computedWidth = column.minWidth;
                violationsLookup.min[column.field] = true;
            }
            else if (computedWidth > column.maxWidth) {
                totalViolation += column.maxWidth - computedWidth;
                computedWidth = column.maxWidth;
                violationsLookup.max[column.field] = true;
            }
            flexColumnsLookup.all[column.field] = {
                frozen: false,
                computedWidth: computedWidth,
                flex: column.flex,
            };
        }
        // 5e: Freeze over-flexed items
        if (totalViolation < 0) {
            // Freeze all the items with max violations
            Object.keys(violationsLookup.max).forEach(function (field) {
                flexColumnsLookup.freeze(field);
            });
        }
        else if (totalViolation > 0) {
            // Freeze all the items with min violations
            Object.keys(violationsLookup.min).forEach(function (field) {
                flexColumnsLookup.freeze(field);
            });
        }
        else {
            // Freeze all items
            flexColumns.forEach(function (_a) {
                var field = _a.field;
                flexColumnsLookup.freeze(field);
            });
        }
        // 5f: Return to the start of this loop
        loopOverFlexItems();
    }
    loopOverFlexItems();
    return flexColumnsLookup.all;
}
/**
 * Compute the `computedWidth` (ie: the width the column should have during rendering) based on the `width` / `flex` / `minWidth` / `maxWidth` properties of `GridColDef`.
 * The columns already have been merged with there `type` default values for `minWidth`, `maxWidth` and `width`, thus the `!` for those properties below.
 * TODO: Unit test this function in depth and only keep basic cases for the whole grid testing.
 * TODO: Improve the `GridColDef` typing to reflect the fact that `minWidth` / `maxWidth` and `width` can't be null after the merge with the `type` default values.
 */
var hydrateColumnsWidth = function (rawState, dimensions) {
    var columnsLookup = {};
    var totalFlexUnits = 0;
    var widthAllocatedBeforeFlex = 0;
    var flexColumns = [];
    // For the non-flex columns, compute their width
    // For the flex columns, compute their minimum width and how much width must be allocated during the flex allocation
    rawState.orderedFields.forEach(function (columnField) {
        var column = rawState.lookup[columnField];
        var computedWidth = 0;
        var isFlex = false;
        if (rawState.columnVisibilityModel[columnField] !== false) {
            if (column.flex && column.flex > 0) {
                totalFlexUnits += column.flex;
                isFlex = true;
            }
            else {
                computedWidth = (0, utils_1.clamp)(column.width || colDef_1.GRID_STRING_COL_DEF.width, column.minWidth || colDef_1.GRID_STRING_COL_DEF.minWidth, column.maxWidth || colDef_1.GRID_STRING_COL_DEF.maxWidth);
            }
            widthAllocatedBeforeFlex += computedWidth;
        }
        if (column.computedWidth !== computedWidth) {
            column = __assign(__assign({}, column), { computedWidth: computedWidth });
        }
        if (isFlex) {
            flexColumns.push(column);
        }
        columnsLookup[columnField] = column;
    });
    var availableWidth = dimensions === undefined
        ? 0
        : dimensions.viewportOuterSize.width - (dimensions.hasScrollY ? dimensions.scrollbarSize : 0);
    var initialFreeSpace = Math.max(availableWidth - widthAllocatedBeforeFlex, 0);
    // Allocate the remaining space to the flex columns
    if (totalFlexUnits > 0 && availableWidth > 0) {
        var computedColumnWidths_1 = computeFlexColumnsWidth({
            initialFreeSpace: initialFreeSpace,
            totalFlexUnits: totalFlexUnits,
            flexColumns: flexColumns,
        });
        Object.keys(computedColumnWidths_1).forEach(function (field) {
            columnsLookup[field] = __assign(__assign({}, columnsLookup[field]), { computedWidth: computedColumnWidths_1[field].computedWidth });
        });
    }
    return __assign(__assign({}, rawState), { lookup: columnsLookup });
};
exports.hydrateColumnsWidth = hydrateColumnsWidth;
/**
 * Apply the order and the dimensions of the initial state.
 * The columns not registered in `orderedFields` will be placed after the imported columns.
 */
var applyInitialState = function (columnsState, initialState) {
    if (!initialState) {
        return columnsState;
    }
    var _a = initialState.orderedFields, orderedFields = _a === void 0 ? [] : _a, _b = initialState.dimensions, dimensions = _b === void 0 ? {} : _b;
    var columnsWithUpdatedDimensions = Object.keys(dimensions);
    if (columnsWithUpdatedDimensions.length === 0 && orderedFields.length === 0) {
        return columnsState;
    }
    var orderedFieldsLookup = {};
    var cleanOrderedFields = [];
    for (var i = 0; i < orderedFields.length; i += 1) {
        var field = orderedFields[i];
        // Ignores the fields in the initialState that matches no field on the current column state
        if (columnsState.lookup[field]) {
            orderedFieldsLookup[field] = true;
            cleanOrderedFields.push(field);
        }
    }
    var newOrderedFields = cleanOrderedFields.length === 0
        ? columnsState.orderedFields
        : __spreadArray(__spreadArray([], cleanOrderedFields, true), columnsState.orderedFields.filter(function (field) { return !orderedFieldsLookup[field]; }), true);
    var newColumnLookup = __assign({}, columnsState.lookup);
    var _loop_1 = function (i) {
        var field = columnsWithUpdatedDimensions[i];
        var newColDef = __assign(__assign({}, newColumnLookup[field]), { hasBeenResized: true });
        Object.entries(dimensions[field]).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            newColDef[key] = value === -1 ? Infinity : value;
        });
        newColumnLookup[field] = newColDef;
    };
    for (var i = 0; i < columnsWithUpdatedDimensions.length; i += 1) {
        _loop_1(i);
    }
    var newColumnsState = __assign(__assign({}, columnsState), { orderedFields: newOrderedFields, lookup: newColumnLookup });
    return newColumnsState;
};
exports.applyInitialState = applyInitialState;
function getDefaultColTypeDef(type) {
    var colDef = COLUMN_TYPES[colDef_1.DEFAULT_GRID_COL_TYPE_KEY];
    if (type && COLUMN_TYPES[type]) {
        colDef = COLUMN_TYPES[type];
    }
    return colDef;
}
var createColumnsState = function (_a) {
    var _b, _c, _d;
    var apiRef = _a.apiRef, columnsToUpsert = _a.columnsToUpsert, initialState = _a.initialState, _e = _a.columnVisibilityModel, columnVisibilityModel = _e === void 0 ? (0, gridColumnsSelector_1.gridColumnVisibilityModelSelector)(apiRef) : _e, _f = _a.keepOnlyColumnsToUpsert, keepOnlyColumnsToUpsert = _f === void 0 ? false : _f, _g = _a.updateInitialVisibilityModel, updateInitialVisibilityModel = _g === void 0 ? false : _g;
    var isInsideStateInitializer = !apiRef.current.state.columns;
    var columnsState;
    if (isInsideStateInitializer) {
        columnsState = {
            orderedFields: [],
            lookup: {},
            columnVisibilityModel: columnVisibilityModel,
            initialColumnVisibilityModel: columnVisibilityModel,
        };
    }
    else {
        var currentState = (0, gridColumnsSelector_1.gridColumnsStateSelector)(apiRef);
        columnsState = {
            orderedFields: keepOnlyColumnsToUpsert ? [] : __spreadArray([], currentState.orderedFields, true),
            lookup: __assign({}, currentState.lookup), // Will be cleaned later if keepOnlyColumnsToUpsert=true
            columnVisibilityModel: columnVisibilityModel,
            initialColumnVisibilityModel: updateInitialVisibilityModel
                ? columnVisibilityModel
                : currentState.initialColumnVisibilityModel,
        };
    }
    var columnsToKeep = {};
    if (keepOnlyColumnsToUpsert && !isInsideStateInitializer) {
        for (var key in columnsState.lookup) {
            if (Object.prototype.hasOwnProperty.call(columnsState.lookup, key)) {
                columnsToKeep[key] = false;
            }
        }
    }
    var columnsToUpsertLookup = {};
    columnsToUpsert.forEach(function (newColumn) {
        var field = newColumn.field;
        columnsToUpsertLookup[field] = true;
        columnsToKeep[field] = true;
        var existingState = columnsState.lookup[field];
        if (existingState == null) {
            existingState = __assign(__assign({}, getDefaultColTypeDef(newColumn.type)), { field: field, hasBeenResized: false });
            columnsState.orderedFields.push(field);
        }
        else if (keepOnlyColumnsToUpsert) {
            columnsState.orderedFields.push(field);
        }
        // If the column type has changed - merge the existing state with the default column type definition
        if (existingState && existingState.type !== newColumn.type) {
            existingState = __assign(__assign({}, getDefaultColTypeDef(newColumn.type)), { field: field });
        }
        var hasBeenResized = existingState.hasBeenResized;
        exports.COLUMNS_DIMENSION_PROPERTIES.forEach(function (key) {
            if (newColumn[key] !== undefined) {
                hasBeenResized = true;
                if (newColumn[key] === -1) {
                    newColumn[key] = Infinity;
                }
            }
        });
        columnsState.lookup[field] = (0, resolveProps_1.default)(existingState, __assign(__assign(__assign({}, getDefaultColTypeDef(newColumn.type)), newColumn), { hasBeenResized: hasBeenResized }));
    });
    if (keepOnlyColumnsToUpsert && !isInsideStateInitializer) {
        Object.keys(columnsState.lookup).forEach(function (field) {
            if (!columnsToKeep[field]) {
                delete columnsState.lookup[field];
            }
        });
    }
    var columnsStateWithPreProcessing = apiRef.current.unstable_applyPipeProcessors('hydrateColumns', columnsState);
    var columnsStateWithPortableColumns = (0, exports.applyInitialState)(columnsStateWithPreProcessing, initialState);
    return (0, exports.hydrateColumnsWidth)(columnsStateWithPortableColumns, (_d = (_c = (_b = apiRef.current).getRootDimensions) === null || _c === void 0 ? void 0 : _c.call(_b)) !== null && _d !== void 0 ? _d : undefined);
};
exports.createColumnsState = createColumnsState;
function getFirstNonSpannedColumnToRender(_a) {
    var firstColumnToRender = _a.firstColumnToRender, apiRef = _a.apiRef, firstRowToRender = _a.firstRowToRender, lastRowToRender = _a.lastRowToRender, visibleRows = _a.visibleRows;
    var firstNonSpannedColumnToRender = firstColumnToRender;
    var foundStableColumn = false;
    // Keep checking columns until we find one that's not spanned in any visible row
    while (!foundStableColumn && firstNonSpannedColumnToRender >= 0) {
        foundStableColumn = true;
        for (var i = firstRowToRender; i < lastRowToRender; i += 1) {
            var row = visibleRows[i];
            if (row) {
                var rowId = visibleRows[i].id;
                var cellColSpanInfo = apiRef.current.unstable_getCellColSpanInfo(rowId, firstNonSpannedColumnToRender);
                if (cellColSpanInfo &&
                    cellColSpanInfo.spannedByColSpan &&
                    cellColSpanInfo.leftVisibleCellIndex < firstNonSpannedColumnToRender) {
                    firstNonSpannedColumnToRender = cellColSpanInfo.leftVisibleCellIndex;
                    foundStableColumn = false;
                    break; // Check the new column index against the visible rows, because it might be spanned
                }
            }
        }
    }
    return firstNonSpannedColumnToRender;
}
function getTotalHeaderHeight(apiRef, props) {
    var _a, _b;
    if (props.listView) {
        return 0;
    }
    var densityFactor = (0, densitySelector_1.gridDensityFactorSelector)(apiRef);
    var maxDepth = (0, gridColumnGroupsSelector_1.gridColumnGroupsHeaderMaxDepthSelector)(apiRef);
    var isHeaderFilteringEnabled = (0, gridHeaderFilteringSelectors_1.gridHeaderFilteringEnabledSelector)(apiRef);
    var columnHeadersHeight = Math.floor(props.columnHeaderHeight * densityFactor);
    var columnGroupHeadersHeight = Math.floor(((_a = props.columnGroupHeaderHeight) !== null && _a !== void 0 ? _a : props.columnHeaderHeight) * densityFactor);
    var filterHeadersHeight = isHeaderFilteringEnabled
        ? Math.floor(((_b = props.headerFilterHeight) !== null && _b !== void 0 ? _b : props.columnHeaderHeight) * densityFactor)
        : 0;
    return columnHeadersHeight + columnGroupHeadersHeight * maxDepth + filterHeadersHeight;
}
