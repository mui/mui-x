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
exports.useChartKeyboardNavigation = void 0;
var React = require("react");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var useChartKeyboardNavigation_helpers_1 = require("./useChartKeyboardNavigation.helpers");
function getNextIndexFocusedItem(state) {
    var _a, _b, _c;
    var _d = (_a = state.keyboardNavigation.item) !== null && _a !== void 0 ? _a : {}, type = _d.type, seriesId = _d.seriesId;
    if (type === undefined ||
        // @ts-ignore sankey is not in MIT version
        type === 'sankey' ||
        seriesId === undefined ||
        !(0, useChartKeyboardNavigation_helpers_1.seriesHasData)(state.series.processedSeries, type, seriesId)) {
        var nextSeries = (0, useChartKeyboardNavigation_helpers_1.getNextSeriesWithData)(state.series.processedSeries, type, seriesId);
        if (nextSeries === null) {
            return null;
        }
        type = nextSeries.type;
        seriesId = nextSeries.seriesId;
    }
    var dataLength = state.series.processedSeries[type].series[seriesId].data.length;
    return {
        type: type,
        seriesId: seriesId,
        dataIndex: (((_c = (_b = state.keyboardNavigation.item) === null || _b === void 0 ? void 0 : _b.dataIndex) !== null && _c !== void 0 ? _c : -1) + 1) % dataLength,
    };
}
function getPreviousIndexFocusedItem(state) {
    var _a, _b, _c;
    var _d = (_a = state.keyboardNavigation.item) !== null && _a !== void 0 ? _a : {}, type = _d.type, seriesId = _d.seriesId;
    if (type === undefined ||
        // @ts-ignore sankey is not in MIT version
        type === 'sankey' ||
        seriesId === undefined ||
        !(0, useChartKeyboardNavigation_helpers_1.seriesHasData)(state.series.processedSeries, type, seriesId)) {
        var previousSeries = (0, useChartKeyboardNavigation_helpers_1.getPreviousSeriesWithData)(state.series.processedSeries, type, seriesId);
        if (previousSeries === null) {
            return null;
        }
        type = previousSeries.type;
        seriesId = previousSeries.seriesId;
    }
    var dataLength = state.series.processedSeries[type].series[seriesId].data.length;
    return {
        type: type,
        seriesId: seriesId,
        dataIndex: (dataLength + ((_c = (_b = state.keyboardNavigation.item) === null || _b === void 0 ? void 0 : _b.dataIndex) !== null && _c !== void 0 ? _c : 1) - 1) % dataLength,
    };
}
function getNextSeriesFocusedItem(state) {
    var _a, _b, _c;
    var _d = (_a = state.keyboardNavigation.item) !== null && _a !== void 0 ? _a : {}, type = _d.type, seriesId = _d.seriesId;
    var nextSeries = (0, useChartKeyboardNavigation_helpers_1.getNextSeriesWithData)(state.series.processedSeries, type, seriesId);
    if (nextSeries === null) {
        return null; // No series to move the focus to.
    }
    type = nextSeries.type;
    seriesId = nextSeries.seriesId;
    var dataLength = state.series.processedSeries[type].series[seriesId].data.length;
    return {
        type: type,
        seriesId: seriesId,
        dataIndex: Math.min(dataLength - 1, (_c = (_b = state.keyboardNavigation.item) === null || _b === void 0 ? void 0 : _b.dataIndex) !== null && _c !== void 0 ? _c : 0),
    };
}
function getPreviousSeriesFocusedItem(state) {
    var _a, _b, _c;
    var _d = (_a = state.keyboardNavigation.item) !== null && _a !== void 0 ? _a : {}, type = _d.type, seriesId = _d.seriesId;
    var previousSeries = (0, useChartKeyboardNavigation_helpers_1.getPreviousSeriesWithData)(state.series.processedSeries, type, seriesId);
    if (previousSeries === null) {
        return null; // No series to move the focus to.
    }
    type = previousSeries.type;
    seriesId = previousSeries.seriesId;
    var dataLength = state.series.processedSeries[type].series[seriesId].data.length;
    return {
        type: type,
        seriesId: seriesId,
        dataIndex: Math.min(dataLength - 1, (_c = (_b = state.keyboardNavigation.item) === null || _b === void 0 ? void 0 : _b.dataIndex) !== null && _c !== void 0 ? _c : 0),
    };
}
var useChartKeyboardNavigation = function (_a) {
    var params = _a.params, store = _a.store, svgRef = _a.svgRef;
    var removeFocus = (0, useEventCallback_1.default)(function removeFocus() {
        store.update(function (state) {
            if (state.keyboardNavigation.item === null) {
                return state;
            }
            return __assign(__assign({}, state), { keyboardNavigation: __assign(__assign({}, state.keyboardNavigation), { item: null }) });
        });
    });
    React.useEffect(function () {
        var element = svgRef.current;
        if (!element || !params.enableKeyboardNavigation) {
            return undefined;
        }
        function keyboardHandler(event) {
            store.update(function (prevState) {
                var newFocusedItem = prevState.keyboardNavigation.item;
                switch (event.key) {
                    case 'ArrowRight':
                        newFocusedItem = getNextIndexFocusedItem(prevState);
                        break;
                    case 'ArrowLeft':
                        newFocusedItem = getPreviousIndexFocusedItem(prevState);
                        break;
                    case 'ArrowDown': {
                        newFocusedItem = getPreviousSeriesFocusedItem(prevState);
                        break;
                    }
                    case 'ArrowUp': {
                        newFocusedItem = getNextSeriesFocusedItem(prevState);
                        break;
                    }
                    default:
                        break;
                }
                if (newFocusedItem !== prevState.keyboardNavigation.item) {
                    event.preventDefault();
                    return __assign(__assign(__assign(__assign({}, prevState), (prevState.highlight && {
                        highlight: __assign(__assign({}, prevState.highlight), { lastUpdate: 'keyboard' }),
                    })), (prevState.interaction && {
                        interaction: __assign(__assign({}, prevState.interaction), { lastUpdate: 'keyboard' }),
                    })), { keyboardNavigation: __assign(__assign({}, prevState.keyboardNavigation), { item: newFocusedItem }) });
                }
                return prevState;
            });
        }
        element.addEventListener('keydown', keyboardHandler);
        element.addEventListener('blur', removeFocus);
        return function () {
            element.removeEventListener('keydown', keyboardHandler);
            element.removeEventListener('blur', removeFocus);
        };
    }, [svgRef, removeFocus, params.enableKeyboardNavigation, store]);
    (0, useEnhancedEffect_1.default)(function () {
        return store.update(function (prev) {
            return prev.keyboardNavigation.enableKeyboardNavigation === params.enableKeyboardNavigation
                ? prev
                : __assign(__assign({}, prev), { keyboardNavigation: __assign(__assign({}, prev.keyboardNavigation), { enableKeyboardNavigation: !!params.enableKeyboardNavigation }) });
        });
    }, [store, params.enableKeyboardNavigation]);
    return {};
};
exports.useChartKeyboardNavigation = useChartKeyboardNavigation;
exports.useChartKeyboardNavigation.getInitialState = function (params) { return ({
    keyboardNavigation: {
        item: null,
        enableKeyboardNavigation: !!params.enableKeyboardNavigation,
    },
}); };
exports.useChartKeyboardNavigation.params = {
    enableKeyboardNavigation: true,
};
