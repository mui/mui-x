"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObjectEmpty = isObjectEmpty;
function isObjectEmpty(object) {
    // eslint-disable-next-line
    for (var _ in object) {
        return false;
    }
    return true;
}
