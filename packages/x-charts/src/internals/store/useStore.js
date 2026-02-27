"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStore = useStore;
var ChartProvider_1 = require("../../context/ChartProvider");
// This hook should be removed because user and us should not interact with the store directly, but with public/private APIs
function useStore() {
    var context = (0, ChartProvider_1.useChartContext)();
    if (!context) {
        throw new Error([
            'MUI X Charts: Could not find the charts context.',
            'It looks like you rendered your component outside of a ChartContainer parent component.',
        ].join('\n'));
    }
    return context.store;
}
