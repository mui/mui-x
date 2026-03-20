"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStore = useStore;
var ChartsProvider_1 = require("../../context/ChartsProvider");
// This hook should be removed because user and us should not interact with the store directly, but with public/private APIs
function useStore() {
    var context = (0, ChartsProvider_1.useChartsContext)();
    if (!context) {
        throw new Error('MUI X Charts: Could not find the Charts context. ' +
            'This happens when the component is rendered outside of a ChartsContainer parent component. ' +
            'Wrap your component in a ChartsContainer or ChartsDataProvider.');
    }
    return context.store;
}
