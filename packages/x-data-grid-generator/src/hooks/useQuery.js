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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFakeServer = void 0;
var React = require("react");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var isDeepEqual_1 = require("@mui/x-internals/isDeepEqual");
var useDemoData_1 = require("./useDemoData");
var serverUtils_1 = require("./serverUtils");
var DEFAULT_DATASET_OPTIONS = {
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
};
var createFakeServer = function (dataSetOptions, serverOptions) {
    var dataSetOptionsWithDefault = __assign(__assign({}, DEFAULT_DATASET_OPTIONS), dataSetOptions);
    var serverOptionsWithDefault = __assign(__assign({}, serverUtils_1.DEFAULT_SERVER_OPTIONS), serverOptions);
    var columns = (0, useDemoData_1.getColumnsFromOptions)(dataSetOptionsWithDefault);
    var initialState = (0, useDemoData_1.getInitialState)(dataSetOptionsWithDefault, columns);
    var defaultColDef = (0, x_data_grid_pro_1.getGridDefaultColumnTypes)();
    var columnsWithDefaultColDef = columns.map(function (column) { return (__assign(__assign({}, defaultColDef[column.type || 'string']), column)); });
    var useQuery = function (queryOptions) {
        var _a = (0, useDemoData_1.useDemoData)(dataSetOptionsWithDefault), rows = _a.data.rows, dataGenerationIsLoading = _a.loading;
        var queryOptionsRef = React.useRef(queryOptions);
        var _b = React.useState({ pageInfo: {}, rows: [] }), response = _b[0], setResponse = _b[1];
        var _c = React.useState(dataGenerationIsLoading), isLoading = _c[0], setIsLoading = _c[1];
        React.useEffect(function () {
            if (dataGenerationIsLoading) {
                // dataset is not ready
                return function () { };
            }
            queryOptionsRef.current = queryOptions;
            var active = true;
            setIsLoading(true);
            setResponse(function (prev) {
                return Object.keys(prev.pageInfo).length === 0 ? prev : __assign(__assign({}, prev), { pageInfo: {} });
            });
            (function fetchData() {
                return __awaiter(this, void 0, void 0, function () {
                    var _a, returnedRows, nextCursor, totalRowCount, hasNextPage, newRep;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, (0, serverUtils_1.loadServerRows)(rows, queryOptions, serverOptionsWithDefault, columnsWithDefaultColDef)];
                            case 1:
                                _a = _b.sent(), returnedRows = _a.returnedRows, nextCursor = _a.nextCursor, totalRowCount = _a.totalRowCount, hasNextPage = _a.hasNextPage;
                                if (!active) {
                                    return [2 /*return*/];
                                }
                                newRep = {
                                    rows: returnedRows,
                                    pageInfo: {
                                        totalRowCount: totalRowCount,
                                        nextCursor: nextCursor,
                                        hasNextPage: hasNextPage,
                                        pageSize: returnedRows.length,
                                    },
                                };
                                setResponse(function (prev) { return ((0, isDeepEqual_1.isDeepEqual)(prev, newRep) ? prev : newRep); });
                                setIsLoading(false);
                                return [2 /*return*/];
                        }
                    });
                });
            })();
            return function () {
                active = false;
            };
        }, [dataGenerationIsLoading, queryOptions, rows]);
        // We use queryOptions pointer to be sure that isLoading===true as soon as the options change
        var effectShouldStart = queryOptionsRef.current !== queryOptions;
        return __assign({ isLoading: isLoading || effectShouldStart }, response);
    };
    return { columns: columns, columnsWithDefaultColDef: columnsWithDefaultColDef, initialState: initialState, useQuery: useQuery };
};
exports.createFakeServer = createFakeServer;
