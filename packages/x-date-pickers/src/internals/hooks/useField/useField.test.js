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
var useField_utils_1 = require("./useField.utils");
var COMMON_PROPERTIES = {
    startSeparator: '',
    endSeparator: '',
    contentType: 'digit',
    type: 'year',
    modified: false,
    format: 'YYYY',
    hasLeadingZerosInFormat: true,
    maxLength: 4,
};
var DEFAULT_LOCALIZED_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
describe('useField utility functions', function () {
    describe('getSectionVisibleValue', function () {
        it('should not add invisible space when target = "non-input"', function () {
            expect((0, useField_utils_1.getSectionVisibleValue)(__assign(__assign({}, COMMON_PROPERTIES), { value: '1', placeholder: '', hasLeadingZerosInInput: true }), 'non-input', DEFAULT_LOCALIZED_DIGITS)).to.equal('1');
        });
        it('should add invisible space when target = "input-ltr" and the value is a single digit with non-trailing zeroes', function () {
            expect((0, useField_utils_1.getSectionVisibleValue)(__assign(__assign({}, COMMON_PROPERTIES), { value: '1', placeholder: '', hasLeadingZerosInInput: false }), 'input-ltr', DEFAULT_LOCALIZED_DIGITS)).to.equal('1\u200e');
        });
        it('should add invisible space and RTL boundaries when target = "input-rtl" and the value is a single digit with non-trailing zeroes', function () {
            expect((0, useField_utils_1.getSectionVisibleValue)(__assign(__assign({}, COMMON_PROPERTIES), { value: '1', placeholder: '', hasLeadingZerosInInput: false }), 'input-rtl', DEFAULT_LOCALIZED_DIGITS)).to.equal('\u20681\u200e\u2069');
        });
        it('should add RTL boundaries when target = "input-rtl"', function () {
            expect((0, useField_utils_1.getSectionVisibleValue)(__assign(__assign({}, COMMON_PROPERTIES), { value: '1', placeholder: '', hasLeadingZerosInInput: true }), 'input-rtl', DEFAULT_LOCALIZED_DIGITS)).to.equal('\u20681\u2069');
        });
    });
    describe('parseSelectedSections', function () {
        it('should return null when selectedSections is not available in sections', function () {
            expect((0, useField_utils_1.parseSelectedSections)('year', [])).to.equal(null);
        });
    });
});
