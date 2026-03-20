"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSankeyNodeHighlightState = useSankeyNodeHighlightState;
exports.useSankeyLinkHighlightState = useSankeyLinkHighlightState;
var internals_1 = require("@mui/x-charts/internals");
function useSankeyNodeHighlightState(nodeIdentifier) {
    var store = (0, internals_1.useStore)();
    return store.use(internals_1.selectorChartsHighlightState, nodeIdentifier);
}
function useSankeyLinkHighlightState(linkIdentifier) {
    var store = (0, internals_1.useStore)();
    return store.use(internals_1.selectorChartsHighlightState, linkIdentifier);
}
