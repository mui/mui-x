"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSankeyIsHighlighted = createSankeyIsHighlighted;
var DEFAULT_NODE_HIGHLIGHT = 'links';
var DEFAULT_LINK_HIGHLIGHT = 'links';
function alwaysFalse() {
    return false;
}
function isNodeHighlighted(highlightedItem, nodeHighlight, linkHighlight, item) {
    if (item.subType !== 'node') {
        return false;
    }
    var nodeId = item.nodeId;
    if (highlightedItem.subType === 'node' && highlightedItem.nodeId === nodeId) {
        return nodeHighlight !== 'none';
    }
    if (highlightedItem.subType === 'link') {
        if (!linkHighlight || linkHighlight === 'none' || linkHighlight === 'links') {
            return false;
        }
        var sourceId = highlightedItem.sourceId, targetId = highlightedItem.targetId;
        switch (linkHighlight) {
            case 'nodes':
                return nodeId === sourceId || nodeId === targetId;
            case 'source':
                return nodeId === sourceId;
            case 'target':
                return nodeId === targetId;
            default:
                return false;
        }
    }
    return false;
}
function isLinkHighlighted(highlightedItem, nodeHighlight, linkHighlight, item) {
    if (item.subType !== 'link') {
        return false;
    }
    var sourceId = item.sourceId, targetId = item.targetId;
    if (highlightedItem.subType === 'link' &&
        highlightedItem.sourceId === sourceId &&
        highlightedItem.targetId === targetId) {
        return linkHighlight !== 'none';
    }
    if (highlightedItem.subType === 'node') {
        if (!nodeHighlight || nodeHighlight === 'none' || nodeHighlight === 'nodes') {
            return false;
        }
        var highlightedNodeId = highlightedItem.nodeId;
        switch (nodeHighlight) {
            case 'links':
                return sourceId === highlightedNodeId || targetId === highlightedNodeId;
            case 'incoming':
                return targetId === highlightedNodeId;
            case 'outgoing':
                return sourceId === highlightedNodeId;
            default:
                return false;
        }
    }
    return false;
}
function createSankeyIsHighlighted(highlightScope, highlightedItem) {
    var _a, _b, _c, _d;
    if (!highlightedItem) {
        return alwaysFalse;
    }
    var nodeHighlight = (_b = (_a = highlightScope === null || highlightScope === void 0 ? void 0 : highlightScope.nodes) === null || _a === void 0 ? void 0 : _a.highlight) !== null && _b !== void 0 ? _b : DEFAULT_NODE_HIGHLIGHT;
    var linkHighlight = (_d = (_c = highlightScope === null || highlightScope === void 0 ? void 0 : highlightScope.links) === null || _c === void 0 ? void 0 : _c.highlight) !== null && _d !== void 0 ? _d : DEFAULT_LINK_HIGHLIGHT;
    return function isHighlighted(item) {
        if (!item || item.type !== 'sankey') {
            return false;
        }
        var sankeyItem = item;
        if (sankeyItem.subType === 'node') {
            return isNodeHighlighted(highlightedItem, nodeHighlight, linkHighlight, sankeyItem);
        }
        if (sankeyItem.subType === 'link') {
            return isLinkHighlighted(highlightedItem, nodeHighlight, linkHighlight, sankeyItem);
        }
        return false;
    };
}
