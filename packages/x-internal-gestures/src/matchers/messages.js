"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messages = void 0;
exports.messages = {
    invalidClass: function () {
        return 'Expected a valid gesture class, but received invalid input or an instantiated class instead.';
    },
    invalidOrEmptyObjectParam: function (paramName) {
        return "Expected a non-empty ".concat(paramName, " object, but received invalid or empty ").concat(paramName, ".");
    },
    invalidObjectParam: function (paramName) {
        return "Expected valid ".concat(paramName, ", but received an invalid value.");
    },
    negationError: function (matcherName) {
        return "".concat(matcherName, " matcher does not support negation. Use expect().").concat(matcherName, "() instead of expect().not.").concat(matcherName, "().");
    },
};
