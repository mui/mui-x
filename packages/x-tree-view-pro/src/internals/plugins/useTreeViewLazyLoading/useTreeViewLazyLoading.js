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
exports.useTreeViewLazyLoading = void 0;
var React = require("react");
var useLazyRef_1 = require("@mui/utils/useLazyRef");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var internals_1 = require("@mui/x-tree-view/internals");
var utils_1 = require("@mui/x-tree-view/utils");
var utils_2 = require("./utils");
var INITIAL_STATE = {
    loading: {},
    errors: {},
};
var noopCache = {
    clear: function () { },
    get: function () { return undefined; },
    set: function () { },
};
function getCache(cacheProp) {
    if (cacheProp === null) {
        return noopCache;
    }
    return cacheProp !== null && cacheProp !== void 0 ? cacheProp : new utils_1.DataSourceCacheDefault({});
}
var useTreeViewLazyLoading = function (_a) {
    var instance = _a.instance, params = _a.params, store = _a.store;
    var isLazyLoadingEnabled = !!params.dataSource;
    var firstRenderRef = React.useRef(true);
    var nestedDataManager = (0, useLazyRef_1.default)(function () { return new utils_2.NestedDataManager(instance); }).current;
    var cacheRef = (0, useLazyRef_1.default)(function () { return getCache(params.dataSourceCache); });
    var setDataSourceLoading = (0, useEventCallback_1.default)(function (itemId, isLoading) {
        if (!isLazyLoadingEnabled) {
            return;
        }
        store.update(function (prevState) {
            if (!prevState.lazyLoading.dataSource.loading[itemId] && !isLoading) {
                return prevState;
            }
            var loading = __assign({}, prevState.lazyLoading.dataSource.loading);
            if (isLoading === false) {
                delete loading[itemId];
            }
            else {
                loading[itemId] = isLoading;
            }
            return __assign(__assign({}, prevState), { lazyLoading: __assign(__assign({}, prevState.lazyLoading), { dataSource: __assign(__assign({}, prevState.lazyLoading.dataSource), { loading: loading }) }) });
        });
    });
    var setDataSourceError = function (itemId, error) {
        if (!isLazyLoadingEnabled) {
            return;
        }
        store.update(function (prevState) {
            var errors = __assign({}, prevState.lazyLoading.dataSource.errors);
            if (error === null && errors[itemId] !== undefined) {
                delete errors[itemId];
            }
            else {
                errors[itemId] = error;
            }
            errors[itemId] = error;
            return __assign(__assign({}, prevState), { lazyLoading: __assign(__assign({}, prevState.lazyLoading), { dataSource: __assign(__assign({}, prevState.lazyLoading.dataSource), { errors: errors }) }) });
        });
    };
    var resetDataSourceState = (0, useEventCallback_1.default)(function () {
        if (!isLazyLoadingEnabled) {
            return;
        }
        store.update(function (prevState) { return (__assign(__assign({}, prevState), { lazyLoading: __assign(__assign({}, prevState.lazyLoading), { dataSource: INITIAL_STATE }) })); });
    });
    var fetchItems = (0, useEventCallback_1.default)(function (parentIds) { return __awaiter(void 0, void 0, void 0, function () {
        var getChildrenCount, getTreeItems, cachedData, getTreeItemsResponse, error_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!isLazyLoadingEnabled) {
                        return [2 /*return*/];
                    }
                    getChildrenCount = ((_a = params.dataSource) === null || _a === void 0 ? void 0 : _a.getChildrenCount) || (function () { return 0; });
                    getTreeItems = (_b = params.dataSource) === null || _b === void 0 ? void 0 : _b.getTreeItems;
                    if (!getTreeItems) {
                        return [2 /*return*/];
                    }
                    if (!parentIds) return [3 /*break*/, 2];
                    return [4 /*yield*/, nestedDataManager.queue(parentIds)];
                case 1:
                    _c.sent();
                    return [2 /*return*/];
                case 2:
                    nestedDataManager.clear();
                    // handle loading here
                    instance.setTreeViewLoading(true);
                    // reset the state if we are refetching the first visible items
                    if ((0, internals_1.selectorDataSourceState)(store.value) !== INITIAL_STATE) {
                        resetDataSourceState();
                    }
                    cachedData = cacheRef.current.get('root');
                    if (cachedData !== undefined && cachedData !== -1) {
                        instance.addItems({ items: cachedData, depth: 0, getChildrenCount: getChildrenCount });
                        instance.setTreeViewLoading(false);
                        return [2 /*return*/];
                    }
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 5, 6, 7]);
                    return [4 /*yield*/, getTreeItems()];
                case 4:
                    getTreeItemsResponse = _c.sent();
                    // set caching
                    cacheRef.current.set('root', getTreeItemsResponse);
                    // update the items in the state
                    instance.addItems({ items: getTreeItemsResponse, depth: 0, getChildrenCount: getChildrenCount });
                    return [3 /*break*/, 7];
                case 5:
                    error_1 = _c.sent();
                    // set the items to empty
                    instance.addItems({ items: [], depth: 0, getChildrenCount: getChildrenCount });
                    // set error state
                    instance.setTreeViewError(error_1);
                    return [3 /*break*/, 7];
                case 6:
                    // set loading state
                    instance.setTreeViewLoading(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); });
    var fetchItemChildren = (0, useEventCallback_1.default)(function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var getChildrenCount, getTreeItems, parent, depth, cachedData, existingError, getTreeItemsResponse, error_2, childrenFetchError;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!isLazyLoadingEnabled) {
                        return [2 /*return*/];
                    }
                    getChildrenCount = ((_a = params.dataSource) === null || _a === void 0 ? void 0 : _a.getChildrenCount) || (function () { return 0; });
                    getTreeItems = (_b = params.dataSource) === null || _b === void 0 ? void 0 : _b.getTreeItems;
                    if (!getTreeItems) {
                        nestedDataManager.clearPendingRequest(id);
                        return [2 /*return*/];
                    }
                    parent = (0, internals_1.selectorItemMeta)(store.value, id);
                    if (!parent) {
                        nestedDataManager.clearPendingRequest(id);
                        return [2 /*return*/];
                    }
                    depth = parent.depth ? parent.depth + 1 : 1;
                    // handle loading here
                    instance.setDataSourceLoading(id, true);
                    cachedData = cacheRef.current.get(id);
                    if (cachedData !== undefined && cachedData !== -1) {
                        nestedDataManager.setRequestSettled(id);
                        instance.addItems({ items: cachedData, depth: depth, parentId: id, getChildrenCount: getChildrenCount });
                        instance.setDataSourceLoading(id, false);
                        return [2 /*return*/];
                    }
                    if (cachedData === -1) {
                        instance.removeChildren(id);
                    }
                    existingError = (_c = (0, internals_1.selectorGetTreeItemError)(store.value, id)) !== null && _c !== void 0 ? _c : null;
                    if (existingError) {
                        instance.setDataSourceError(id, null);
                    }
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, getTreeItems(id)];
                case 2:
                    getTreeItemsResponse = _d.sent();
                    nestedDataManager.setRequestSettled(id);
                    // set caching
                    cacheRef.current.set(id, getTreeItemsResponse);
                    // update the items in the state
                    instance.addItems({ items: getTreeItemsResponse, depth: depth, parentId: id, getChildrenCount: getChildrenCount });
                    return [3 /*break*/, 5];
                case 3:
                    error_2 = _d.sent();
                    childrenFetchError = error_2;
                    // handle errors here
                    instance.setDataSourceError(id, childrenFetchError);
                    instance.removeChildren(id);
                    return [3 /*break*/, 5];
                case 4:
                    // unset loading
                    instance.setDataSourceLoading(id, false);
                    nestedDataManager.setRequestSettled(id);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    (0, internals_1.useInstanceEventHandler)(instance, 'beforeItemToggleExpansion', function (eventParameters) { return __awaiter(void 0, void 0, void 0, function () {
        var fetchErrors;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isLazyLoadingEnabled || !eventParameters.shouldBeExpanded) {
                        return [2 /*return*/];
                    }
                    // prevent the default expansion behavior
                    eventParameters.isExpansionPrevented = true;
                    return [4 /*yield*/, instance.fetchItems([eventParameters.itemId])];
                case 1:
                    _a.sent();
                    fetchErrors = Boolean((0, internals_1.selectorGetTreeItemError)(store.value, eventParameters.itemId));
                    if (!fetchErrors) {
                        instance.applyItemExpansion({
                            itemId: eventParameters.itemId,
                            shouldBeExpanded: true,
                            event: eventParameters.event,
                        });
                        if ((0, internals_1.selectorIsItemSelected)(store.value, eventParameters.itemId)) {
                            // make sure selection propagation works correctly
                            instance.setItemSelection({
                                event: eventParameters.event,
                                itemId: eventParameters.itemId,
                                keepExistingSelection: true,
                                shouldBeSelected: true,
                            });
                        }
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    React.useEffect(function () {
        var _a;
        if (isLazyLoadingEnabled && firstRenderRef.current) {
            store.update(function (prevState) { return (__assign(__assign({}, prevState), { lazyLoading: __assign(__assign({}, prevState.lazyLoading), { enabled: true }) })); });
            if (params.items.length) {
                var getChildrenCount = ((_a = params.dataSource) === null || _a === void 0 ? void 0 : _a.getChildrenCount) || (function () { return 0; });
                instance.addItems({ items: params.items, depth: 0, getChildrenCount: getChildrenCount });
            }
            else {
                var expandedItems = (0, internals_1.selectorExpandedItems)(store.value);
                if (expandedItems.length > 0) {
                    instance.resetItemExpansion();
                }
                instance.fetchItems();
            }
            firstRenderRef.current = false;
        }
    }, [instance, params.items, params.dataSource, isLazyLoadingEnabled, store]);
    if (isLazyLoadingEnabled) {
        instance.preventItemUpdates();
    }
    return {
        instance: {
            fetchItemChildren: fetchItemChildren,
            fetchItems: fetchItems,
            setDataSourceLoading: setDataSourceLoading,
            setDataSourceError: setDataSourceError,
        },
        publicAPI: {},
    };
};
exports.useTreeViewLazyLoading = useTreeViewLazyLoading;
exports.useTreeViewLazyLoading.getInitialState = function () { return ({
    lazyLoading: {
        enabled: false,
        dataSource: INITIAL_STATE,
    },
}); };
exports.useTreeViewLazyLoading.params = {
    dataSource: true,
    dataSourceCache: true,
};
