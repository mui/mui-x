"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLabel = getLabel;
function getLabel(value, location) {
    return typeof value === 'function' ? value(location) : value;
}
