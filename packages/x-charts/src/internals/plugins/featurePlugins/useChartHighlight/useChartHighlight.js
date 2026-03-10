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
var warning_1 = require("@mui/x-internals/warning");
var useAssertModelConsistency_1 = require("@mui/x-internals/useAssertModelConsistency");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var fastObjectShallowCompare_1 = require("@mui/x-internals/fastObjectShallowCompare");
var useChartSeries_1 = require("../../corePlugins/useChartSeries/useChartSeries");
var useChartHighlight = function (_a) {
    var store = _a.store, params = _a.params, instance = _a.instance;
    (0, useAssertModelConsistency_1.useAssertModelConsistency)({
        warningPrefix: 'MUI X Charts',
        componentName: 'Chart',
        propName: 'highlightedItem',
        controlled: params.highlightedItem,
        defaultValue: null,
    });
    (0, useEnhancedEffect_1.default)(function () {
        if (store.state.highlight.item !== params.highlightedItem) {
            if (params.highlightedItem === null) {
                store.set('highlight', __assign(__assign({}, store.state.highlight), { item: null }));
                return;
            }
            var cleanItem = instance.identifierWithType(params.highlightedItem, 'highlightItem');
            var item = instance.cleanIdentifier(cleanItem, 'highlightItem');
            store.set('highlight', __assign(__assign({}, store.state.highlight), { item: item }));
        }
        if (process.env.NODE_ENV !== 'production') {
            if (params.highlightedItem !== undefined && !store.state.highlight.isControlled) {
                (0, warning_1.warnOnce)([
                    'MUI X Charts: The `highlightedItem` switched between controlled and uncontrolled state.',
                    'To remove the highlight when using controlled state, you must provide `null` to the `highlightedItem` prop instead of `undefined`.',
                ].join('\n'));
            }
        }
    }, [store, params.highlightedItem, instance]);
    var clearHighlight = (0, useEventCallback_1.default)(function () {
        var _a;
        (_a = params.onHighlightChange) === null || _a === void 0 ? void 0 : _a.call(params, null);
        var prevHighlight = store.state.highlight;
        if (prevHighlight.item === null || prevHighlight.isControlled) {
            return;
        }
        store.set('highlight', {
            item: null,
            lastUpdate: 'pointer',
            isControlled: false,
        });
    });
    var setHighlight = (0, useEventCallback_1.default)(function (newItem) {
        var _a;
        var prevHighlight = store.state.highlight;
        var identifierWithType = instance.identifierWithType(newItem, 'highlightItem');
        var cleanedIdentifier = instance.cleanIdentifier(identifierWithType, 'highlightItem');
        if ((0, fastObjectShallowCompare_1.fastObjectShallowCompare)(prevHighlight.item, cleanedIdentifier)) {
            return;
        }
        (_a = params.onHighlightChange) === null || _a === void 0 ? void 0 : _a.call(params, cleanedIdentifier);
        if (prevHighlight.isControlled) {
            return;
        }
        store.set('highlight', {
            item: cleanedIdentifier,
            lastUpdate: 'pointer',
            isControlled: false,
        });
    });
    return {
        instance: {
            clearHighlight: clearHighlight,
            setHighlight: setHighlight,
        },
    };
};
exports.useChartHighlight = useChartHighlight;
exports.useChartHighlight.getInitialState = function (params, currentState) { return ({
    highlight: {
        item: params.highlightedItem == null
            ? params.highlightedItem
            : (0, useChartSeries_1.createIdentifierWithType)(currentState)(
            // Need some as because the generic SeriesType can't be propagated to plugins methods.
            params.highlightedItem),
        lastUpdate: 'pointer',
        isControlled: params.highlightedItem !== undefined,
    },
}); };
exports.useChartHighlight.params = {
    highlightedItem: true,
    onHighlightChange: true,
};
