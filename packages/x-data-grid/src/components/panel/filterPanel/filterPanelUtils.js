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
exports.isSingleSelectColDef = isSingleSelectColDef;
exports.getValueOptions = getValueOptions;
exports.getValueFromValueOptions = getValueFromValueOptions;
function isSingleSelectColDef(colDef) {
    return (colDef === null || colDef === void 0 ? void 0 : colDef.type) === 'singleSelect';
}
function getValueOptions(column, additionalParams) {
    if (!column) {
        return undefined;
    }
    return typeof column.valueOptions === 'function'
        ? column.valueOptions(__assign({ field: column.field }, additionalParams))
        : column.valueOptions;
}
function getValueFromValueOptions(value, valueOptions, getOptionValue) {
    if (valueOptions === undefined) {
        return undefined;
    }
    var result = valueOptions.find(function (option) {
        var optionValue = getOptionValue(option);
        return String(optionValue) === String(value);
    });
    return getOptionValue(result);
}
