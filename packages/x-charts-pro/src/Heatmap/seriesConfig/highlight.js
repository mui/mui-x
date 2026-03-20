"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIsHighlighted = createIsHighlighted;
exports.createIsFaded = createIsFaded;
function alwaysFalse() {
    return false;
}
/**
 * The isHighlighted logic for main charts (those that are identified by an id and a dataIndex)
 */
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
            return (item.xIndex === highlightedItem.xIndex &&
                item.yIndex === highlightedItem.yIndex &&
                item.seriesId === highlightedItem.seriesId);
        }
        return false;
    };
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
            return (item.seriesId === highlightedItem.seriesId &&
                (item.xIndex !== highlightedItem.xIndex || item.yIndex !== highlightedItem.yIndex));
        }
        if (highlightScope.fade === 'global') {
            return (item.seriesId !== highlightedItem.seriesId ||
                item.xIndex !== highlightedItem.xIndex ||
                item.yIndex !== highlightedItem.yIndex);
        }
        return false;
    };
}
