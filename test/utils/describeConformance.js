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
exports.describeConformance = describeConformance;
var internal_test_utils_1 = require("@mui/internal-test-utils");
var styles_1 = require("@mui/material/styles");
function describeConformance(minimalElement, getOptions) {
    function getOptionsWithDefaults() {
        return __assign({ ThemeProvider: styles_1.ThemeProvider, createTheme: styles_1.createTheme }, getOptions());
    }
    return (0, internal_test_utils_1.describeConformance)(minimalElement, getOptionsWithDefaults);
}
