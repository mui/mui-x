"use strict";
'use client';
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
exports.useMockServer = exports.BASE_URL = void 0;
var React = require("react");
var lru_cache_1 = require("lru-cache");
var x_data_grid_premium_1 = require("@mui/x-data-grid-premium");
var useDemoData_1 = require("./useDemoData");
var commodities_columns_1 = require("../columns/commodities.columns");
var employees_columns_1 = require("../columns/employees.columns");
var real_data_service_1 = require("../services/real-data-service");
var tree_data_generator_1 = require("../services/tree-data-generator");
var serverUtils_1 = require("./serverUtils");
var services_1 = require("../services");
var useMovieData_1 = require("./useMovieData");
var dataCache = new lru_cache_1.LRUCache({
    max: 10,
    ttl: 60 * 5 * 1e3, // 5 minutes
});
exports.BASE_URL = 'https://mui.com/x/api/data-grid';
var GET_DEFAULT_DATASET_OPTIONS = function (isRowGrouping) { return ({
    dataSet: isRowGrouping ? 'Movies' : 'Commodity',
    rowLength: isRowGrouping ? (0, useMovieData_1.getMovieRows)().length : 100,
    maxColumns: 6,
}); };
var getColumnsFromOptions = function (options) {
    var columns;
    switch (options.dataSet) {
        case 'Commodity':
            columns = (0, commodities_columns_1.getCommodityColumns)(options.editable);
            break;
        case 'Employee':
            columns = (0, employees_columns_1.getEmployeeColumns)();
            break;
        case 'Movies':
            columns = (0, useMovieData_1.getMovieColumns)();
            break;
        default:
            throw new Error('Unknown dataset');
    }
    if (options.visibleFields) {
        columns = columns.map(function (col) { var _a; return (__assign(__assign({}, col), { hide: !((_a = options.visibleFields) === null || _a === void 0 ? void 0 : _a.includes(col.field)) })); });
    }
    if (options.maxColumns) {
        columns = columns.slice(0, options.maxColumns);
    }
    return columns;
};
function decodeParams(url) {
    var params = new URL(url).searchParams;
    var decodedParams = {};
    var array = Array.from(params.entries());
    for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
        var _a = array_1[_i], key = _a[0], value = _a[1];
        try {
            decodedParams[key] = JSON.parse(value);
        }
        catch (_b) {
            decodedParams[key] = value;
        }
    }
    return decodedParams;
}
var getInitialState = function (columns, groupingField) {
    var columnVisibilityModel = {};
    columns.forEach(function (col) {
        if (col.hide) {
            columnVisibilityModel[col.field] = false;
        }
    });
    if (groupingField) {
        columnVisibilityModel[groupingField] = false;
    }
    return { columns: { columnVisibilityModel: columnVisibilityModel } };
};
var defaultColDef = (0, x_data_grid_premium_1.getGridDefaultColumnTypes)();
function sendEmptyResponse() {
    return new Promise(function (resolve) {
        resolve({ rows: [], rowCount: 0 });
    });
}
var useMockServer = function (dataSetOptions, serverOptions, shouldRequestsFail, nestedPagination) {
    var _a, _b, _c, _d, _e, _f, _g;
    var dataRef = React.useRef(null);
    var _h = React.useState(false), isDataReady = _h[0], setDataReady = _h[1];
    var _j = React.useState(0), index = _j[0], setIndex = _j[1];
    var shouldRequestsFailRef = React.useRef(shouldRequestsFail !== null && shouldRequestsFail !== void 0 ? shouldRequestsFail : false);
    React.useEffect(function () {
        if (shouldRequestsFail !== undefined) {
            shouldRequestsFailRef.current = shouldRequestsFail;
        }
    }, [shouldRequestsFail]);
    var isRowGrouping = (_a = dataSetOptions === null || dataSetOptions === void 0 ? void 0 : dataSetOptions.rowGrouping) !== null && _a !== void 0 ? _a : false;
    var options = __assign(__assign({}, GET_DEFAULT_DATASET_OPTIONS(isRowGrouping)), dataSetOptions);
    var isTreeData = ((_b = options.treeData) === null || _b === void 0 ? void 0 : _b.groupingField) != null;
    var columns = React.useMemo(function () {
        return getColumnsFromOptions({
            dataSet: options.dataSet,
            editable: options.editable,
            maxColumns: options.maxColumns,
            visibleFields: options.visibleFields,
        });
    }, [options.dataSet, options.editable, options.maxColumns, options.visibleFields]);
    var initialState = React.useMemo(function () { var _a; return getInitialState(columns, (_a = options.treeData) === null || _a === void 0 ? void 0 : _a.groupingField); }, [columns, (_c = options.treeData) === null || _c === void 0 ? void 0 : _c.groupingField]);
    var columnsWithDefaultColDef = React.useMemo(function () {
        return columns.map(function (column) { return (__assign(__assign({}, defaultColDef[column.type || 'string']), column)); });
    }, [columns]);
    var getGroupKey = React.useMemo(function () {
        if (isTreeData) {
            return function (row) { return row[options.treeData.groupingField]; };
        }
        return undefined;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [(_d = options.treeData) === null || _d === void 0 ? void 0 : _d.groupingField, isTreeData]);
    var getChildrenCount = React.useMemo(function () {
        if (isTreeData) {
            return function (row) { return row.descendantCount; };
        }
        return undefined;
    }, [isTreeData]);
    React.useEffect(function () {
        var cacheKey = "".concat(options.dataSet, "-").concat(options.rowLength, "-").concat(index, "-").concat(options.maxColumns);
        // Cache to allow fast switch between the JavaScript and TypeScript version
        // of the demos.
        if (dataCache.has(cacheKey)) {
            var newData = dataCache.get(cacheKey);
            dataRef.current = newData;
            setDataReady(true);
            return undefined;
        }
        if (options.dataSet === 'Movies') {
            var rowsData = { rows: (0, useMovieData_1.getMovieRows)(), columns: columns };
            dataRef.current = rowsData;
            setDataReady(true);
            dataCache.set(cacheKey, rowsData);
            return undefined;
        }
        var active = true;
        (function () { return __awaiter(void 0, void 0, void 0, function () {
            var rowData, rowLength;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        rowLength = options.rowLength;
                        if (!(rowLength > 1000)) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, real_data_service_1.getRealGridData)(1000, columns)];
                    case 1:
                        rowData = _d.sent();
                        return [4 /*yield*/, (0, useDemoData_1.extrapolateSeed)(rowLength, rowData)];
                    case 2:
                        rowData = _d.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, (0, real_data_service_1.getRealGridData)(rowLength, columns)];
                    case 4:
                        rowData = _d.sent();
                        _d.label = 5;
                    case 5:
                        if (!active) {
                            return [2 /*return*/];
                        }
                        if (isTreeData) {
                            rowData = (0, tree_data_generator_1.addTreeDataOptionsToDemoData)(rowData, {
                                maxDepth: (_a = options.treeData) === null || _a === void 0 ? void 0 : _a.maxDepth,
                                groupingField: (_b = options.treeData) === null || _b === void 0 ? void 0 : _b.groupingField,
                                averageChildren: (_c = options.treeData) === null || _c === void 0 ? void 0 : _c.averageChildren,
                            });
                        }
                        if (process.env.NODE_ENV !== 'production') {
                            (0, useDemoData_1.deepFreeze)(rowData);
                        }
                        dataCache.set(cacheKey, rowData);
                        dataRef.current = rowData;
                        setDataReady(true);
                        return [2 /*return*/];
                }
            });
        }); })();
        return function () {
            active = false;
        };
    }, [
        columns,
        isTreeData,
        options.rowLength,
        (_e = options.treeData) === null || _e === void 0 ? void 0 : _e.maxDepth,
        (_f = options.treeData) === null || _f === void 0 ? void 0 : _f.groupingField,
        (_g = options.treeData) === null || _g === void 0 ? void 0 : _g.averageChildren,
        options.dataSet,
        options.maxColumns,
        index,
    ]);
    var fetchRows = React.useCallback(function (requestUrl) { return __awaiter(void 0, void 0, void 0, function () {
        var params, verbose, print, getRowsResponse, serverOptionsWithDefault, minDelay, maxDelay, delay_1, _a, rows, rootRowCount, aggregateRow, _b, rows, rootRowCount, aggregateRow, _c, returnedRows, nextCursor, totalRowCount, aggregateRow;
        var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0:
                    if (!requestUrl || !isDataReady) {
                        return [2 /*return*/, sendEmptyResponse()];
                    }
                    params = decodeParams(requestUrl);
                    verbose = (_d = serverOptions === null || serverOptions === void 0 ? void 0 : serverOptions.verbose) !== null && _d !== void 0 ? _d : true;
                    print = console.info;
                    if (verbose) {
                        print('MUI X: DATASOURCE REQUEST', params);
                    }
                    serverOptionsWithDefault = {
                        minDelay: (_e = serverOptions === null || serverOptions === void 0 ? void 0 : serverOptions.minDelay) !== null && _e !== void 0 ? _e : serverUtils_1.DEFAULT_SERVER_OPTIONS.minDelay,
                        maxDelay: (_f = serverOptions === null || serverOptions === void 0 ? void 0 : serverOptions.maxDelay) !== null && _f !== void 0 ? _f : serverUtils_1.DEFAULT_SERVER_OPTIONS.maxDelay,
                        useCursorPagination: (_g = serverOptions === null || serverOptions === void 0 ? void 0 : serverOptions.useCursorPagination) !== null && _g !== void 0 ? _g : serverUtils_1.DEFAULT_SERVER_OPTIONS.useCursorPagination,
                    };
                    if (shouldRequestsFailRef.current) {
                        minDelay = serverOptionsWithDefault.minDelay, maxDelay = serverOptionsWithDefault.maxDelay;
                        delay_1 = (0, services_1.randomInt)(minDelay, maxDelay);
                        return [2 /*return*/, new Promise(function (_, reject) {
                                if (verbose) {
                                    print('MUI X: DATASOURCE REQUEST FAILURE', params);
                                }
                                setTimeout(function () { return reject(new Error('Could not fetch the data')); }, delay_1);
                            })];
                    }
                    if (!isTreeData) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, serverUtils_1.processTreeDataRows)((_j = (_h = dataRef.current) === null || _h === void 0 ? void 0 : _h.rows) !== null && _j !== void 0 ? _j : [], params, serverOptionsWithDefault, columnsWithDefaultColDef, nestedPagination !== null && nestedPagination !== void 0 ? nestedPagination : false)];
                case 1:
                    _a = _p.sent(), rows = _a.rows, rootRowCount = _a.rootRowCount, aggregateRow = _a.aggregateRow;
                    getRowsResponse = __assign({ rows: rows.slice().map(function (row) { return (__assign(__assign({}, row), { path: undefined })); }), rowCount: rootRowCount }, (aggregateRow ? { aggregateRow: aggregateRow } : {}));
                    return [3 /*break*/, 6];
                case 2:
                    if (!isRowGrouping) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, serverUtils_1.processRowGroupingRows)((_l = (_k = dataRef.current) === null || _k === void 0 ? void 0 : _k.rows) !== null && _l !== void 0 ? _l : [], params, serverOptionsWithDefault, columnsWithDefaultColDef)];
                case 3:
                    _b = _p.sent(), rows = _b.rows, rootRowCount = _b.rootRowCount, aggregateRow = _b.aggregateRow;
                    getRowsResponse = __assign({ rows: rows.slice().map(function (row) { return (__assign(__assign({}, row), { path: undefined })); }), rowCount: rootRowCount }, (aggregateRow ? { aggregateRow: aggregateRow } : {}));
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, (0, serverUtils_1.loadServerRows)((_o = (_m = dataRef.current) === null || _m === void 0 ? void 0 : _m.rows) !== null && _o !== void 0 ? _o : [], __assign(__assign({}, params), params.paginationModel), serverOptionsWithDefault, columnsWithDefaultColDef)];
                case 5:
                    _c = _p.sent(), returnedRows = _c.returnedRows, nextCursor = _c.nextCursor, totalRowCount = _c.totalRowCount, aggregateRow = _c.aggregateRow;
                    getRowsResponse = __assign({ rows: returnedRows, rowCount: totalRowCount, pageInfo: { nextCursor: nextCursor } }, (aggregateRow ? { aggregateRow: aggregateRow } : {}));
                    _p.label = 6;
                case 6: return [2 /*return*/, new Promise(function (resolve) {
                        if (verbose) {
                            print('MUI X: DATASOURCE RESPONSE', params, getRowsResponse);
                        }
                        resolve(getRowsResponse);
                    })];
            }
        });
    }); }, [
        dataRef,
        isDataReady,
        serverOptions === null || serverOptions === void 0 ? void 0 : serverOptions.verbose,
        serverOptions === null || serverOptions === void 0 ? void 0 : serverOptions.minDelay,
        serverOptions === null || serverOptions === void 0 ? void 0 : serverOptions.maxDelay,
        serverOptions === null || serverOptions === void 0 ? void 0 : serverOptions.useCursorPagination,
        isTreeData,
        columnsWithDefaultColDef,
        nestedPagination,
        isRowGrouping,
    ]);
    var editRow = React.useCallback(function (rowId, updatedRow) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var _a, _b, _c, _d, _e;
                    var minDelay = (_a = serverOptions === null || serverOptions === void 0 ? void 0 : serverOptions.minDelay) !== null && _a !== void 0 ? _a : serverUtils_1.DEFAULT_SERVER_OPTIONS.minDelay;
                    var maxDelay = (_b = serverOptions === null || serverOptions === void 0 ? void 0 : serverOptions.maxDelay) !== null && _b !== void 0 ? _b : serverUtils_1.DEFAULT_SERVER_OPTIONS.maxDelay;
                    var delay = (0, services_1.randomInt)(minDelay, maxDelay);
                    var verbose = (_c = serverOptions === null || serverOptions === void 0 ? void 0 : serverOptions.verbose) !== null && _c !== void 0 ? _c : true;
                    // eslint-disable-next-line no-console
                    var print = console.info;
                    if (verbose) {
                        print('MUI X: DATASOURCE EDIT ROW REQUEST', { rowId: rowId, updatedRow: updatedRow });
                    }
                    if (shouldRequestsFailRef.current) {
                        setTimeout(function () { return reject(new Error("Could not update the row with the id ".concat(rowId))); }, delay);
                        if (verbose) {
                            print('MUI X: DATASOURCE EDIT ROW FAILURE', { rowId: rowId, updatedRow: updatedRow });
                        }
                        return;
                    }
                    var newRows = __spreadArray([], (((_d = dataRef.current) === null || _d === void 0 ? void 0 : _d.rows) || []), true);
                    var rowIndex = (_e = newRows.findIndex(function (row) { return row.id === rowId; })) !== null && _e !== void 0 ? _e : -1;
                    if (rowIndex === -1) {
                        return;
                    }
                    newRows[rowIndex] = updatedRow;
                    var newData = __assign(__assign({}, dataRef.current), { rows: newRows });
                    var cacheKey = "".concat(options.dataSet, "-").concat(options.rowLength, "-").concat(index, "-").concat(options.maxColumns);
                    dataCache.set(cacheKey, newData);
                    setTimeout(function () {
                        if (verbose) {
                            print('MUI X: DATASOURCE EDIT ROW SUCCESS', { rowId: rowId, updatedRow: updatedRow });
                        }
                        resolve(updatedRow);
                    }, delay);
                    dataRef.current = newData;
                })];
        });
    }); }, [
        index,
        options.dataSet,
        options.maxColumns,
        options.rowLength,
        serverOptions === null || serverOptions === void 0 ? void 0 : serverOptions.maxDelay,
        serverOptions === null || serverOptions === void 0 ? void 0 : serverOptions.minDelay,
        serverOptions === null || serverOptions === void 0 ? void 0 : serverOptions.verbose,
    ]);
    return {
        columns: columnsWithDefaultColDef,
        initialState: options.dataSet === 'Movies' ? {} : initialState,
        getGroupKey: getGroupKey,
        getChildrenCount: getChildrenCount,
        fetchRows: fetchRows,
        editRow: editRow,
        loadNewData: function () {
            setIndex(function (oldIndex) { return oldIndex + 1; });
        },
        isReady: isDataReady,
    };
};
exports.useMockServer = useMockServer;
