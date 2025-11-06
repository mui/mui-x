"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGridBooleanOperators = void 0;
var GridFilterInputBoolean_1 = require("../components/panel/filterPanel/GridFilterInputBoolean");
var getGridBooleanOperators = function () { return [
    {
        value: 'is',
        getApplyFilterFn: function (filterItem) {
            var sanitizedValue = (0, GridFilterInputBoolean_1.sanitizeFilterItemValue)(filterItem.value);
            if (sanitizedValue === undefined) {
                return null;
            }
            return function (value) { return Boolean(value) === sanitizedValue; };
        },
        InputComponent: GridFilterInputBoolean_1.GridFilterInputBoolean,
    },
]; };
exports.getGridBooleanOperators = getGridBooleanOperators;
