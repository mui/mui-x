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
exports.useGridAriaAttributesPro = void 0;
var internals_1 = require("@mui/x-data-grid/internals");
var useGridRootProps_1 = require("./useGridRootProps");
var useGridAriaAttributesPro = function () {
    var ariaAttributesCommunity = (0, internals_1.useGridAriaAttributes)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var ariaAttributesPro = rootProps.treeData ? { role: 'treegrid' } : {};
    return __assign(__assign({}, ariaAttributesCommunity), ariaAttributesPro);
};
exports.useGridAriaAttributesPro = useGridAriaAttributesPro;
