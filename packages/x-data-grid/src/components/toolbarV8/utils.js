"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortByDocumentPosition = sortByDocumentPosition;
/* eslint-disable no-bitwise */
function sortByDocumentPosition(a, b) {
    if (!a.ref.current || !b.ref.current) {
        return 0;
    }
    var position = a.ref.current.compareDocumentPosition(b.ref.current);
    if (!position) {
        return 0;
    }
    if (position & Node.DOCUMENT_POSITION_FOLLOWING ||
        position & Node.DOCUMENT_POSITION_CONTAINED_BY) {
        return -1;
    }
    if (position & Node.DOCUMENT_POSITION_PRECEDING || position & Node.DOCUMENT_POSITION_CONTAINS) {
        return 1;
    }
    return 0;
}
