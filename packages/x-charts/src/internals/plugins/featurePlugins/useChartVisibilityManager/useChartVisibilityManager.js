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
exports.useChartVisibilityManager = void 0;
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var useEffectAfterFirstRender_1 = require("@mui/x-internals/useEffectAfterFirstRender");
var useChartVisibilityManager_selectors_1 = require("./useChartVisibilityManager.selectors");
var visibilityParamToMap_1 = require("./visibilityParamToMap");
var useChartVisibilityManager = function (_a) {
    var store = _a.store, params = _a.params, instance = _a.instance;
    // Manage controlled state
    (0, useEffectAfterFirstRender_1.useEffectAfterFirstRender)(function () {
        if (params.hiddenItems === undefined) {
            return;
        }
        if (process.env.NODE_ENV !== 'production' && !store.state.visibilityManager.isControlled) {
            console.error([
                "MUI X Charts: A chart component is changing the `hiddenItems` from uncontrolled to controlled.",
                'Elements should not switch from uncontrolled to controlled (or vice versa).',
                'Decide between using a controlled or uncontrolled for the lifetime of the component.',
                "The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.",
                'More info: https://fb.me/react-controlled-components',
            ].join('\n'));
        }
        store.set('visibilityManager', __assign(__assign({}, store.state.visibilityManager), { visibilityMap: (0, visibilityParamToMap_1.visibilityParamToMap)(params.hiddenItems, store.state.seriesConfig.config) }));
    }, [store, params.hiddenItems]);
    var hideItem = (0, useEventCallback_1.default)(function (identifier) {
        var _a;
        var visibilityMap = store.state.visibilityManager.visibilityMap;
        var id = instance.serializeIdentifier(identifier);
        if (visibilityMap.has(id)) {
            return;
        }
        var newVisibilityMap = new Map(visibilityMap);
        newVisibilityMap.set(id, identifier);
        store.set('visibilityManager', __assign(__assign({}, store.state.visibilityManager), { visibilityMap: newVisibilityMap }));
        (_a = params.onHiddenItemsChange) === null || _a === void 0 ? void 0 : _a.call(params, Array.from(newVisibilityMap.values()));
    });
    var showItem = (0, useEventCallback_1.default)(function (identifier) {
        var _a;
        var visibilityMap = store.state.visibilityManager.visibilityMap;
        var id = instance.serializeIdentifier(identifier);
        if (!visibilityMap.has(id)) {
            return;
        }
        var newVisibilityMap = new Map(visibilityMap);
        newVisibilityMap.delete(id);
        store.set('visibilityManager', __assign(__assign({}, store.state.visibilityManager), { visibilityMap: newVisibilityMap }));
        (_a = params.onHiddenItemsChange) === null || _a === void 0 ? void 0 : _a.call(params, Array.from(newVisibilityMap.values()));
    });
    var toggleItem = (0, useEventCallback_1.default)(function (identifier) {
        var visibilityMap = store.state.visibilityManager.visibilityMap;
        var id = instance.serializeIdentifier(identifier);
        if (visibilityMap.has(id)) {
            showItem(identifier);
        }
        else {
            hideItem(identifier);
        }
    });
    return {
        instance: {
            hideItem: hideItem,
            showItem: showItem,
            toggleItemVisibility: toggleItem,
        },
    };
};
exports.useChartVisibilityManager = useChartVisibilityManager;
exports.useChartVisibilityManager.getInitialState = function (params, currentState) {
    var _a;
    var seriesConfig = currentState.seriesConfig.config;
    var initialItems = (_a = params.hiddenItems) !== null && _a !== void 0 ? _a : params.initialHiddenItems;
    return {
        visibilityManager: {
            visibilityMap: initialItems
                ? (0, visibilityParamToMap_1.visibilityParamToMap)(initialItems, seriesConfig)
                : useChartVisibilityManager_selectors_1.EMPTY_VISIBILITY_MAP,
            isControlled: params.hiddenItems !== undefined,
        },
    };
};
exports.useChartVisibilityManager.params = {
    onHiddenItemsChange: true,
    hiddenItems: true,
    initialHiddenItems: true,
};
