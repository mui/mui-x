"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridRowAriaAttributesPremium = void 0;
var internals_1 = require("@mui/x-data-grid-pro/internals");
var useGridPrivateApiContext_1 = require("../../utils/useGridPrivateApiContext");
var gridRowGroupingSelector_1 = require("../rowGrouping/gridRowGroupingSelector");
var useGridRowAriaAttributesPremium = function () {
    var apiRef = (0, useGridPrivateApiContext_1.useGridPrivateApiContext)();
    var gridRowGroupingModel = (0, internals_1.useGridSelector)(apiRef, gridRowGroupingSelector_1.gridRowGroupingSanitizedModelSelector);
    return (0, internals_1.useGridRowAriaAttributesPro)(gridRowGroupingModel.length > 0);
};
exports.useGridRowAriaAttributesPremium = useGridRowAriaAttributesPremium;
