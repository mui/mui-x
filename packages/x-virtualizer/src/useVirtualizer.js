"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVirtualizer = void 0;
var useLazyRef_1 = require("@mui/utils/useLazyRef");
var store_1 = require("@mui/x-internals/store");
var colspan_1 = require("./features/colspan");
var dimensions_1 = require("./features/dimensions");
var keyboard_1 = require("./features/keyboard");
var rowspan_1 = require("./features/rowspan");
var virtualization_1 = require("./features/virtualization");
var FEATURES = [dimensions_1.Dimensions, virtualization_1.Virtualization, colspan_1.Colspan, rowspan_1.Rowspan, keyboard_1.Keyboard];
var useVirtualizer = function (params) {
    var store = (0, useLazyRef_1.default)(function () {
        return new store_1.Store(FEATURES.map(function (f) { return f.initialize(params); }).reduce(function (state, partial) { return Object.assign(state, partial); }, {}));
    }).current;
    var api = {};
    for (var _i = 0, FEATURES_1 = FEATURES; _i < FEATURES_1.length; _i++) {
        var feature = FEATURES_1[_i];
        Object.assign(api, feature.use(store, params, api));
    }
    return {
        store: store,
        api: api,
    };
};
exports.useVirtualizer = useVirtualizer;
