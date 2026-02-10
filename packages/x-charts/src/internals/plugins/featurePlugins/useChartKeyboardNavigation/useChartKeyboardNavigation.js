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
var useChartSeries_selectors_1 = require("../../corePlugins/useChartSeries/useChartSeries.selectors");
var useChartSeriesConfig_1 = require("../../corePlugins/useChartSeriesConfig");
var useChartKeyboardNavigation = function (_a) {
    var params = _a.params, store = _a.store, instance = _a.instance;
    var svgRef = instance.svgRef;
    var removeFocus = (0, useEventCallback_1.default)(function removeFocus() {
        if (store.state.keyboardNavigation.item !== null) {
            store.set('keyboardNavigation', __assign(__assign({}, store.state.keyboardNavigation), { item: null }));
        }
    });
    React.useEffect(function () {
        var element = svgRef.current;
        if (!element || !params.enableKeyboardNavigation) {
            return undefined;
        }
        function keyboardHandler(event) {
            var _a, _b;
            var newFocusedItem = store.state.keyboardNavigation.item;
            var seriesConfig = (0, useChartSeriesConfig_1.selectorChartSeriesConfig)(store.state);
            var seriesType = newFocusedItem === null || newFocusedItem === void 0 ? void 0 : newFocusedItem.type;
            if (!seriesType) {
                seriesType = Object.keys((0, useChartSeries_selectors_1.selectorChartDefaultizedSeries)(store.state)).find(function (key) { return seriesConfig[key] !== undefined; });
                if (seriesType === undefined) {
                    return;
                }
            }
            var calculateFocusedItem = (_b = (_a = seriesConfig[seriesType]) === null || _a === void 0 ? void 0 : _a.keyboardFocusHandler) === null || _b === void 0 ? void 0 : _b.call(_a, event);
            if (!calculateFocusedItem) {
                return;
            }
            newFocusedItem = calculateFocusedItem(newFocusedItem, store.state);
            if (newFocusedItem !== store.state.keyboardNavigation.item) {
                event.preventDefault();
                store.update(__assign(__assign(__assign({}, (store.state.highlight && {
                    highlight: __assign(__assign({}, store.state.highlight), { lastUpdate: 'keyboard' }),
                })), (store.state.interaction && {
                    interaction: __assign(__assign({}, store.state.interaction), { lastUpdate: 'keyboard' }),
                })), { keyboardNavigation: __assign(__assign({}, store.state.keyboardNavigation), { item: newFocusedItem }) }));
            }
        }
        element.addEventListener('keydown', keyboardHandler);
        element.addEventListener('blur', removeFocus);
        return function () {
            element.removeEventListener('keydown', keyboardHandler);
            element.removeEventListener('blur', removeFocus);
        };
    }, [svgRef, removeFocus, params.enableKeyboardNavigation, store]);
    (0, useEnhancedEffect_1.default)(function () {
        if (store.state.keyboardNavigation.enableKeyboardNavigation !== params.enableKeyboardNavigation) {
            store.set('keyboardNavigation', __assign(__assign({}, store.state.keyboardNavigation), { enableKeyboardNavigation: !!params.enableKeyboardNavigation }));
        }
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
