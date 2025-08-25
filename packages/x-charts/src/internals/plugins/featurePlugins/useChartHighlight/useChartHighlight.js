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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChartHighlight = void 0;
var useAssertModelConsistency_1 = require("@mui/x-internals/useAssertModelConsistency");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var fastObjectShallowCompare_1 = require("@mui/x-internals/fastObjectShallowCompare");
var useChartHighlight = function (_a) {
    var store = _a.store, params = _a.params;
    (0, useAssertModelConsistency_1.useAssertModelConsistency)({
        warningPrefix: 'MUI X Charts',
        componentName: 'Chart',
        propName: 'highlightedItem',
        controlled: params.highlightedItem,
        defaultValue: null,
    });
    (0, useEnhancedEffect_1.default)(function () {
        store.update(function (prevState) {
            return prevState.highlight.item === params.highlightedItem
                ? prevState
                : __assign(__assign({}, prevState), { highlight: __assign(__assign({}, prevState.highlight), { item: params.highlightedItem }) });
        });
    }, [store, params.highlightedItem]);
    var clearHighlight = (0, useEventCallback_1.default)(function () {
        var _a;
        (_a = params.onHighlightChange) === null || _a === void 0 ? void 0 : _a.call(params, null);
        store.update(function (prev) { return (__assign(__assign({}, prev), { highlight: { item: null } })); });
    });
    var setHighlight = (0, useEventCallback_1.default)(function (newItem) {
        var _a;
        var prevItem = store.getSnapshot().highlight.item;
        if ((0, fastObjectShallowCompare_1.fastObjectShallowCompare)(prevItem, newItem)) {
            return;
        }
        (_a = params.onHighlightChange) === null || _a === void 0 ? void 0 : _a.call(params, newItem);
        store.update(function (prev) { return (__assign(__assign({}, prev), { highlight: { item: newItem } })); });
    });
    return {
        instance: {
            clearHighlight: clearHighlight,
            setHighlight: setHighlight,
        },
    };
};
exports.useChartHighlight = useChartHighlight;
exports.useChartHighlight.getDefaultizedParams = function (_a) {
    var _b;
    var params = _a.params;
    return (__assign(__assign({}, params), { highlightedItem: (_b = params.highlightedItem) !== null && _b !== void 0 ? _b : null }));
};
exports.useChartHighlight.getInitialState = function (params) { return ({
    highlight: { item: params.highlightedItem },
}); };
exports.useChartHighlight.params = {
    highlightedItem: true,
    onHighlightChange: true,
};
