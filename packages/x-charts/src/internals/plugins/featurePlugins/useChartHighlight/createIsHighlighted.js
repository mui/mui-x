"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIsHighlighted = createIsHighlighted;
function alwaysFalse() {
    return false;
}
function createIsHighlighted(highlightScope, highlightedItem) {
    if (!highlightScope || !highlightedItem) {
        return alwaysFalse;
    }
    return function isHighlighted(item) {
        if (!item) {
            return false;
        }
        if (highlightScope.highlight === 'series') {
            return item.seriesId === highlightedItem.seriesId;
        }
        if (highlightScope.highlight === 'item') {
            return (item.dataIndex === highlightedItem.dataIndex && item.seriesId === highlightedItem.seriesId);
        }
        return false;
    };
}
