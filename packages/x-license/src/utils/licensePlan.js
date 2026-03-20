"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLAN_VERSIONS = exports.PLAN_SCOPES = void 0;
exports.isPlanVersionOlderOrEqual = isPlanVersionOlderOrEqual;
exports.PLAN_SCOPES = ['pro', 'premium'];
exports.PLAN_VERSIONS = ['initial', 'Q3-2024', 'Q1-2026'];
/**
 * Checks if a plan version is older than or equal to the given threshold
 * using the ordering defined in PLAN_VERSIONS.
 * This can be reused for future major version gates
 * (e.g. v10 could set its own max plan version).
 */
function isPlanVersionOlderOrEqual(planVersion, maxVersion) {
    var index = exports.PLAN_VERSIONS.indexOf(planVersion);
    var maxIndex = exports.PLAN_VERSIONS.indexOf(maxVersion);
    return index !== -1 && index <= maxIndex;
}
