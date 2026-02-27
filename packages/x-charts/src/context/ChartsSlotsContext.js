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
exports.ChartsSlotsContext = void 0;
exports.useChartsSlots = useChartsSlots;
exports.ChartsSlotsProvider = ChartsSlotsProvider;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
exports.ChartsSlotsContext = React.createContext(null);
/**
 * Get the slots and slotProps from the nearest `ChartDataProvider` or `ChartDataProviderPro`.
 * @returns {ChartsSlotsContextValue} The slots and slotProps from the context.
 */
function useChartsSlots() {
    var context = React.useContext(exports.ChartsSlotsContext);
    if (context == null) {
        throw new Error([
            'MUI X Charts: Could not find the Charts Slots context.',
            'It looks like you rendered your component outside of a ChartDataProvider.',
            'This can also happen if you are bundling multiple versions of the library.',
        ].join('\n'));
    }
    return context;
}
function ChartsSlotsProvider(props) {
    var slots = props.slots, _a = props.slotProps, slotProps = _a === void 0 ? {} : _a, defaultSlots = props.defaultSlots, children = props.children;
    var value = React.useMemo(function () { return ({ slots: __assign(__assign({}, defaultSlots), slots), slotProps: slotProps }); }, [defaultSlots, slots, slotProps]);
    return (0, jsx_runtime_1.jsx)(exports.ChartsSlotsContext.Provider, { value: value, children: children });
}
