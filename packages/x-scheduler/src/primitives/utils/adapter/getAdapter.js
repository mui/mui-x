"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdapter = getAdapter;
var AdapterLuxon_1 = require("./AdapterLuxon");
// TODO: Decide if we want to support several date libraries. If so, create a provider to avoid creating several instances of the adapter.
function getAdapter() {
    return new AdapterLuxon_1.AdapterLuxon();
}
