"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ====================================================================================================================
//
// Info: This file uses node.layer and not node.depth to navigate between nodes on the same level.
//
// - depth is the graph depth, starting at 0 on the left, increasing by 1 for each link to the right.
// - layer is the visual level of the node. It takes into consideration the node alignment (left/right/justify/center)
//
// ====================================================================================================================
var getFirstNode = function (_, state) {
    var _a;
    // If no node is defined, find the first node with layer = 0
    var seriesId = (_a = state.series.defaultizedSeries.sankey) === null || _a === void 0 ? void 0 : _a.seriesOrder[0];
    if (!seriesId || !state.series.defaultizedSeries.sankey) {
        return null;
    }
    var series = state.series.defaultizedSeries.sankey.series[seriesId];
    if (series.data.nodes.length > 0) {
        var index = series.data.nodes.findIndex(function (node) { return node.layer === 0; });
        return { seriesId: seriesId, type: 'sankey', subType: 'node', nodeId: series.data.nodes[index].id };
    }
    return null;
};
var getNodeToNode = function (step) {
    return function (currentItem, state) {
        var _a;
        if (currentItem && currentItem.subType === 'node') {
            var data = (_a = state.series.defaultizedSeries.sankey) === null || _a === void 0 ? void 0 : _a.series[currentItem.seriesId].data;
            var currentNodeIndex = data === null || data === void 0 ? void 0 : data.nodes.findIndex(function (node) { return node.id === currentItem.nodeId; });
            if (currentNodeIndex === undefined || currentNodeIndex < 0 || !data) {
                return getFirstNode(null, state);
            }
            var currentNode = data.nodes[currentNodeIndex];
            for (var i = 1; i <= data.nodes.length; i += 1) {
                var index = (data.nodes.length + currentNodeIndex + step * i) % data.nodes.length;
                if (data.nodes[index].layer === currentNode.layer) {
                    return {
                        seriesId: currentItem.seriesId,
                        type: 'sankey',
                        subType: 'node',
                        nodeId: data.nodes[index].id,
                    };
                }
            }
        }
        // If we fail, we fallback on the first node
        return getFirstNode(null, state);
    };
};
var getNodeToLink = function (step) {
    return function (currentItem, state) {
        var _a;
        if (currentItem && currentItem.subType === 'node') {
            var data = (_a = state.series.defaultizedSeries.sankey) === null || _a === void 0 ? void 0 : _a.series[currentItem.seriesId].data;
            var currentNodeIndex = data === null || data === void 0 ? void 0 : data.nodes.findIndex(function (node) { return node.id === currentItem.nodeId; });
            if (currentNodeIndex === undefined || currentNodeIndex < 0 || !data) {
                return getFirstNode(null, state);
            }
            var currentNode = data.nodes[currentNodeIndex];
            var links = step === 'source' ? currentNode.sourceLinks : currentNode.targetLinks;
            if (links.length === 0) {
                // No link in that direction, we stay where we are.
                return currentItem;
            }
            return {
                seriesId: currentItem.seriesId,
                type: 'sankey',
                subType: 'link',
                sourceId: links[0].source.id,
                targetId: links[0].target.id,
            };
        }
        // If we fail, we fallback on the first node
        return getFirstNode(null, state);
    };
};
var getLinkToNode = function (step) {
    return function (currentItem, state) {
        if (currentItem && currentItem.subType === 'link') {
            var nodeId = step === 'source' ? currentItem.sourceId : currentItem.targetId;
            return { seriesId: currentItem.seriesId, type: 'sankey', subType: 'node', nodeId: nodeId };
        }
        return getFirstNode(null, state);
    };
};
var getLinkToLink = function (step) {
    return function (currentItem, state) {
        var _a;
        if (currentItem && currentItem.subType === 'link') {
            var data = (_a = state.series.defaultizedSeries.sankey) === null || _a === void 0 ? void 0 : _a.series[currentItem.seriesId].data;
            var currentLinkIndex = data === null || data === void 0 ? void 0 : data.links.findIndex(function (link) {
                return link.source.id === currentItem.sourceId && link.target.id === currentItem.targetId;
            });
            if (currentLinkIndex === undefined || currentLinkIndex < 0 || !data) {
                return getFirstNode(null, state);
            }
            for (var i = 1; i <= data.links.length; i += 1) {
                var index = (data.links.length + currentLinkIndex + step * i) % data.links.length;
                if (data.links[index].source.id === currentItem.sourceId) {
                    return {
                        seriesId: currentItem.seriesId,
                        type: 'sankey',
                        subType: 'link',
                        sourceId: data.links[index].source.id,
                        targetId: data.links[index].target.id,
                    };
                }
            }
        }
        return getFirstNode(null, state);
    };
};
var keyboardFocusHandler = function (event) { return function (currentItem, state) {
    var isLink = (currentItem === null || currentItem === void 0 ? void 0 : currentItem.subType) === 'link';
    switch (event.key) {
        case 'ArrowDown':
            return isLink ? getLinkToLink(1)(currentItem, state) : getNodeToNode(1)(currentItem, state);
        case 'ArrowUp':
            return isLink
                ? getLinkToLink(-1)(currentItem, state)
                : getNodeToNode(-1)(currentItem, state);
        case 'ArrowRight':
            return isLink
                ? getLinkToNode('target')(currentItem, state)
                : getNodeToLink('source')(currentItem, state);
        case 'ArrowLeft':
            return isLink
                ? getLinkToNode('source')(currentItem, state)
                : getNodeToLink('target')(currentItem, state);
        default:
            return currentItem;
    }
}; };
exports.default = keyboardFocusHandler;
