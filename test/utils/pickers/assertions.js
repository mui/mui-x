"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expectFieldPlaceholderV6 = exports.expectFieldValueV6 = exports.expectFieldValueV7 = void 0;
exports.expectPickerChangeHandlerValue = expectPickerChangeHandlerValue;
var pickers_1 = require("test/utils/pickers");
var expectFieldValueV7 = function (fieldSectionsContainer, expectedValue, specialCase) {
    var _a;
    var value = (0, pickers_1.cleanText)((_a = fieldSectionsContainer.textContent) !== null && _a !== void 0 ? _a : '', specialCase);
    return expect(value).to.equal(expectedValue);
};
exports.expectFieldValueV7 = expectFieldValueV7;
var expectFieldValueV6 = function (input, expectedValue, specialCase) {
    var value = (0, pickers_1.cleanText)(input.value, specialCase);
    return expect(value).to.equal(expectedValue);
};
exports.expectFieldValueV6 = expectFieldValueV6;
var expectFieldPlaceholderV6 = function (input, placeholder, specialCase) {
    var cleanPlaceholder = (0, pickers_1.cleanText)(input.placeholder, specialCase);
    return expect(cleanPlaceholder).to.equal(placeholder);
};
exports.expectFieldPlaceholderV6 = expectFieldPlaceholderV6;
function expectPickerChangeHandlerValue(type, spyCallback, expectedValue) {
    if ((0, pickers_1.isPickerRangeType)(type)) {
        spyCallback.lastCall.firstArg.forEach(function (value, index) {
            expect(value).to.deep.equal(expectedValue[index]);
        });
    }
    else {
        expect(spyCallback.lastCall.firstArg).to.deep.equal(expectedValue);
    }
}
