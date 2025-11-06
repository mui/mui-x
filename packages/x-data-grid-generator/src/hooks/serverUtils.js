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
exports.processPivotingRows = exports.processRowGroupingRows = exports.processTreeDataRows = exports.loadServerRows = exports.DEFAULT_SERVER_OPTIONS = exports.disableDelay = void 0;
var x_data_grid_premium_1 = require("@mui/x-data-grid-premium");
var random_generator_1 = require("../services/random-generator");
var getAvailableAggregationFunctions = function (columnType) {
    var availableAggregationFunctions = new Map();
    Object.keys(x_data_grid_premium_1.GRID_AGGREGATION_FUNCTIONS).forEach(function (functionName) {
        var columnTypes = x_data_grid_premium_1.GRID_AGGREGATION_FUNCTIONS[functionName]
            .columnTypes;
        if (!columnTypes || columnTypes.includes(columnType !== null && columnType !== void 0 ? columnType : 'string')) {
            availableAggregationFunctions.set(functionName, x_data_grid_premium_1.GRID_AGGREGATION_FUNCTIONS[functionName]);
        }
    });
    return availableAggregationFunctions;
};
exports.disableDelay = typeof DISABLE_CHANCE_RANDOM !== 'undefined' && DISABLE_CHANCE_RANDOM;
exports.DEFAULT_SERVER_OPTIONS = {
    minDelay: exports.disableDelay ? 0 : 100,
    maxDelay: exports.disableDelay ? 0 : 300,
    useCursorPagination: true,
};
var apiRef = {};
var simplifiedValueGetter = function (field, colDef) { return function (row) {
    var _a;
    return ((_a = colDef.valueGetter) === null || _a === void 0 ? void 0 : _a.call(colDef, row[row.id], row, colDef, apiRef)) || row[field];
}; };
var getRowComparator = function (sortModel, aggregationModel, columnsWithDefaultColDef) {
    if (!sortModel) {
        var comparator_1 = function () { return 0; };
        return comparator_1;
    }
    var sortOperators = sortModel.map(function (sortItem) {
        var columnField = sortItem.field;
        var colDef = columnsWithDefaultColDef.find(function (_a) {
            var field = _a.field;
            return field === sortItem.field;
        });
        return __assign(__assign({}, sortItem), { valueGetter: simplifiedValueGetter(columnField, colDef), sortComparator: colDef.sortComparator });
    });
    var comparator = function (row1, row2) {
        return sortOperators.reduce(function (acc, _a) {
            var valueGetter = _a.valueGetter, sort = _a.sort, sortComparator = _a.sortComparator;
            if (acc !== 0) {
                return acc;
            }
            var v1 = valueGetter(row1);
            var v2 = valueGetter(row2);
            return sort === 'desc' ? -1 * sortComparator(v1, v2) : sortComparator(v1, v2);
        }, 0);
    };
    return comparator;
};
var buildQuickFilterApplier = function (filterModel, columns) {
    var _a, _b;
    var quickFilterValues = (_b = (_a = filterModel.quickFilterValues) === null || _a === void 0 ? void 0 : _a.filter(Boolean)) !== null && _b !== void 0 ? _b : [];
    if (quickFilterValues.length === 0) {
        return null;
    }
    var appliersPerField = [];
    var stubApiRef = {
        current: {
            getRowFormattedValue: function (row, c) {
                var field = c.field;
                return row[field];
            },
        },
    };
    columns.forEach(function (column) {
        var getApplyQuickFilterFn = column === null || column === void 0 ? void 0 : column.getApplyQuickFilterFn;
        if (getApplyQuickFilterFn) {
            appliersPerField.push({
                column: column,
                appliers: quickFilterValues.map(function (quickFilterValue) {
                    return {
                        fn: getApplyQuickFilterFn(quickFilterValue, column, stubApiRef),
                    };
                }),
            });
        }
    });
    return function isRowMatchingQuickFilter(row, shouldApplyFilter) {
        var result = {};
        /* eslint-disable no-labels */
        outer: for (var v = 0; v < quickFilterValues.length; v += 1) {
            var filterValue = quickFilterValues[v];
            for (var i = 0; i < appliersPerField.length; i += 1) {
                var _a = appliersPerField[i], column = _a.column, appliers = _a.appliers;
                var field = column.field;
                if (shouldApplyFilter && !shouldApplyFilter(field)) {
                    continue;
                }
                var applier = appliers[v];
                var value = row[field];
                if (applier.fn === null) {
                    continue;
                }
                var isMatching = applier.fn(value, row, column, stubApiRef);
                if (isMatching) {
                    result[filterValue] = true;
                    continue outer;
                }
            }
            result[filterValue] = false;
        }
        /* eslint-enable no-labels */
        return result;
    };
};
var getQuicklyFilteredRows = function (rows, filterModel, columnsWithDefaultColDef) {
    var _a;
    if (filterModel === undefined || ((_a = filterModel.quickFilterValues) === null || _a === void 0 ? void 0 : _a.length) === 0) {
        return rows;
    }
    var isRowMatchingQuickFilter = buildQuickFilterApplier(filterModel, columnsWithDefaultColDef);
    if (isRowMatchingQuickFilter) {
        return rows.filter(function (row) {
            var result = isRowMatchingQuickFilter(row);
            return filterModel.quickFilterLogicOperator === x_data_grid_premium_1.GridLogicOperator.And
                ? Object.values(result).every(Boolean)
                : Object.values(result).some(Boolean);
        });
    }
    return rows;
};
var getFilteredRows = function (rows, filterModel, columnsWithDefaultColDef) {
    if (filterModel === undefined || filterModel.items.length === 0) {
        return rows;
    }
    var valueGetters = filterModel.items.map(function (_a) {
        var field = _a.field;
        return simplifiedValueGetter(field, columnsWithDefaultColDef.find(function (column) { return column.field === field; }));
    });
    var filterFunctions = filterModel.items.map(function (filterItem) {
        var _a;
        var field = filterItem.field, operator = filterItem.operator;
        var colDef = columnsWithDefaultColDef.find(function (column) { return column.field === field; });
        if (!colDef.filterOperators) {
            throw new Error("MUI: No filter operator found for column '".concat(field, "'."));
        }
        var filterOperator = colDef.filterOperators.find(function (_a) {
            var value = _a.value;
            return operator === value;
        });
        var parsedValue = filterItem.value;
        if (colDef.valueParser) {
            var parser_1 = colDef.valueParser;
            parsedValue = Array.isArray(filterItem.value)
                ? (_a = filterItem.value) === null || _a === void 0 ? void 0 : _a.map(function (x) { return parser_1(x, {}, colDef, apiRef); })
                : parser_1(filterItem.value, {}, colDef, apiRef);
        }
        return filterOperator.getApplyFilterFn({ filterItem: filterItem, value: parsedValue }, colDef);
    });
    if (filterModel.logicOperator === x_data_grid_premium_1.GridLogicOperator.Or) {
        return rows.filter(function (row) {
            return filterModel.items.some(function (_, index) {
                var value = valueGetters[index](row);
                return filterFunctions[index] === null ? true : filterFunctions[index](value);
            });
        });
    }
    return rows.filter(function (row) {
        return filterModel.items.every(function (_, index) {
            var value = valueGetters[index](row);
            return filterFunctions[index] === null ? true : filterFunctions[index](value);
        });
    });
};
var applyAggregation = function (aggregationModel, colDefs, rows, groupId) {
    if (groupId === void 0) { groupId = 'root'; }
    var columnsToAggregate = Object.keys(aggregationModel);
    if (columnsToAggregate.length === 0) {
        return {};
    }
    var aggregateValues = {};
    columnsToAggregate.forEach(function (field) {
        var _a;
        var type = (_a = colDefs.find(function (_a) {
            var f = _a.field;
            return f === field;
        })) === null || _a === void 0 ? void 0 : _a.type;
        if (!type) {
            return;
        }
        var availableAggregationFunctions = getAvailableAggregationFunctions(type);
        if (!availableAggregationFunctions.has(aggregationModel[field])) {
            return;
        }
        var aggregationFunction = availableAggregationFunctions.get(aggregationModel[field]);
        if (!aggregationFunction) {
            return;
        }
        var values = rows.map(function (row) { return row[field]; });
        aggregateValues[field] = aggregationFunction.apply({
            values: values,
            field: field,
            groupId: groupId,
        });
    });
    return aggregateValues;
};
var generateParentRows = function (pathsToAutogenerate) {
    return Array.from(pathsToAutogenerate).map(function (path) {
        var pathArray = path.split(',');
        return {
            id: "auto-generated-parent-".concat(pathArray.join('-')),
            path: pathArray.slice(0, pathArray.length),
            group: pathArray.slice(-1)[0],
        };
    });
};
/**
 * Computes pivot aggregations for given pivot column keys
 */
var computePivotAggregations = function (pivotColumnKeys, rows, visibleValues, columnTypeMap, groupId, columnGroupIdSeparator) {
    if (groupId === void 0) { groupId = 'root'; }
    if (columnGroupIdSeparator === void 0) { columnGroupIdSeparator = '>->'; }
    var pivotAggregations = {};
    pivotColumnKeys.forEach(function (pivotColumnKey) {
        var values = rows.map(function (row) { return row[pivotColumnKey]; }).filter(function (v) { return v !== undefined; });
        if (values.length > 0) {
            // Find the corresponding pivot value configuration
            var pivotValueConfig = visibleValues.find(function (v) {
                if (visibleValues.length === 0 || !visibleValues[0].field) {
                    return v.field === pivotColumnKey;
                }
                // For pivot columns with column grouping, extract the value field from the column name
                var columnParts = pivotColumnKey.split(columnGroupIdSeparator);
                return columnParts[columnParts.length - 1] === v.field;
            });
            if (pivotValueConfig) {
                var availableAggregationFunctions = getAvailableAggregationFunctions(columnTypeMap.get(pivotValueConfig.field));
                var aggregationFunction = availableAggregationFunctions.get(pivotValueConfig.aggFunc);
                if (aggregationFunction) {
                    pivotAggregations[pivotColumnKey] = aggregationFunction.apply({
                        values: values,
                        field: pivotValueConfig.field,
                        groupId: groupId,
                    });
                }
            }
        }
    });
    return pivotAggregations;
};
/**
 * Simulates server data loading
 */
var loadServerRows = function (rows, queryOptions, serverOptions, columnsWithDefaultColDef) {
    var _a;
    var _b = serverOptions.minDelay, minDelay = _b === void 0 ? 100 : _b, _c = serverOptions.maxDelay, maxDelay = _c === void 0 ? 300 : _c, useCursorPagination = serverOptions.useCursorPagination;
    if (maxDelay < minDelay) {
        throw new Error('serverOptions.minDelay is larger than serverOptions.maxDelay ');
    }
    var delay = (0, random_generator_1.randomInt)(minDelay, maxDelay);
    var cursor = queryOptions.cursor, _d = queryOptions.page, page = _d === void 0 ? 0 : _d, pageSize = queryOptions.pageSize, start = queryOptions.start, end = queryOptions.end;
    var nextCursor;
    var firstRowIndex;
    var lastRowIndex;
    var filteredRows = getFilteredRows(rows, queryOptions.filterModel, columnsWithDefaultColDef);
    var rowComparator = getRowComparator(queryOptions.sortModel, queryOptions.aggregationModel, columnsWithDefaultColDef);
    filteredRows = __spreadArray([], filteredRows, true).sort(rowComparator);
    var aggregateRow = {};
    if (queryOptions.aggregationModel) {
        aggregateRow = applyAggregation(queryOptions.aggregationModel, columnsWithDefaultColDef, filteredRows);
    }
    var totalRowCount = filteredRows.length;
    if (start !== undefined && end !== undefined) {
        firstRowIndex = start;
        lastRowIndex = end;
    }
    else if (!pageSize) {
        firstRowIndex = 0;
        lastRowIndex = filteredRows.length - 1;
    }
    else if (useCursorPagination) {
        firstRowIndex = cursor ? filteredRows.findIndex(function (_a) {
            var id = _a.id;
            return id === cursor;
        }) : 0;
        firstRowIndex = Math.max(firstRowIndex, 0); // if cursor not found return 0
        lastRowIndex = firstRowIndex + pageSize - 1;
        nextCursor = (_a = filteredRows[lastRowIndex + 1]) === null || _a === void 0 ? void 0 : _a.id;
    }
    else {
        firstRowIndex = page * pageSize;
        lastRowIndex = (page + 1) * pageSize - 1;
    }
    var hasNextPage = lastRowIndex < filteredRows.length - 1;
    var response = __assign({ returnedRows: filteredRows.slice(firstRowIndex, lastRowIndex + 1), hasNextPage: hasNextPage, nextCursor: nextCursor, totalRowCount: totalRowCount }, (queryOptions.aggregationModel ? { aggregateRow: aggregateRow } : {}));
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(response);
        }, delay); // simulate network latency
    });
};
exports.loadServerRows = loadServerRows;
var findTreeDataRowChildren = function (allRows, parentPath, pathKey, depth, // the depth of the children to find relative to parentDepth, `-1` to find all
rowQualifier) {
    if (pathKey === void 0) { pathKey = 'path'; }
    if (depth === void 0) { depth = 1; }
    var parentDepth = parentPath.length;
    var children = [];
    var _loop_1 = function (i) {
        var row = allRows[i];
        var rowPath = row[pathKey];
        if (!rowPath) {
            return "continue";
        }
        if (((depth < 0 && rowPath.length > parentDepth) || rowPath.length === parentDepth + depth) &&
            parentPath.every(function (value, index) { return value === rowPath[index]; })) {
            if (!rowQualifier || rowQualifier(row)) {
                children.push(row);
            }
        }
    };
    for (var i = 0; i < allRows.length; i += 1) {
        _loop_1(i);
    }
    return children;
};
var getTreeDataFilteredRows = function (rows, filterModel, columnsWithDefaultColDef) {
    var _a;
    var filteredRows = __spreadArray([], rows, true);
    if ((filterModel === null || filterModel === void 0 ? void 0 : filterModel.quickFilterValues) && filterModel.quickFilterValues.length > 0) {
        filteredRows = getQuicklyFilteredRows(rows, filterModel, columnsWithDefaultColDef);
    }
    if (((_a = filterModel === null || filterModel === void 0 ? void 0 : filterModel.items.length) !== null && _a !== void 0 ? _a : 0) > 0) {
        filteredRows = getFilteredRows(filteredRows, filterModel, columnsWithDefaultColDef);
    }
    if (filteredRows.length === rows.length || filteredRows.length === 0) {
        return filteredRows;
    }
    var pathsToIndexesMap = new Map();
    rows.forEach(function (row, index) {
        pathsToIndexesMap.set(row.path.join(','), index);
    });
    var includedPaths = new Set();
    filteredRows.forEach(function (row) {
        includedPaths.add(row.path.join(','));
    });
    var missingChildren = [];
    // include missing children of filtered rows
    filteredRows.forEach(function (row) {
        var path = row.path;
        if (path) {
            var children = findTreeDataRowChildren(rows, path, 'path', -1);
            children.forEach(function (child) {
                var subPath = child.path.join(',');
                if (!includedPaths.has(subPath)) {
                    missingChildren.push(child);
                }
            });
        }
    });
    filteredRows = missingChildren.concat(filteredRows);
    var missingParents = [];
    // include missing parents of filtered rows
    filteredRows.forEach(function (row) {
        var path = row.path;
        if (path) {
            includedPaths.add(path.join(','));
            for (var i = 0; i < path.length - 1; i += 1) {
                var subPath = path.slice(0, i + 1).join(',');
                if (!includedPaths.has(subPath)) {
                    var index = pathsToIndexesMap.get(subPath);
                    if (index !== undefined) {
                        missingParents.push(rows[index]);
                        includedPaths.add(subPath);
                    }
                }
            }
        }
    });
    return missingParents.concat(filteredRows);
};
/**
 * Simulates server data for tree-data feature
 */
var processTreeDataRows = function (rows, queryOptions, serverOptions, columnsWithDefaultColDef, nestedPagination) {
    var _a = serverOptions.minDelay, minDelay = _a === void 0 ? 100 : _a, _b = serverOptions.maxDelay, maxDelay = _b === void 0 ? 300 : _b;
    var pathKey = 'path';
    // TODO: Support filtering and cursor based pagination
    if (maxDelay < minDelay) {
        throw new Error('serverOptions.minDelay is larger than serverOptions.maxDelay ');
    }
    if (queryOptions.groupKeys == null) {
        throw new Error('serverOptions.groupKeys must be defined to compute tree data ');
    }
    var delay = (0, random_generator_1.randomInt)(minDelay, maxDelay);
    // apply plain filtering
    var filteredRows = getTreeDataFilteredRows(rows, queryOptions.filterModel, columnsWithDefaultColDef);
    // get root row count
    var rootRowCount = findTreeDataRowChildren(filteredRows, nestedPagination ? queryOptions.groupKeys : []).length;
    // find direct children referring to the `parentPath`
    var childRows = findTreeDataRowChildren(filteredRows, queryOptions.groupKeys);
    var childRowsWithDescendantCounts = childRows.map(function (row) {
        var descendants = findTreeDataRowChildren(filteredRows, row[pathKey], pathKey, -1);
        var descendantCount = descendants.length;
        if (descendantCount > 0 && queryOptions.aggregationModel) {
            // Parent row, compute aggregation
            return __assign(__assign(__assign({}, row), { descendantCount: descendantCount }), applyAggregation(queryOptions.aggregationModel, columnsWithDefaultColDef, descendants, row.id));
        }
        return __assign(__assign({}, row), { descendantCount: descendantCount });
    });
    if (queryOptions.sortModel) {
        // apply sorting
        var rowComparator = getRowComparator(queryOptions.sortModel, queryOptions.aggregationModel, columnsWithDefaultColDef);
        childRowsWithDescendantCounts = __spreadArray([], childRowsWithDescendantCounts, true).sort(rowComparator);
    }
    var aggregateRow;
    if (queryOptions.aggregationModel) {
        aggregateRow = applyAggregation(queryOptions.aggregationModel, columnsWithDefaultColDef, filteredRows);
    }
    if (queryOptions.paginationModel && (queryOptions.groupKeys.length === 0 || nestedPagination)) {
        // Only paginate root rows, grid should refetch root rows when `paginationModel` updates
        // Except when nested pagination is enabled, in which case we paginate the children of the current group node
        var _c = queryOptions.paginationModel, pageSize = _c.pageSize, page = _c.page;
        if (pageSize < childRowsWithDescendantCounts.length) {
            childRowsWithDescendantCounts = childRowsWithDescendantCounts.slice(page * pageSize, (page + 1) * pageSize);
        }
    }
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve({ rows: childRowsWithDescendantCounts, rootRowCount: rootRowCount, aggregateRow: aggregateRow });
        }, delay); // simulate network latency
    });
};
exports.processTreeDataRows = processTreeDataRows;
/**
 * Simulates server data for row grouping feature
 */
var processRowGroupingRows = function (rows, queryOptions, serverOptions, columnsWithDefaultColDef) {
    var _a = serverOptions.minDelay, minDelay = _a === void 0 ? 100 : _a, _b = serverOptions.maxDelay, maxDelay = _b === void 0 ? 300 : _b;
    var pathKey = 'path';
    if (maxDelay < minDelay) {
        throw new Error('serverOptions.minDelay is larger than serverOptions.maxDelay ');
    }
    if (queryOptions.groupKeys == null) {
        throw new Error('serverOptions.groupKeys must be defined to compute row grouping data');
    }
    if (queryOptions.groupFields == null) {
        throw new Error('serverOptions.groupFields must be defined to compute row grouping data');
    }
    var delay = (0, random_generator_1.randomInt)(minDelay, maxDelay);
    var pathsToAutogenerate = new Set();
    var rowsWithPaths = rows;
    var rowsWithMissingGroups = [];
    // add paths and generate parent rows based on `groupFields`
    var groupFields = queryOptions.groupFields;
    if (groupFields.length > 0) {
        rowsWithPaths = rows.reduce(function (acc, row) {
            var partialPath = groupFields.map(function (field) {
                var colDef = columnsWithDefaultColDef.find(function (_a) {
                    var f = _a.field;
                    return f === field;
                });
                if (colDef === null || colDef === void 0 ? void 0 : colDef.groupingValueGetter) {
                    return String(colDef.groupingValueGetter(row[field], row, colDef, apiRef));
                }
                if (colDef === null || colDef === void 0 ? void 0 : colDef.valueGetter) {
                    return String(colDef.valueGetter(row[field], row, colDef, apiRef));
                }
                return String(row[field]);
            });
            for (var index = 0; index < partialPath.length; index += 1) {
                var value = partialPath[index];
                if (value === undefined) {
                    if (index === 0) {
                        rowsWithMissingGroups.push(__assign(__assign({}, row), { group: false }));
                    }
                    return acc;
                }
                var parentPath = partialPath.slice(0, index + 1);
                var strigifiedPath = parentPath.join(',');
                if (!pathsToAutogenerate.has(strigifiedPath)) {
                    pathsToAutogenerate.add(strigifiedPath);
                }
            }
            acc.push(__assign(__assign({}, row), { path: __spreadArray(__spreadArray([], partialPath, true), [''], false) }));
            return acc;
        }, []);
    }
    else {
        rowsWithPaths = rows.map(function (row) { return (__assign(__assign({}, row), { path: [''] })); });
    }
    var autogeneratedRows = generateParentRows(pathsToAutogenerate);
    // apply plain filtering
    var filteredRows = getTreeDataFilteredRows(__spreadArray(__spreadArray(__spreadArray([], autogeneratedRows, true), rowsWithPaths, true), rowsWithMissingGroups, true), queryOptions.filterModel, columnsWithDefaultColDef);
    // get root row count
    var rootRows = findTreeDataRowChildren(filteredRows, []);
    var rootRowCount = rootRows.length;
    var filteredRowsWithMissingGroups = [];
    var childRows = rootRows;
    if (queryOptions.groupKeys.length === 0) {
        filteredRowsWithMissingGroups = filteredRows.filter(function (_a) {
            var group = _a.group;
            return group === false;
        });
    }
    else {
        childRows = findTreeDataRowChildren(filteredRows, queryOptions.groupKeys);
    }
    var childRowsWithDescendantCounts = childRows.map(function (row) {
        var descendants = findTreeDataRowChildren(filteredRows, row[pathKey], pathKey, -1, function (_a) {
            var id = _a.id;
            return typeof id !== 'string' || !id.startsWith('auto-generated-parent-');
        });
        var descendantCount = descendants.length;
        if (descendantCount > 0 && queryOptions.aggregationModel) {
            // Parent row, compute aggregation
            return __assign(__assign(__assign({}, row), { descendantCount: descendantCount }), applyAggregation(queryOptions.aggregationModel, columnsWithDefaultColDef, descendants, row.id));
        }
        return __assign(__assign({}, row), { descendantCount: descendantCount });
    });
    if (queryOptions.sortModel) {
        var rowComparator = getRowComparator(queryOptions.sortModel, queryOptions.aggregationModel, columnsWithDefaultColDef);
        var sortedMissingGroups = __spreadArray([], filteredRowsWithMissingGroups, true).sort(rowComparator);
        var sortedChildRows = __spreadArray([], childRowsWithDescendantCounts, true).sort(rowComparator);
        childRowsWithDescendantCounts = __spreadArray(__spreadArray([], sortedMissingGroups, true), sortedChildRows, true);
    }
    var aggregateRow;
    if (queryOptions.aggregationModel) {
        aggregateRow = applyAggregation(queryOptions.aggregationModel, columnsWithDefaultColDef, filteredRows);
    }
    if (queryOptions.paginationModel && queryOptions.groupKeys.length === 0) {
        // Only paginate root rows, grid should refetch root rows when `paginationModel` updates
        var _c = queryOptions.paginationModel, pageSize = _c.pageSize, page = _c.page;
        if (pageSize < childRowsWithDescendantCounts.length) {
            childRowsWithDescendantCounts = childRowsWithDescendantCounts.slice(page * pageSize, (page + 1) * pageSize);
        }
    }
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve({ rows: childRowsWithDescendantCounts, rootRowCount: rootRowCount, aggregateRow: aggregateRow });
        }, delay); // simulate network latency
    });
};
exports.processRowGroupingRows = processRowGroupingRows;
/**
 * Simulates server data for pivoting feature
 */
var processPivotingRows = function (rows, queryOptions, serverOptions, columnsWithDefaultColDef) {
    var _a, _b;
    var _c = serverOptions.minDelay, minDelay = _c === void 0 ? 100 : _c, _d = serverOptions.maxDelay, maxDelay = _d === void 0 ? 300 : _d;
    if (maxDelay < minDelay) {
        throw new Error('serverOptions.minDelay is larger than serverOptions.maxDelay ');
    }
    if (!queryOptions.pivotModel) {
        throw new Error('queryOptions.pivotModel must be defined to compute pivoting data');
    }
    var delay = (0, random_generator_1.randomInt)(minDelay, maxDelay);
    var pivotModel = queryOptions.pivotModel;
    var visibleColumns = pivotModel.columns.filter(function (column) { return !column.hidden; });
    var visibleRows = pivotModel.rows.filter(function (row) { return !row.hidden; });
    var visibleValues = pivotModel.values.filter(function (value) { return !value.hidden; });
    // Create column lookup map for O(1) access
    var columnLookup = new Map();
    for (var _i = 0, columnsWithDefaultColDef_1 = columnsWithDefaultColDef; _i < columnsWithDefaultColDef_1.length; _i++) {
        var column = columnsWithDefaultColDef_1[_i];
        columnLookup.set(column.field, column);
    }
    if (visibleRows.length === 0) {
        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve({ rows: [], rootRowCount: 0, pivotColumns: [] });
            }, delay); // simulate network latency
        });
    }
    // Apply filtering if provided
    var filteredRows = rows;
    if (queryOptions.filterModel) {
        filteredRows = getFilteredRows(rows, queryOptions.filterModel, columnsWithDefaultColDef);
    }
    // Create pivot columns based on the pivot model
    var columnGroupIdSeparator = '>->';
    var pivotColumns = [];
    var uniqueColumnGroups = new Map();
    // Generate pivot column names based on pivot model columns
    if (visibleColumns.length > 0 || visibleValues.length > 0) {
        // Create column groups based on unique combinations of row values
        filteredRows = filteredRows.map(function (row) {
            var _a;
            var columnGroupPath = [];
            var updatedRow = __assign({}, row);
            for (var i = 0; i < visibleColumns.length; i += 1) {
                var colGroupField = visibleColumns[i].field;
                var column = columnLookup.get(colGroupField);
                if (!column) {
                    continue;
                }
                if (!column.valueGetter && !column.valueFormatter) {
                    columnGroupPath.push(row[colGroupField]);
                }
                else {
                    columnGroupPath.push((_a = {},
                        _a[colGroupField] = column.valueGetter
                            ? column.valueGetter(row[colGroupField], row, column, apiRef)
                            : row[colGroupField],
                        _a));
                }
            }
            // Create pivot columns for each value field within this column group
            visibleValues.forEach(function (pivotValue) {
                var valueKey = pivotValue.field;
                var column = columnLookup.get(valueKey);
                if (!column) {
                    return;
                }
                if (visibleColumns.length > 0) {
                    var columnGroupPathValue = columnGroupPath.map(function (path, pathIndex) {
                        var value = path[visibleColumns[pathIndex].field];
                        if (value instanceof Date) {
                            return value.toLocaleDateString();
                        }
                        return value;
                    });
                    valueKey = "".concat(columnGroupPathValue.join(columnGroupIdSeparator)).concat(columnGroupIdSeparator).concat(pivotValue.field);
                }
                uniqueColumnGroups.set(valueKey, __spreadArray(__spreadArray([], columnGroupPath, true), [pivotValue.field], false));
                updatedRow[valueKey] = column.valueGetter
                    ? column.valueGetter(row[pivotValue.field], row, column, apiRef)
                    : row[pivotValue.field];
            });
            return updatedRow;
        });
        // Convert uniqueColumnGroups to the pivot column structure
        var columnGroupMap_1 = new Map();
        uniqueColumnGroups.forEach(function (columnGroupPath) {
            var currentLevel = columnGroupMap_1;
            var currentPath = '';
            for (var i = 0; i < columnGroupPath.length - 1; i += 1) {
                var groupValue = columnGroupPath[i];
                var groupKey = typeof groupValue === 'string' ? groupValue : groupValue[visibleColumns[i].field];
                if (groupKey instanceof Date) {
                    groupKey = groupKey.toLocaleDateString();
                }
                var pathKey = currentPath ? "".concat(currentPath, "-").concat(groupKey) : groupKey;
                if (!currentLevel.has(groupKey)) {
                    currentLevel.set(groupKey, {
                        group: groupValue,
                        children: new Map(),
                    });
                }
                var group = currentLevel.get(groupKey);
                currentLevel = group.children;
                currentPath = pathKey;
            }
        });
        var convertMapToArray_1 = function (map) {
            return Array.from(map.entries()).map(function (_a) {
                var key = _a[0], group = _a[1];
                return (__assign({ key: key, group: group.group }, (group.children.size > 0 ? { children: convertMapToArray_1(group.children) } : {})));
            });
        };
        pivotColumns.push.apply(pivotColumns, convertMapToArray_1(columnGroupMap_1));
    }
    var pivotColumnKeys = Array.from(uniqueColumnGroups.keys());
    // Add paths and generate parent rows based on `visibleRows` (pivot row fields)
    var pathsToAutogenerate = new Set();
    var rowsWithPaths = filteredRows;
    var rowsWithMissingGroups = [];
    if (visibleRows.length > 0) {
        rowsWithPaths = filteredRows.reduce(function (acc, row) {
            var partialPath = visibleRows.map(function (pivotRow) {
                var field = pivotRow.field;
                var colDef = columnLookup.get(field);
                if (colDef === null || colDef === void 0 ? void 0 : colDef.groupingValueGetter) {
                    return String(colDef.groupingValueGetter(row[field], row, colDef, apiRef));
                }
                if (colDef === null || colDef === void 0 ? void 0 : colDef.valueGetter) {
                    return String(colDef.valueGetter(row[field], row, colDef, apiRef));
                }
                return String(row[field]);
            });
            for (var index = 0; index < partialPath.length; index += 1) {
                var value = partialPath[index];
                if (value === undefined) {
                    if (index === 0) {
                        rowsWithMissingGroups.push(__assign(__assign({}, row), { group: false }));
                    }
                    return acc;
                }
                var parentPath = partialPath.slice(0, index + 1);
                var stringifiedPath = parentPath.join(',');
                if (!pathsToAutogenerate.has(stringifiedPath)) {
                    pathsToAutogenerate.add(stringifiedPath);
                }
            }
            acc.push(__assign(__assign({}, row), { path: __spreadArray(__spreadArray([], partialPath, true), [''], false) }));
            return acc;
        }, []);
    }
    else {
        rowsWithPaths = filteredRows.map(function (row) { return (__assign(__assign({}, row), { path: [''] })); });
    }
    var autogeneratedRows = generateParentRows(pathsToAutogenerate);
    // Apply tree data filtering to include missing parents and children
    var filteredRowsWithGroups = getTreeDataFilteredRows(__spreadArray(__spreadArray(__spreadArray([], autogeneratedRows, true), rowsWithPaths, true), rowsWithMissingGroups, true), queryOptions.filterModel, columnsWithDefaultColDef);
    // Get root rows
    var rootRows = findTreeDataRowChildren(filteredRowsWithGroups, []);
    var rootRowCount = rootRows.length;
    var filteredRowsWithMissingGroups = [];
    var childRows = rootRows;
    if (((_a = queryOptions.groupKeys) === null || _a === void 0 ? void 0 : _a.length) === 0) {
        filteredRowsWithMissingGroups = filteredRowsWithGroups.filter(function (_a) {
            var group = _a.group;
            return group === false;
        });
    }
    else {
        childRows = findTreeDataRowChildren(filteredRowsWithGroups, queryOptions.groupKeys || []);
    }
    var columnTypeMap = new Map();
    for (var _e = 0, columnsWithDefaultColDef_2 = columnsWithDefaultColDef; _e < columnsWithDefaultColDef_2.length; _e++) {
        var column = columnsWithDefaultColDef_2[_e];
        if (column.type) {
            columnTypeMap.set(column.field, column.type);
        }
    }
    var childRowsWithDescendantCounts = childRows.map(function (row) {
        var descendants = findTreeDataRowChildren(filteredRowsWithGroups, row.path, 'path', -1, function (_a) {
            var id = _a.id;
            return typeof id !== 'string' || !id.startsWith('auto-generated-parent-');
        });
        var descendantCount = descendants.length;
        if (descendantCount > 0) {
            // Parent row, compute aggregation for both regular aggregation model and pivot values
            var regularAggregation = applyAggregation(queryOptions.pivotModel.values.map(function (value) {
                var _a;
                return (_a = {}, _a[value.field] = value.aggFunc, _a);
            }), columnsWithDefaultColDef, descendants, row.id);
            // Compute aggregations for each pivot column
            var pivotAggregations = computePivotAggregations(pivotColumnKeys, descendants, visibleValues, columnTypeMap, row.id, columnGroupIdSeparator);
            return __assign(__assign(__assign(__assign({}, row), { descendantCount: descendantCount }), regularAggregation), pivotAggregations);
        }
        return __assign(__assign({}, row), { descendantCount: descendantCount });
    });
    // Apply sorting if provided
    if (queryOptions.sortModel) {
        var rowComparator = getRowComparator(queryOptions.sortModel, {}, pivotColumnKeys.map(function (key) { return ({
            field: key,
            type: 'number',
            sortComparator: x_data_grid_premium_1.gridStringOrNumberComparator,
        }); }));
        var sortedMissingGroups = __spreadArray([], filteredRowsWithMissingGroups, true).sort(rowComparator);
        var sortedChildRows = __spreadArray([], childRowsWithDescendantCounts, true).sort(rowComparator);
        childRowsWithDescendantCounts = __spreadArray(__spreadArray([], sortedMissingGroups, true), sortedChildRows, true);
    }
    // Apply pagination if provided
    if (queryOptions.paginationModel && ((_b = queryOptions.groupKeys) === null || _b === void 0 ? void 0 : _b.length) === 0) {
        // Only paginate root rows, grid should refetch root rows when `paginationModel` updates
        var _f = queryOptions.paginationModel, pageSize = _f.pageSize, page = _f.page;
        if (pageSize < childRowsWithDescendantCounts.length) {
            childRowsWithDescendantCounts = childRowsWithDescendantCounts.slice(page * pageSize, (page + 1) * pageSize);
        }
    }
    // Compute aggregate row if pivot values are provided
    var aggregateRow;
    if (visibleValues.length > 0) {
        var regularAggregation = applyAggregation(visibleValues.map(function (value) {
            var _a;
            return (_a = {}, _a[value.field] = value.aggFunc, _a);
        }), columnsWithDefaultColDef, filteredRowsWithGroups);
        // Compute aggregations for each pivot column for the entire dataset
        var pivotAggregations = computePivotAggregations(pivotColumnKeys, filteredRowsWithGroups.filter(function (row) { return typeof row.id !== 'string' || !row.id.startsWith('auto-generated-parent-'); }), visibleValues, columnTypeMap, 'root', columnGroupIdSeparator);
        aggregateRow = __assign(__assign({}, regularAggregation), pivotAggregations);
    }
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve({ rows: childRowsWithDescendantCounts, rootRowCount: rootRowCount, pivotColumns: pivotColumns, aggregateRow: aggregateRow });
        }, delay); // simulate network latency
    });
};
exports.processPivotingRows = processPivotingRows;
