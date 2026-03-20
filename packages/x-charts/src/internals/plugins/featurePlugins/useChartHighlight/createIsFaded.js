"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIsFaded = createIsFaded;
function alwaysFalse() {
    return false;
}
/**
 * The isFade logic for main charts (those that are identified by an id and a dataIndex)
 */
function createIsFaded(highlightScope, highlightedItem) {
    if (!highlightScope || !highlightedItem) {
        return alwaysFalse;
    }
    return function isFaded(item) {
        if (!item) {
            return false;
        }
        if (highlightScope.fade === 'series') {
            return (item.seriesId === highlightedItem.seriesId && item.dataIndex !== highlightedItem.dataIndex);
        }
        if (highlightScope.fade === 'global') {
            return (item.seriesId !== highlightedItem.seriesId || item.dataIndex !== highlightedItem.dataIndex);
        }
        return false;
    };
}
