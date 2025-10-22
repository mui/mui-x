"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invertTextAnchor = invertTextAnchor;
function invertTextAnchor(textAnchor) {
    switch (textAnchor) {
        case 'start':
            return 'end';
        case 'end':
            return 'start';
        default:
            return textAnchor;
    }
}
