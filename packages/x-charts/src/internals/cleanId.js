"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanId = cleanId;
/**
 * Remove spaces to have viable ids
 */
function cleanId(id) {
    return id.replace(' ', '_');
}
