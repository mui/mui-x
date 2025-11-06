"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultSearchPredicate = exports.checkColumnVisibilityModelsSame = void 0;
var checkColumnVisibilityModelsSame = function (a, b) {
    // Filter `false` values only, as `true` and not having a key are the same
    var aFalseValues = new Set(Object.keys(a).filter(function (key) { return a[key] === false; }));
    var bFalseValues = new Set(Object.keys(b).filter(function (key) { return b[key] === false; }));
    if (aFalseValues.size !== bFalseValues.size) {
        return false;
    }
    var result = true;
    aFalseValues.forEach(function (key) {
        if (!bFalseValues.has(key)) {
            result = false;
        }
    });
    return result;
};
exports.checkColumnVisibilityModelsSame = checkColumnVisibilityModelsSame;
var defaultSearchPredicate = function (column, searchValue) { return (column.headerName || column.field).toLowerCase().indexOf(searchValue) > -1; };
exports.defaultSearchPredicate = defaultSearchPredicate;
