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
exports.useChartTooltip = void 0;
var useAssertModelConsistency_1 = require("@mui/x-internals/useAssertModelConsistency");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var fastObjectShallowCompare_1 = require("@mui/x-internals/fastObjectShallowCompare");
var useChartSeries_1 = require("../../corePlugins/useChartSeries/useChartSeries");
var useChartTooltip = function (_a) {
    var store = _a.store, params = _a.params, instance = _a.instance;
    (0, useAssertModelConsistency_1.useAssertModelConsistency)({
        warningPrefix: 'MUI X Charts',
        componentName: 'Chart',
        propName: 'tooltipItem',
        controlled: params.tooltipItem,
        defaultValue: null,
    });
    (0, useEnhancedEffect_1.default)(function () {
        if (store.state.tooltip.item !== params.tooltipItem) {
            var newItem = params.tooltipItem
                ? instance.identifierWithType(params.tooltipItem, 'seriesItem')
                : null;
            if (store.state.tooltip.item === null || newItem === null
                ? newItem !== store.state.tooltip.item
                : instance.serializeIdentifier(store.state.tooltip.item) !==
                    instance.serializeIdentifier(newItem)) {
                store.set('tooltip', __assign(__assign({}, store.state.tooltip), { item: newItem }));
            }
        }
    }, [store, instance, params.tooltipItem]);
    var removeTooltipItem = (0, useEventCallback_1.default)(function removeTooltipItem(itemToRemove) {
        var _a;
        var prevItem = store.state.tooltip.item;
        if (prevItem === null) {
            return; // Already null, nothing to do
        }
        if (!itemToRemove ||
            instance.serializeIdentifier(prevItem) ===
                instance.serializeIdentifier(instance.identifierWithType(itemToRemove, 'seriesItem'))) {
            // Remove the item is either
            // - no item provided, so we unconditionally remove it
            // - the provided item matches the current one
            (_a = params.onTooltipItemChange) === null || _a === void 0 ? void 0 : _a.call(params, null);
            if (!store.state.tooltip.itemIsControlled) {
                store.set('tooltip', __assign(__assign({}, store.state.tooltip), { item: null }));
            }
            return;
        }
    });
    var setTooltipItem = (0, useEventCallback_1.default)(function setTooltipItem(newItem) {
        var _a;
        if (!(0, fastObjectShallowCompare_1.fastObjectShallowCompare)(store.state.tooltip.item, newItem)) {
            (_a = params.onTooltipItemChange) === null || _a === void 0 ? void 0 : _a.call(params, newItem);
            if (!store.state.tooltip.itemIsControlled) {
                store.set('tooltip', __assign(__assign({}, store.state.tooltip), { item: newItem }));
            }
        }
    });
    return {
        instance: {
            setTooltipItem: setTooltipItem,
            removeTooltipItem: removeTooltipItem,
        },
    };
};
exports.useChartTooltip = useChartTooltip;
exports.useChartTooltip.getInitialState = function (params, currentState) { return ({
    tooltip: {
        itemIsControlled: params.tooltipItem !== undefined,
        item: params.tooltipItem == null
            ? null
            : (0, useChartSeries_1.createIdentifierWithType)(currentState)(
            // Need some as because the generic SeriesType can't be propagated to plugins methods.
            params.tooltipItem),
    },
}); };
exports.useChartTooltip.params = {
    tooltipItem: true,
    onTooltipItemChange: true,
};
