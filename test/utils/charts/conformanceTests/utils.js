"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwMissingPropError = throwMissingPropError;
function throwMissingPropError(field) {
    throw new Error("missing \"".concat(field, "\" in options\n\n  > describeConformance(element, () => options)\n"));
}
