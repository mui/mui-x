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
        if (store.state.highlight.item !== params.highlightedItem) {
            store.set('highlight', __assign(__assign({}, store.state.highlight), { item: params.highlightedItem }));
        }
        if (process.env.NODE_ENV !== 'production') {
            if (params.highlightedItem !== undefined && !store.state.highlight.isControlled) {
                (0, warning_1.warnOnce)([
                    'MUI X Charts: The `highlightedItem` switched between controlled and uncontrolled state.',
                    'To remove the highlight when using controlled state, you must provide `null` to the `highlightedItem` prop instead of `undefined`.',
                ].join('\n'));
            }
        }
    }, [store, params.highlightedItem]);
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
        if ((0, fastObjectShallowCompare_1.fastObjectShallowCompare)(prevHighlight.item, newItem)) {
            return;
        }
        (_a = params.onHighlightChange) === null || _a === void 0 ? void 0 : _a.call(params, newItem);
        if (prevHighlight.isControlled) {
            return;
        }
        store.set('highlight', {
            item: newItem,
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
exports.useChartHighlight.getInitialState = function (params) { return ({
    highlight: {
        item: params.highlightedItem,
        lastUpdate: 'pointer',
        isControlled: params.highlightedItem !== undefined,
    },
}); };
exports.useChartHighlight.params = {
    highlightedItem: true,
    onHighlightChange: true,
};
