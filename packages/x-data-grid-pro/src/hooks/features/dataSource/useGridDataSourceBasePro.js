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
exports.useGridDataSourceBasePro = exports.INITIAL_STATE = void 0;
var React = require("react");
var isDeepEqual_1 = require("@mui/x-internals/isDeepEqual");
var useLazyRef_1 = require("@mui/utils/useLazyRef");
var x_data_grid_1 = require("@mui/x-data-grid");
var internals_1 = require("@mui/x-data-grid/internals");
var warning_1 = require("@mui/x-internals/warning");
var utils_1 = require("./utils");
var gridDataSourceSelector_1 = require("./gridDataSourceSelector");
exports.INITIAL_STATE = {
    loading: {},
    errors: {},
};
var useGridDataSourceBasePro = function (apiRef, props, options) {
    var _a;
    if (options === void 0) { options = {}; }
    var groupsToAutoFetch = (0, x_data_grid_1.useGridSelector)(apiRef, internals_1.gridRowGroupsToFetchSelector);
    var nestedDataManager = (0, useLazyRef_1.default)(function () { return new utils_1.NestedDataManager(apiRef); }).current;
    var scheduledGroups = React.useRef(0);
    var clearDataSourceState = React.useCallback(function () {
        nestedDataManager.clear();
        scheduledGroups.current = 0;
        var dataSourceState = apiRef.current.state.dataSource;
        if (dataSourceState !== exports.INITIAL_STATE) {
            apiRef.current.resetDataSourceState();
        }
        return null;
    }, [apiRef, nestedDataManager]);
    var handleEditRow = React.useCallback(function (params, updatedRow) {
        var groupKeys = (0, utils_1.getGroupKeys)((0, x_data_grid_1.gridRowTreeSelector)(apiRef), params.rowId);
        apiRef.current.updateNestedRows([updatedRow], groupKeys);
        if (updatedRow && !(0, isDeepEqual_1.isDeepEqual)(updatedRow, params.previousRow)) {
            // Reset the outdated cache, only if the row is _actually_ updated
            apiRef.current.dataSource.cache.clear();
        }
    }, [apiRef]);
    var _b = (0, internals_1.useGridDataSourceBase)(apiRef, props, __assign({ fetchRowChildren: nestedDataManager.queue, clearDataSourceState: clearDataSourceState, handleEditRow: handleEditRow }, options)), api = _b.api, debouncedFetchRows = _b.debouncedFetchRows, strategyProcessor = _b.strategyProcessor, events = _b.events, cacheChunkManager = _b.cacheChunkManager, cache = _b.cache;
    var setStrategyAvailability = React.useCallback(function () {
        apiRef.current.setStrategyAvailability(internals_1.GridStrategyGroup.DataSource, internals_1.DataSourceRowsUpdateStrategy.Default, props.dataSource && !props.lazyLoading ? function () { return true; } : function () { return false; });
    }, [apiRef, props.dataSource, props.lazyLoading]);
    var onDataSourceErrorProp = props.onDataSourceError;
    var fetchRowChildren = React.useCallback(function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var pipedParams, getRows, rowNode, fetchParams, cacheKeys, responses, cachedData, rows, existingError, getRowsResponse, cacheResponses, rowsToDelete_1, error_1, childrenFetchError;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    pipedParams = apiRef.current.unstable_applyPipeProcessors('getRowsParams', {});
                    if (!props.treeData && ((_b = (_a = pipedParams.groupFields) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) === 0) {
                        nestedDataManager.clearPendingRequest(id);
                        return [2 /*return*/];
                    }
                    getRows = (_c = props.dataSource) === null || _c === void 0 ? void 0 : _c.getRows;
                    if (!getRows) {
                        nestedDataManager.clearPendingRequest(id);
                        return [2 /*return*/];
                    }
                    rowNode = apiRef.current.getRowNode(id);
                    if (!rowNode) {
                        nestedDataManager.clearPendingRequest(id);
                        return [2 /*return*/];
                    }
                    fetchParams = __assign(__assign(__assign({}, (0, internals_1.gridGetRowsParamsSelector)(apiRef)), pipedParams), { groupKeys: rowNode.path });
                    cacheKeys = cacheChunkManager.getCacheKeys(fetchParams);
                    responses = cacheKeys.map(function (cacheKey) { return cache.get(cacheKey); });
                    cachedData = responses.some(function (response) { return response === undefined; })
                        ? undefined
                        : internals_1.CacheChunkManager.mergeResponses(responses);
                    if (cachedData !== undefined) {
                        rows = cachedData.rows;
                        nestedDataManager.setRequestSettled(id);
                        apiRef.current.updateNestedRows(rows, rowNode.path);
                        if (cachedData.rowCount !== undefined) {
                            apiRef.current.setRowCount(cachedData.rowCount);
                        }
                        apiRef.current.setRowChildrenExpansion(id, true);
                        apiRef.current.dataSource.setChildrenLoading(id, false);
                        return [2 /*return*/];
                    }
                    existingError = (_d = (0, gridDataSourceSelector_1.gridDataSourceErrorsSelector)(apiRef)[id]) !== null && _d !== void 0 ? _d : null;
                    if (existingError) {
                        apiRef.current.dataSource.setChildrenFetchError(id, null);
                    }
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, getRows(fetchParams)];
                case 2:
                    getRowsResponse = _e.sent();
                    if (!apiRef.current.getRowNode(id)) {
                        // The row has been removed from the grid
                        nestedDataManager.clearPendingRequest(id);
                        return [2 /*return*/];
                    }
                    if (nestedDataManager.getRequestStatus(id) === utils_1.RequestStatus.UNKNOWN) {
                        apiRef.current.dataSource.setChildrenLoading(id, false);
                        return [2 /*return*/];
                    }
                    nestedDataManager.setRequestSettled(id);
                    cacheResponses = cacheChunkManager.splitResponse(fetchParams, getRowsResponse);
                    cacheResponses.forEach(function (response, key) {
                        cache.set(key, response);
                    });
                    if (getRowsResponse.rowCount !== undefined) {
                        apiRef.current.setRowCount(getRowsResponse.rowCount);
                    }
                    rowsToDelete_1 = [];
                    getRowsResponse.rows.forEach(function (row) {
                        var rowId = (0, x_data_grid_1.gridRowIdSelector)(apiRef, row);
                        var treeNode = (0, x_data_grid_1.gridRowNodeSelector)(apiRef, rowId);
                        if (treeNode) {
                            rowsToDelete_1.push({ id: rowId, _action: 'delete' });
                        }
                    });
                    if (rowsToDelete_1.length > 0) {
                        // TODO: Make this happen in a single pass by modifying the pre-processing of the rows
                        apiRef.current.updateNestedRows(rowsToDelete_1, rowNode.path);
                    }
                    apiRef.current.updateNestedRows(getRowsResponse.rows, rowNode.path);
                    apiRef.current.setRowChildrenExpansion(id, true);
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _e.sent();
                    childrenFetchError = error_1;
                    apiRef.current.dataSource.setChildrenFetchError(id, childrenFetchError);
                    if (typeof onDataSourceErrorProp === 'function') {
                        onDataSourceErrorProp(new x_data_grid_1.GridGetRowsError({
                            message: childrenFetchError.message,
                            params: fetchParams,
                            cause: childrenFetchError,
                        }));
                    }
                    else if (process.env.NODE_ENV !== 'production') {
                        (0, warning_1.warnOnce)([
                            'MUI X: A call to `dataSource.getRows()` threw an error which was not handled because `onDataSourceError()` is missing.',
                            'To handle the error pass a callback to the `onDataSourceError` prop, for example `<DataGrid onDataSourceError={(error) => ...} />`.',
                            'For more detail, see https://mui.com/x/react-data-grid/server-side-data/#error-handling.',
                        ], 'error');
                    }
                    return [3 /*break*/, 5];
                case 4:
                    apiRef.current.dataSource.setChildrenLoading(id, false);
                    nestedDataManager.setRequestSettled(id);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [
        nestedDataManager,
        cacheChunkManager,
        cache,
        onDataSourceErrorProp,
        apiRef,
        props.treeData,
        (_a = props.dataSource) === null || _a === void 0 ? void 0 : _a.getRows,
    ]);
    var setChildrenLoading = React.useCallback(function (parentId, isLoading) {
        apiRef.current.setState(function (state) {
            if (!state.dataSource.loading[parentId] && isLoading === false) {
                return state;
            }
            var newLoadingState = __assign({}, state.dataSource.loading);
            if (isLoading === false) {
                delete newLoadingState[parentId];
            }
            else {
                newLoadingState[parentId] = isLoading;
            }
            return __assign(__assign({}, state), { dataSource: __assign(__assign({}, state.dataSource), { loading: newLoadingState }) });
        });
    }, [apiRef]);
    var setChildrenFetchError = React.useCallback(function (parentId, error) {
        apiRef.current.setState(function (state) {
            var newErrorsState = __assign({}, state.dataSource.errors);
            if (error === null && newErrorsState[parentId] !== undefined) {
                delete newErrorsState[parentId];
            }
            else {
                newErrorsState[parentId] = error;
            }
            return __assign(__assign({}, state), { dataSource: __assign(__assign({}, state.dataSource), { errors: newErrorsState }) });
        });
    }, [apiRef]);
    var resetDataSourceState = React.useCallback(function () {
        apiRef.current.setState(function (state) {
            return __assign(__assign({}, state), { dataSource: exports.INITIAL_STATE });
        });
    }, [apiRef]);
    var removeChildrenRows = React.useCallback(function (parentId) {
        var rowNode = (0, x_data_grid_1.gridRowNodeSelector)(apiRef, parentId);
        if (!rowNode || rowNode.type !== 'group' || rowNode.children.length === 0) {
            return;
        }
        var removedRows = [];
        var traverse = function (nodeId) {
            var node = (0, x_data_grid_1.gridRowNodeSelector)(apiRef, nodeId);
            if (!node) {
                return;
            }
            if (node.type === 'group' && node.children.length > 0) {
                node.children.forEach(traverse);
            }
            removedRows.push({ id: nodeId, _action: 'delete' });
        };
        rowNode.children.forEach(traverse);
        if (removedRows.length > 0) {
            apiRef.current.updateNestedRows(removedRows, rowNode.path);
        }
    }, [apiRef]);
    var dataSourceApi = {
        dataSource: __assign(__assign({}, api.public.dataSource), { setChildrenLoading: setChildrenLoading, setChildrenFetchError: setChildrenFetchError }),
    };
    var dataSourcePrivateApi = {
        fetchRowChildren: fetchRowChildren,
        resetDataSourceState: resetDataSourceState,
        removeChildrenRows: removeChildrenRows,
    };
    React.useEffect(function () {
        if (groupsToAutoFetch &&
            groupsToAutoFetch.length &&
            scheduledGroups.current < groupsToAutoFetch.length) {
            var groupsToSchedule = groupsToAutoFetch.slice(scheduledGroups.current);
            nestedDataManager.queue(groupsToSchedule);
            scheduledGroups.current = groupsToAutoFetch.length;
        }
    }, [apiRef, nestedDataManager, groupsToAutoFetch]);
    return {
        api: { public: dataSourceApi, private: dataSourcePrivateApi },
        debouncedFetchRows: debouncedFetchRows,
        strategyProcessor: strategyProcessor,
        events: events,
        setStrategyAvailability: setStrategyAvailability,
        cacheChunkManager: cacheChunkManager,
        cache: cache,
    };
};
exports.useGridDataSourceBasePro = useGridDataSourceBasePro;
