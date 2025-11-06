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
exports.useGridAriaAttributesPremium = void 0;
var internals_1 = require("@mui/x-data-grid-pro/internals");
var gridRowGroupingSelector_1 = require("../features/rowGrouping/gridRowGroupingSelector");
var useGridPrivateApiContext_1 = require("./useGridPrivateApiContext");
var useGridAriaAttributesPremium = function () {
    var ariaAttributesPro = (0, internals_1.useGridAriaAttributesPro)();
    var apiRef = (0, useGridPrivateApiContext_1.useGridPrivateApiContext)();
    var gridRowGroupingModel = (0, internals_1.useGridSelector)(apiRef, gridRowGroupingSelector_1.gridRowGroupingSanitizedModelSelector);
    var ariaAttributesPremium = gridRowGroupingModel.length > 0 ? { role: 'treegrid' } : {};
    return __assign(__assign({}, ariaAttributesPro), ariaAttributesPremium);
};
exports.useGridAriaAttributesPremium = useGridAriaAttributesPremium;
