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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridDataSourceBase = void 0;
var React = require("react");
var useLazyRef_1 = require("@mui/utils/useLazyRef");
var debounce_1 = require("@mui/utils/debounce");
var warning_1 = require("@mui/x-internals/warning");
var isDeepEqual_1 = require("@mui/x-internals/isDeepEqual");
var gridRowsUtils_1 = require("../rows/gridRowsUtils");
var utils_1 = require("../../../utils/utils");
var strategyProcessing_1 = require("../../core/strategyProcessing");
var useGridSelector_1 = require("../../utils/useGridSelector");
var gridPaginationSelector_1 = require("../pagination/gridPaginationSelector");
var gridDataSourceSelector_1 = require("./gridDataSourceSelector");
var utils_2 = require("./utils");
var cache_1 = require("./cache");
var gridDataSourceError_1 = require("./gridDataSourceError");
var noopCache = {
    clear: function () { },
    get: function () { return undefined; },
    set: function () { },
};
function getCache(cacheProp, options) {
    if (options === void 0) { options = {}; }
    if (cacheProp === null) {
        return noopCache;
    }
    return cacheProp !== null && cacheProp !== void 0 ? cacheProp : new cache_1.GridDataSourceCacheDefault(options);
}
var useGridDataSourceBase = function (apiRef, props, options) {
    var _a, _b;
    if (options === void 0) { options = {}; }
    var setStrategyAvailability = React.useCallback(function () {
        apiRef.current.setStrategyAvailability(strategyProcessing_1.GridStrategyGroup.DataSource, utils_2.DataSourceRowsUpdateStrategy.Default, props.dataSource ? function () { return true; } : function () { return false; });
    }, [apiRef, props.dataSource]);
    var _c = React.useState(false), defaultRowsUpdateStrategyActive = _c[0], setDefaultRowsUpdateStrategyActive = _c[1];
    var paginationModel = (0, useGridSelector_1.useGridSelector)(apiRef, gridPaginationSelector_1.gridPaginationModelSelector);
    var lastRequestId = React.useRef(0);
    var onDataSourceErrorProp = props.onDataSourceError;
    var cacheChunkManager = (0, useLazyRef_1.default)(function () {
        if (!props.pagination) {
            return new utils_2.CacheChunkManager(paginationModel.pageSize);
        }
        var sortedPageSizeOptions = props.pageSizeOptions
            .map(function (option) { return (typeof option === 'number' ? option : option.value); })
            .sort(function (a, b) { return a - b; });
        var cacheChunkSize = Math.min(paginationModel.pageSize, sortedPageSizeOptions[0]);
        return new utils_2.CacheChunkManager(cacheChunkSize);
    }).current;
    var _d = React.useState(function () {
        return getCache(props.dataSourceCache, options.cacheOptions);
    }), cache = _d[0], setCache = _d[1];
    var fetchRows = React.useCallback(function (parentId, params) { return __awaiter(void 0, void 0, void 0, function () {
        var getRows, _a, skipCache, getRowsParams, fetchParams, cacheKeys, responses, requestId, getRowsResponse, cacheResponses, originalError_1;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    getRows = (_b = props.dataSource) === null || _b === void 0 ? void 0 : _b.getRows;
                    if (!getRows) {
                        return [2 /*return*/];
                    }
                    if (parentId && parentId !== gridRowsUtils_1.GRID_ROOT_GROUP_ID && props.signature !== 'DataGrid') {
                        (_c = options.fetchRowChildren) === null || _c === void 0 ? void 0 : _c.call(options, [parentId]);
                        return [2 /*return*/];
                    }
                    (_d = options.clearDataSourceState) === null || _d === void 0 ? void 0 : _d.call(options);
                    _a = params || {}, skipCache = _a.skipCache, getRowsParams = __rest(_a, ["skipCache"]);
                    fetchParams = __assign(__assign(__assign({}, (0, gridDataSourceSelector_1.gridGetRowsParamsSelector)(apiRef)), apiRef.current.unstable_applyPipeProcessors('getRowsParams', {})), getRowsParams);
                    cacheKeys = cacheChunkManager.getCacheKeys(fetchParams);
                    responses = cacheKeys.map(function (cacheKey) { return cache.get(cacheKey); });
                    if (!skipCache && responses.every(function (response) { return response !== undefined; })) {
                        apiRef.current.applyStrategyProcessor('dataSourceRowsUpdate', {
                            response: utils_2.CacheChunkManager.mergeResponses(responses),
                            fetchParams: fetchParams,
                        });
                        return [2 /*return*/];
                    }
                    // Manage loading state only for the default strategy
                    if (defaultRowsUpdateStrategyActive || apiRef.current.getRowsCount() === 0) {
                        apiRef.current.setLoading(true);
                    }
                    requestId = lastRequestId.current + 1;
                    lastRequestId.current = requestId;
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, getRows(fetchParams)];
                case 2:
                    getRowsResponse = _e.sent();
                    cacheResponses = cacheChunkManager.splitResponse(fetchParams, getRowsResponse);
                    cacheResponses.forEach(function (response, key) { return cache.set(key, response); });
                    if (lastRequestId.current === requestId) {
                        apiRef.current.applyStrategyProcessor('dataSourceRowsUpdate', {
                            response: getRowsResponse,
                            fetchParams: fetchParams,
                        });
                    }
                    return [3 /*break*/, 5];
                case 3:
                    originalError_1 = _e.sent();
                    if (lastRequestId.current === requestId) {
                        apiRef.current.applyStrategyProcessor('dataSourceRowsUpdate', {
                            error: originalError_1,
                            fetchParams: fetchParams,
                        });
                        if (typeof onDataSourceErrorProp === 'function') {
                            onDataSourceErrorProp(new gridDataSourceError_1.GridGetRowsError({
                                message: originalError_1 === null || originalError_1 === void 0 ? void 0 : originalError_1.message,
                                params: fetchParams,
                                cause: originalError_1,
                            }));
                        }
                        else if (process.env.NODE_ENV !== 'production') {
                            (0, warning_1.warnOnce)([
                                'MUI X: A call to `dataSource.getRows()` threw an error which was not handled because `onDataSourceError()` is missing.',
                                'To handle the error pass a callback to the `onDataSourceError` prop, for example `<DataGrid onDataSourceError={(error) => ...} />`.',
                                'For more detail, see https://mui.com/x/react-data-grid/server-side-data/#error-handling.',
                            ], 'error');
                        }
                    }
                    return [3 /*break*/, 5];
                case 4:
                    if (defaultRowsUpdateStrategyActive && lastRequestId.current === requestId) {
                        apiRef.current.setLoading(false);
                    }
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [
        cacheChunkManager,
        cache,
        apiRef,
        defaultRowsUpdateStrategyActive,
        (_a = props.dataSource) === null || _a === void 0 ? void 0 : _a.getRows,
        onDataSourceErrorProp,
        options,
        props.signature,
    ]);
    var handleStrategyActivityChange = React.useCallback(function () {
        setDefaultRowsUpdateStrategyActive(apiRef.current.getActiveStrategy(strategyProcessing_1.GridStrategyGroup.DataSource) ===
            utils_2.DataSourceRowsUpdateStrategy.Default);
    }, [apiRef]);
    var handleDataUpdate = React.useCallback(function (params) {
        if ('error' in params) {
            apiRef.current.setRows([]);
            return;
        }
        var response = params.response;
        if (response.rowCount !== undefined) {
            apiRef.current.setRowCount(response.rowCount);
        }
        apiRef.current.setRows(response.rows);
        apiRef.current.unstable_applyPipeProcessors('processDataSourceRows', { params: params.fetchParams, response: response }, true);
    }, [apiRef]);
    var dataSourceUpdateRow = (_b = props.dataSource) === null || _b === void 0 ? void 0 : _b.updateRow;
    var handleEditRowOption = options.handleEditRow;
    var editRow = React.useCallback(function (params) { return __awaiter(void 0, void 0, void 0, function () {
        var finalRowUpdate, errorThrown_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!dataSourceUpdateRow) {
                        return [2 /*return*/, undefined];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, dataSourceUpdateRow(params)];
                case 2:
                    finalRowUpdate = _a.sent();
                    if (typeof handleEditRowOption === 'function') {
                        handleEditRowOption(params, finalRowUpdate);
                        return [2 /*return*/, finalRowUpdate];
                    }
                    apiRef.current.updateNestedRows([finalRowUpdate], []);
                    if (finalRowUpdate && !(0, isDeepEqual_1.isDeepEqual)(finalRowUpdate, params.previousRow)) {
                        // Reset the outdated cache, only if the row is _actually_ updated
                        apiRef.current.dataSource.cache.clear();
                    }
                    return [2 /*return*/, finalRowUpdate];
                case 3:
                    errorThrown_1 = _a.sent();
                    if (typeof onDataSourceErrorProp === 'function') {
                        onDataSourceErrorProp(new gridDataSourceError_1.GridUpdateRowError({
                            message: errorThrown_1 === null || errorThrown_1 === void 0 ? void 0 : errorThrown_1.message,
                            params: params,
                            cause: errorThrown_1,
                        }));
                    }
                    else if (process.env.NODE_ENV !== 'production') {
                        (0, warning_1.warnOnce)([
                            'MUI X: A call to `dataSource.updateRow()` threw an error which was not handled because `onDataSourceError()` is missing.',
                            'To handle the error pass a callback to the `onDataSourceError` prop, for example `<DataGrid onDataSourceError={(error) => ...} />`.',
                            'For more detail, see https://mui.com/x/react-data-grid/server-side-data/#error-handling.',
                        ], 'error');
                    }
                    throw errorThrown_1; // Let the caller handle the error further
                case 4: return [2 /*return*/];
            }
        });
    }); }, [apiRef, dataSourceUpdateRow, onDataSourceErrorProp, handleEditRowOption]);
    var dataSourceApi = {
        dataSource: {
            fetchRows: fetchRows,
            cache: cache,
            editRow: editRow,
        },
    };
    var debouncedFetchRows = React.useMemo(function () { return (0, debounce_1.default)(fetchRows, 0); }, [fetchRows]);
    var isFirstRender = React.useRef(true);
    React.useEffect(function () {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (props.dataSourceCache === undefined) {
            return;
        }
        var newCache = getCache(props.dataSourceCache, options.cacheOptions);
        setCache(function (prevCache) { return (prevCache !== newCache ? newCache : prevCache); });
    }, [props.dataSourceCache, options.cacheOptions]);
    React.useEffect(function () {
        if (props.dataSource) {
            apiRef.current.dataSource.cache.clear();
            apiRef.current.dataSource.fetchRows();
        }
        return function () {
            // ignore the current request on unmount
            lastRequestId.current += 1;
        };
    }, [apiRef, props.dataSource]);
    return {
        api: { public: dataSourceApi },
        debouncedFetchRows: debouncedFetchRows,
        strategyProcessor: {
            strategyName: utils_2.DataSourceRowsUpdateStrategy.Default,
            group: 'dataSourceRowsUpdate',
            processor: handleDataUpdate,
        },
        setStrategyAvailability: setStrategyAvailability,
        cacheChunkManager: cacheChunkManager,
        cache: cache,
        events: {
            strategyAvailabilityChange: handleStrategyActivityChange,
            sortModelChange: (0, utils_1.runIf)(defaultRowsUpdateStrategyActive, function () { return debouncedFetchRows(); }),
            filterModelChange: (0, utils_1.runIf)(defaultRowsUpdateStrategyActive, function () { return debouncedFetchRows(); }),
            paginationModelChange: (0, utils_1.runIf)(defaultRowsUpdateStrategyActive, function () { return debouncedFetchRows(); }),
        },
    };
};
exports.useGridDataSourceBase = useGridDataSourceBase;
