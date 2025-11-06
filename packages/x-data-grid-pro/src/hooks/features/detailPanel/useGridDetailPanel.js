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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridDetailPanel = exports.detailPanelStateInitializer = void 0;
var React = require("react");
var x_data_grid_1 = require("@mui/x-data-grid");
var internals_1 = require("@mui/x-data-grid/internals");
var gridDetailPanelToggleColDef_1 = require("./gridDetailPanelToggleColDef");
var gridDetailPanelSelector_1 = require("./gridDetailPanelSelector");
var emptySet = new Set();
var detailPanelStateInitializer = function (state, props) {
    var _a, _b, _c, _d;
    return __assign(__assign({}, state), { detailPanel: {
            heightCache: {},
            expandedRowIds: (_d = (_a = props.detailPanelExpandedRowIds) !== null && _a !== void 0 ? _a : (_c = (_b = props.initialState) === null || _b === void 0 ? void 0 : _b.detailPanel) === null || _c === void 0 ? void 0 : _c.expandedRowIds) !== null && _d !== void 0 ? _d : emptySet,
        } });
};
exports.detailPanelStateInitializer = detailPanelStateInitializer;
function cacheContentAndHeight(apiRef, getDetailPanelContent, getDetailPanelHeight, previousHeightCache) {
    var _a;
    if (typeof getDetailPanelContent !== 'function') {
        return {};
    }
    // TODO change to lazy approach using a Proxy
    // only call getDetailPanelContent when asked for an id
    var rowIds = (0, x_data_grid_1.gridDataRowIdsSelector)(apiRef);
    var contentCache = {};
    var heightCache = {};
    for (var i = 0; i < rowIds.length; i += 1) {
        var id = rowIds[i];
        var params = apiRef.current.getRowParams(id);
        var content = getDetailPanelContent(params);
        contentCache[id] = content;
        if (content == null) {
            continue;
        }
        var height = getDetailPanelHeight(params);
        var autoHeight = height === 'auto';
        heightCache[id] = { autoHeight: autoHeight, height: autoHeight ? (_a = previousHeightCache[id]) === null || _a === void 0 ? void 0 : _a.height : height };
    }
    return { contentCache: contentCache, heightCache: heightCache };
}
var useGridDetailPanel = function (apiRef, props) {
    var contentCache = (0, x_data_grid_1.useGridSelector)(apiRef, gridDetailPanelSelector_1.gridDetailPanelExpandedRowsContentCacheSelector);
    var handleCellClick = React.useCallback(function (params, event) {
        if (params.field !== gridDetailPanelToggleColDef_1.GRID_DETAIL_PANEL_TOGGLE_FIELD || props.getDetailPanelContent == null) {
            return;
        }
        var content = contentCache[params.id];
        if (!React.isValidElement(content)) {
            return;
        }
        // Ignore if the user didn't click specifically in the "i" button
        if (event.target === event.currentTarget) {
            return;
        }
        apiRef.current.toggleDetailPanel(params.id);
    }, [apiRef, contentCache, props.getDetailPanelContent]);
    var handleCellKeyDown = React.useCallback(function (params, event) {
        if (props.getDetailPanelContent == null) {
            return;
        }
        if (params.field === gridDetailPanelToggleColDef_1.GRID_DETAIL_PANEL_TOGGLE_FIELD && event.key === ' ') {
            apiRef.current.toggleDetailPanel(params.id);
        }
    }, [apiRef, props.getDetailPanelContent]);
    (0, x_data_grid_1.useGridEvent)(apiRef, 'cellClick', handleCellClick);
    (0, x_data_grid_1.useGridEvent)(apiRef, 'cellKeyDown', handleCellKeyDown);
    apiRef.current.registerControlState({
        stateId: 'detailPanels',
        propModel: props.detailPanelExpandedRowIds,
        propOnChange: props.onDetailPanelExpandedRowIdsChange,
        stateSelector: gridDetailPanelSelector_1.gridDetailPanelExpandedRowIdsSelector,
        changeEvent: 'detailPanelsExpandedRowIdsChange',
    });
    var toggleDetailPanel = React.useCallback(function (id) {
        if (props.getDetailPanelContent == null) {
            return;
        }
        var content = contentCache[id];
        if (!React.isValidElement(content)) {
            return;
        }
        var ids = apiRef.current.getExpandedDetailPanels();
        var newIds = new Set(ids);
        if (ids.has(id)) {
            newIds.delete(id);
        }
        else {
            newIds.add(id);
        }
        apiRef.current.setExpandedDetailPanels(newIds);
    }, [apiRef, contentCache, props.getDetailPanelContent]);
    var getExpandedDetailPanels = React.useCallback(function () { return (0, gridDetailPanelSelector_1.gridDetailPanelExpandedRowIdsSelector)(apiRef); }, [apiRef]);
    var setExpandedDetailPanels = React.useCallback(function (ids) {
        apiRef.current.setState(function (state) {
            return __assign(__assign({}, state), { detailPanel: __assign(__assign({}, state.detailPanel), { expandedRowIds: ids }) });
        });
        apiRef.current.requestPipeProcessorsApplication('rowHeight');
    }, [apiRef]);
    var storeDetailPanelHeight = React.useCallback(function (id, height) {
        var heightCache = (0, gridDetailPanelSelector_1.gridDetailPanelRawHeightCacheSelector)(apiRef);
        if (!heightCache[id] || heightCache[id].height === height) {
            return;
        }
        apiRef.current.setState(function (state) {
            var _a;
            return __assign(__assign({}, state), { detailPanel: __assign(__assign({}, state.detailPanel), { heightCache: __assign(__assign({}, heightCache), (_a = {}, _a[id] = __assign(__assign({}, heightCache[id]), { height: height }), _a)) }) });
        });
        apiRef.current.requestPipeProcessorsApplication('rowHeight');
    }, [apiRef]);
    var detailPanelPubicApi = {
        toggleDetailPanel: toggleDetailPanel,
        getExpandedDetailPanels: getExpandedDetailPanels,
        setExpandedDetailPanels: setExpandedDetailPanels,
    };
    var detailPanelPrivateApi = {
        storeDetailPanelHeight: storeDetailPanelHeight,
    };
    (0, x_data_grid_1.useGridApiMethod)(apiRef, detailPanelPubicApi, 'public');
    (0, x_data_grid_1.useGridApiMethod)(apiRef, detailPanelPrivateApi, 'private');
    React.useEffect(function () {
        if (props.detailPanelExpandedRowIds) {
            var currentModel = (0, gridDetailPanelSelector_1.gridDetailPanelExpandedRowIdsSelector)(apiRef);
            if (currentModel !== props.detailPanelExpandedRowIds) {
                apiRef.current.setExpandedDetailPanels(props.detailPanelExpandedRowIds);
            }
        }
    }, [apiRef, props.detailPanelExpandedRowIds]);
    var updateCaches = React.useCallback(function () {
        if (!props.getDetailPanelContent) {
            return;
        }
        apiRef.current.setState(function (state) {
            return __assign(__assign({}, state), { detailPanel: __assign(__assign({}, state.detailPanel), cacheContentAndHeight(apiRef, props.getDetailPanelContent, props.getDetailPanelHeight, state.detailPanel.heightCache)) });
        });
    }, [apiRef, props.getDetailPanelContent, props.getDetailPanelHeight]);
    (0, x_data_grid_1.useGridEvent)(apiRef, 'sortedRowsSet', updateCaches);
    var previousGetDetailPanelContentProp = React.useRef(undefined);
    var previousGetDetailPanelHeightProp = React.useRef(undefined);
    var updateCachesIfNeeded = React.useCallback(function () {
        if (props.getDetailPanelContent === previousGetDetailPanelContentProp.current &&
            props.getDetailPanelHeight === previousGetDetailPanelHeightProp.current) {
            return;
        }
        apiRef.current.setState(function (state) {
            return __assign(__assign({}, state), { detailPanel: __assign(__assign({}, state.detailPanel), cacheContentAndHeight(apiRef, props.getDetailPanelContent, props.getDetailPanelHeight, state.detailPanel.heightCache)) });
        });
        previousGetDetailPanelContentProp.current = props.getDetailPanelContent;
        previousGetDetailPanelHeightProp.current = props.getDetailPanelHeight;
    }, [apiRef, props.getDetailPanelContent, props.getDetailPanelHeight]);
    var addDetailHeight = React.useCallback(function (initialValue, row) {
        var _a, _b;
        var expandedRowIds = (0, gridDetailPanelSelector_1.gridDetailPanelExpandedRowIdsSelector)(apiRef);
        if (!expandedRowIds || !expandedRowIds.has(row.id)) {
            initialValue.detail = 0;
            return initialValue;
        }
        updateCachesIfNeeded();
        var heightCache = (0, gridDetailPanelSelector_1.gridDetailPanelRawHeightCacheSelector)(apiRef);
        initialValue.detail = (_b = (_a = heightCache[row.id]) === null || _a === void 0 ? void 0 : _a.height) !== null && _b !== void 0 ? _b : 0; // Fallback to zero because the cache might not be ready yet (for example page was changed)
        return initialValue;
    }, [apiRef, updateCachesIfNeeded]);
    var enabled = props.getDetailPanelContent !== undefined;
    (0, internals_1.useGridRegisterPipeProcessor)(apiRef, 'rowHeight', addDetailHeight, enabled);
    var isFirstRender = React.useRef(true);
    if (isFirstRender.current) {
        updateCachesIfNeeded();
    }
    React.useEffect(function () {
        if (!isFirstRender.current) {
            updateCachesIfNeeded();
        }
        isFirstRender.current = false;
    }, [apiRef, updateCachesIfNeeded]);
};
exports.useGridDetailPanel = useGridDetailPanel;
