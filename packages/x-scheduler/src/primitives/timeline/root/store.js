"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectors = void 0;
var store_1 = require("@base-ui-components/utils/store");
exports.selectors = {
    items: (0, store_1.createSelector)(function (state) { return state.items; }),
};
