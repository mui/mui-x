"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAdapter = useAdapter;
var getAdapter_1 = require("./getAdapter");
function useAdapter() {
    // Temporary hook that mimics the behavior of a future `useAdapter` hook,
    // to ease migration once (the provider setup is ready.
    var adapter = (0, getAdapter_1.getAdapter)();
    return adapter;
}
