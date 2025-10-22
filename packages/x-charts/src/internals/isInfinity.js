"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInfinity = isInfinity;
function isInfinity(v) {
    return typeof v === 'number' && !Number.isFinite(v);
}
