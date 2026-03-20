"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tooltipItemPositionGetter = function (params) {
    var _a, _b, _c, _d, _e, _f, _g;
    var series = params.series, seriesLayout = params.seriesLayout, identifier = params.identifier, placement = params.placement;
    if (!identifier) {
        return null;
    }
    var seriesItem = (_a = series.sankey) === null || _a === void 0 ? void 0 : _a.series[identifier.seriesId];
    var layout = (_c = (_b = seriesLayout.sankey) === null || _b === void 0 ? void 0 : _b[identifier.seriesId]) === null || _c === void 0 ? void 0 : _c.sankeyLayout;
    if (seriesItem == null || layout == null) {
        return null;
    }
    if (identifier.subType === 'node') {
        var node = layout.nodes.find(function (n) { return n.id === identifier.nodeId; });
        if (!node) {
            return null;
        }
        var _h = node.x0, x0 = _h === void 0 ? 0 : _h, _j = node.x1, x1 = _j === void 0 ? 0 : _j, _k = node.y0, y0 = _k === void 0 ? 0 : _k, _l = node.y1, y1 = _l === void 0 ? 0 : _l;
        switch (placement) {
            case 'bottom':
                return { x: (x1 + x0) / 2, y: y1 };
            case 'left':
                return { x: x0, y: (y1 + y0) / 2 };
            case 'right':
                return { x: x1, y: (y1 + y0) / 2 };
            case 'top':
            default:
                return { x: (x1 + x0) / 2, y: y0 };
        }
    }
    if (identifier.subType === 'link') {
        var link = layout.links.find(function (l) { return l.source.id === identifier.sourceId && l.target.id === identifier.targetId; });
        if (!link) {
            return null;
        }
        var _m = link.y0, yStart = _m === void 0 ? 0 : _m, _o = link.y1, yEnd = _o === void 0 ? 0 : _o;
        var y0 = Math.min(yStart, yEnd) - link.width / 2;
        var y1 = Math.max(yStart, yEnd) + link.width / 2;
        var x0 = Math.min((_d = link.source.x1) !== null && _d !== void 0 ? _d : 0, (_e = link.target.x1) !== null && _e !== void 0 ? _e : 0);
        var x1 = Math.max((_f = link.source.x0) !== null && _f !== void 0 ? _f : 0, (_g = link.target.x0) !== null && _g !== void 0 ? _g : 0);
        switch (placement) {
            case 'bottom':
                return { x: (x1 + x0) / 2, y: y1 };
            case 'left':
                return { x: x0, y: (y1 + y0) / 2 };
            case 'right':
                return { x: x1, y: (y1 + y0) / 2 };
            case 'top':
            default:
                return { x: (x1 + x0) / 2, y: y0 };
        }
    }
    return null;
};
exports.default = tooltipItemPositionGetter;
