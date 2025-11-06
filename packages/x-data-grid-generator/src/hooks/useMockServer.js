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
var GET_DEFAULT_DATASET_OPTIONS = {
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
};
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
    if (options.derivedColumns) {
        columns = columns.reduce(function (acc, col) {
            acc.push(col);
            if (col.type === 'date' || col.type === 'dateTime') {
                acc.push({
                    type: 'date',
                    field: "".concat(col.field, "-year"),
                    generateData: function (row) { return new Date(row[col.field].getFullYear(), 0, 1); },
                    editable: false,
                    derivedFrom: col.field,
                });
                acc.push({
                    type: 'date',
                    field: "".concat(col.field, "-month"),
                    generateData: function (row) {
                        return new Date(row[col.field].getFullYear(), row[col.field].getMonth(), 1);
                    },
                    editable: false,
                    derivedFrom: col.field,
                });
            }
            return acc;
        }, []);
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
    var _a, _b, _c, _d, _e, _f;
    var dataRef = React.useRef(null);
    var _g = React.useState(false), isDataReady = _g[0], setDataReady = _g[1];
    var _h = React.useState(0), index = _h[0], setIndex = _h[1];
    var shouldRequestsFailRef = React.useRef(shouldRequestsFail !== null && shouldRequestsFail !== void 0 ? shouldRequestsFail : false);
    React.useEffect(function () {
        if (shouldRequestsFail !== undefined) {
            shouldRequestsFailRef.current = shouldRequestsFail;
        }
    }, [shouldRequestsFail]);
    var options = __assign(__assign({}, GET_DEFAULT_DATASET_OPTIONS), dataSetOptions);
    var isTreeData = ((_a = options.treeData) === null || _a === void 0 ? void 0 : _a.groupingField) != null;
    var columns = React.useMemo(function () {
        return getColumnsFromOptions({
            dataSet: options.dataSet,
            editable: options.editable,
            maxColumns: options.maxColumns,
            visibleFields: options.visibleFields,
            derivedColumns: options.derivedColumns,
        });
    }, [
        options.dataSet,
        options.editable,
        options.maxColumns,
        options.visibleFields,
        options.derivedColumns,
    ]);
    var initialState = React.useMemo(function () { var _a; return getInitialState(columns, (_a = options.treeData) === null || _a === void 0 ? void 0 : _a.groupingField); }, [columns, (_b = options.treeData) === null || _b === void 0 ? void 0 : _b.groupingField]);
    var columnsWithDerivedColDef = React.useMemo(function () {
        return columns.map(function (column) { return (__assign(__assign({}, defaultColDef[column.type || 'string']), column)); });
    }, [columns]);
    var columnsWithDefaultColDef = React.useMemo(function () {
        return columnsWithDerivedColDef.filter(function (column) { return !column.derivedFrom; });
    }, [columnsWithDerivedColDef]);
    var getGroupKey = React.useMemo(function () {
        if (isTreeData) {
            return function (row) { return row[options.treeData.groupingField]; };
        }
        return undefined;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [(_c = options.treeData) === null || _c === void 0 ? void 0 : _c.groupingField, isTreeData]);
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
                        if (!(rowLength > 1000 && !options.derivedColumns)) return [3 /*break*/, 3];
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
        (_d = options.treeData) === null || _d === void 0 ? void 0 : _d.maxDepth,
        (_e = options.treeData) === null || _e === void 0 ? void 0 : _e.groupingField,
        (_f = options.treeData) === null || _f === void 0 ? void 0 : _f.averageChildren,
        options.dataSet,
        options.maxColumns,
        options.derivedColumns,
        index,
    ]);
    var fetchRows = React.useCallback(function (requestUrl) { return __awaiter(void 0, void 0, void 0, function () {
        var dataDelay, waitInterval, waitTimeout, params, verbose, print, getRowsResponse, serverOptionsWithDefault, minDelay, maxDelay, delay_1, _a, rows, rootRowCount, aggregateRow, _b, rows, rootRowCount, pivotColumns, aggregateRow, _c, rows, rootRowCount, aggregateRow, _d, returnedRows, nextCursor, totalRowCount, aggregateRow;
        var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        return __generator(this, function (_s) {
            switch (_s.label) {
                case 0:
                    dataDelay = 0;
                    waitInterval = 10;
                    waitTimeout = 500 * waitInterval;
                    _s.label = 1;
                case 1:
                    if (!(dataRef.current === null)) return [3 /*break*/, 3];
                    // prevent infinite loop with a timeout
                    if (dataDelay > waitTimeout) {
                        return [2 /*return*/, sendEmptyResponse()];
                    }
                    // eslint-disable-next-line no-await-in-loop
                    return [4 /*yield*/, new Promise(function (resolve) {
                            setTimeout(resolve, waitInterval);
                        })];
                case 2:
                    // eslint-disable-next-line no-await-in-loop
                    _s.sent();
                    dataDelay += waitInterval;
                    return [3 /*break*/, 1];
                case 3:
                    if (!requestUrl) {
                        return [2 /*return*/, sendEmptyResponse()];
                    }
                    params = decodeParams(requestUrl);
                    verbose = (_e = serverOptions === null || serverOptions === void 0 ? void 0 : serverOptions.verbose) !== null && _e !== void 0 ? _e : true;
                    print = console.info;
                    if (verbose) {
                        print('MUI X: DATASOURCE REQUEST', params);
                    }
                    serverOptionsWithDefault = {
                        minDelay: (_f = serverOptions === null || serverOptions === void 0 ? void 0 : serverOptions.minDelay) !== null && _f !== void 0 ? _f : serverUtils_1.DEFAULT_SERVER_OPTIONS.minDelay,
                        maxDelay: (_g = serverOptions === null || serverOptions === void 0 ? void 0 : serverOptions.maxDelay) !== null && _g !== void 0 ? _g : serverUtils_1.DEFAULT_SERVER_OPTIONS.maxDelay,
                        useCursorPagination: (_h = serverOptions === null || serverOptions === void 0 ? void 0 : serverOptions.useCursorPagination) !== null && _h !== void 0 ? _h : serverUtils_1.DEFAULT_SERVER_OPTIONS.useCursorPagination,
                    };
                    if (shouldRequestsFailRef.current) {
                        minDelay = Math.max(0, serverOptionsWithDefault.minDelay - dataDelay);
                        maxDelay = Math.max(0, serverOptionsWithDefault.maxDelay - dataDelay);
                        delay_1 = (0, services_1.randomInt)(minDelay, maxDelay);
                        return [2 /*return*/, new Promise(function (_, reject) {
                                if (verbose) {
                                    print('MUI X: DATASOURCE REQUEST FAILURE', params);
                                }
                                setTimeout(function () { return reject(new Error('Could not fetch the data')); }, delay_1);
                            })];
                    }
                    if (!isTreeData) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, serverUtils_1.processTreeDataRows)((_k = (_j = dataRef.current) === null || _j === void 0 ? void 0 : _j.rows) !== null && _k !== void 0 ? _k : [], params, serverOptionsWithDefault, columnsWithDefaultColDef, nestedPagination !== null && nestedPagination !== void 0 ? nestedPagination : false)];
                case 4:
                    _a = _s.sent(), rows = _a.rows, rootRowCount = _a.rootRowCount, aggregateRow = _a.aggregateRow;
                    getRowsResponse = __assign({ rows: rows.slice().map(function (row) { return (__assign(__assign({}, row), { path: undefined })); }), rowCount: rootRowCount }, (aggregateRow ? { aggregateRow: aggregateRow } : {}));
                    return [3 /*break*/, 11];
                case 5:
                    if (!(typeof params.pivotModel === 'object' &&
                        params.pivotModel.columns &&
                        params.pivotModel.rows &&
                        params.pivotModel.values)) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, serverUtils_1.processPivotingRows)((_m = (_l = dataRef.current) === null || _l === void 0 ? void 0 : _l.rows) !== null && _m !== void 0 ? _m : [], params, serverOptionsWithDefault, columnsWithDerivedColDef)];
                case 6:
                    _b = _s.sent(), rows = _b.rows, rootRowCount = _b.rootRowCount, pivotColumns = _b.pivotColumns, aggregateRow = _b.aggregateRow;
                    getRowsResponse = {
                        rows: rows.slice(),
                        rowCount: rootRowCount,
                        pivotColumns: pivotColumns,
                        aggregateRow: aggregateRow,
                    };
                    return [3 /*break*/, 11];
                case 7:
                    if (!(params.groupFields && params.groupFields.length > 0)) return [3 /*break*/, 9];
                    return [4 /*yield*/, (0, serverUtils_1.processRowGroupingRows)((_p = (_o = dataRef.current) === null || _o === void 0 ? void 0 : _o.rows) !== null && _p !== void 0 ? _p : [], params, serverOptionsWithDefault, columnsWithDefaultColDef)];
                case 8:
                    _c = _s.sent(), rows = _c.rows, rootRowCount = _c.rootRowCount, aggregateRow = _c.aggregateRow;
                    getRowsResponse = __assign({ rows: rows.slice().map(function (row) { return (__assign(__assign({}, row), { path: undefined })); }), rowCount: rootRowCount }, (aggregateRow ? { aggregateRow: aggregateRow } : {}));
                    return [3 /*break*/, 11];
                case 9: return [4 /*yield*/, (0, serverUtils_1.loadServerRows)((_r = (_q = dataRef.current) === null || _q === void 0 ? void 0 : _q.rows) !== null && _r !== void 0 ? _r : [], __assign(__assign({}, params), params.paginationModel), serverOptionsWithDefault, columnsWithDefaultColDef)];
                case 10:
                    _d = _s.sent(), returnedRows = _d.returnedRows, nextCursor = _d.nextCursor, totalRowCount = _d.totalRowCount, aggregateRow = _d.aggregateRow;
                    getRowsResponse = __assign({ rows: returnedRows, rowCount: totalRowCount, pageInfo: { nextCursor: nextCursor } }, (aggregateRow ? { aggregateRow: aggregateRow } : {}));
                    _s.label = 11;
                case 11: return [2 /*return*/, new Promise(function (resolve) {
                        if (verbose) {
                            print('MUI X: DATASOURCE RESPONSE', params, getRowsResponse);
                        }
                        resolve(getRowsResponse);
                    })];
            }
        });
    }); }, [
        dataRef,
        serverOptions === null || serverOptions === void 0 ? void 0 : serverOptions.verbose,
        serverOptions === null || serverOptions === void 0 ? void 0 : serverOptions.minDelay,
        serverOptions === null || serverOptions === void 0 ? void 0 : serverOptions.maxDelay,
        serverOptions === null || serverOptions === void 0 ? void 0 : serverOptions.useCursorPagination,
        isTreeData,
        columnsWithDefaultColDef,
        columnsWithDerivedColDef,
        nestedPagination,
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
                    // keep the path from the original row if the updated row's path is `undefined`
                    newRows[rowIndex] = __assign(__assign({}, updatedRow), { path: updatedRow.path || newRows[rowIndex].path });
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
