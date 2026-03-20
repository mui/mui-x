"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tooltipGetter = void 0;
var tooltipGetter = function (params) {
    var identifier = params.identifier, series = params.series;
    if (!identifier) {
        return null;
    }
    var subType = identifier.subType;
    if (subType === 'node') {
        var node = series.data.nodes.find(function (n) { return n.id === identifier.nodeId; });
        if (!node) {
            return null;
        }
        return {
            identifier: identifier,
            color: node.color,
            label: "".concat(node.label, ":"),
            value: node.value,
            formattedValue: series.valueFormatter(node.value, {
                type: 'node',
                nodeId: node.id,
                location: 'tooltip',
            }),
            markType: 'square',
        };
    }
    if (subType === 'link') {
        var link = series.data.links.find(function (l) { return l.source.id === identifier.sourceId && l.target.id === identifier.targetId; });
        if (!link) {
            return null;
        }
        var sourceLabel = link.source.label;
        var targetLabel = link.target.label;
        return {
            identifier: identifier,
            color: link.color,
            label: "".concat(sourceLabel, " \u2192 ").concat(targetLabel, ":"),
            value: link.value,
            formattedValue: series.valueFormatter(link.value, {
                type: 'link',
                sourceId: link.source.id,
                targetId: link.target.id,
                location: 'tooltip',
            }),
            markType: 'line',
        };
    }
    return null;
};
exports.tooltipGetter = tooltipGetter;
