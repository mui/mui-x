"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSeriesWithDefaultValues = void 0;
var d3Sankey_1 = require("../d3Sankey");
var utils_1 = require("../utils");
var defaultSankeyValueFormatter = function (v) { return (v == null ? '' : v.toLocaleString()); };
var getSeriesWithDefaultValues = function (seriesData, seriesIndex, colors) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    var nodeMap = new Map();
    var nodeColor = (_a = seriesData.nodeOptions) === null || _a === void 0 ? void 0 : _a.color;
    var nodeAlign = (_b = seriesData.nodeOptions) === null || _b === void 0 ? void 0 : _b.align;
    var _r = ((_c = seriesData.linkOptions) !== null && _c !== void 0 ? _c : {}).color, linkColor = _r === void 0 ? 'source' : _r;
    var colorIndex = -1;
    if (seriesData.data.nodes) {
        seriesData.data.nodes.forEach(function (node) {
            var _a, _b;
            var id = node.id || node.label || '';
            var label = node.label || "".concat(id);
            colorIndex += 1;
            nodeMap.set(id, __assign(__assign({}, node), { id: id, label: label, color: (_b = (_a = node.color) !== null && _a !== void 0 ? _a : nodeColor) !== null && _b !== void 0 ? _b : colors === null || colors === void 0 ? void 0 : colors[colorIndex % colors.length] }));
        });
    }
    var links = seriesData.data.links.map(function (link) {
        var _a, _b, _c, _d, _e;
        // Add default values to nodes
        if (!nodeMap.has(link.source)) {
            colorIndex += 1;
            var source = {
                id: link.source,
                label: "".concat(link.source),
                color: nodeColor !== null && nodeColor !== void 0 ? nodeColor : colors === null || colors === void 0 ? void 0 : colors[colorIndex % colors.length],
            };
            nodeMap.set(source.id, source);
        }
        if (!nodeMap.has(link.target)) {
            colorIndex += 1;
            var target = {
                id: link.target,
                label: "".concat(link.target),
                color: nodeColor !== null && nodeColor !== void 0 ? nodeColor : colors === null || colors === void 0 ? void 0 : colors[colorIndex % colors.length],
            };
            nodeMap.set(target.id, target);
        }
        // Add color to links
        var resolvedColor = (_a = link.color) !== null && _a !== void 0 ? _a : linkColor;
        if (resolvedColor === 'source') {
            resolvedColor = (_c = (_b = nodeMap.get(link.source)) === null || _b === void 0 ? void 0 : _b.color) !== null && _c !== void 0 ? _c : linkColor;
        }
        else if (resolvedColor === 'target') {
            resolvedColor = (_e = (_d = nodeMap.get(link.target)) === null || _d === void 0 ? void 0 : _d.color) !== null && _e !== void 0 ? _e : linkColor;
        }
        return __assign(__assign({}, link), { color: resolvedColor });
    });
    var highlightScope = {
        nodes: {
            highlight: (_e = (_d = seriesData.nodeOptions) === null || _d === void 0 ? void 0 : _d.highlight) !== null && _e !== void 0 ? _e : 'links',
            fade: (_g = (_f = seriesData.nodeOptions) === null || _f === void 0 ? void 0 : _f.fade) !== null && _g !== void 0 ? _g : 'none',
        },
        links: {
            highlight: (_j = (_h = seriesData.linkOptions) === null || _h === void 0 ? void 0 : _h.highlight) !== null && _j !== void 0 ? _j : 'links',
            fade: (_l = (_k = seriesData.linkOptions) === null || _k === void 0 ? void 0 : _k.fade) !== null && _l !== void 0 ? _l : 'none',
        },
    };
    if (!seriesData.data || !links) {
        return __assign(__assign({ id: (_m = seriesData.id) !== null && _m !== void 0 ? _m : "auto-generated-id-".concat(seriesIndex) }, seriesData), { valueFormatter: (_o = seriesData.valueFormatter) !== null && _o !== void 0 ? _o : defaultSankeyValueFormatter, data: { nodes: [], links: [] }, highlightScope: highlightScope });
    }
    //  Prepare the data structure expected by d3-sankey
    var graph = {
        nodes: nodeMap
            .values()
            .toArray()
            .map(function (v) { return (__assign({}, v)); }),
        links: links.map(function (v) { return (__assign({}, v)); }),
    };
    // Create the sankey layout generator
    var sankeyGenerator = (0, d3Sankey_1.sankey)(false)
        .nodeAlign((0, utils_1.getNodeAlignFunction)(nodeAlign))
        .nodeId(function (d) { return d.id; });
    // Generate the layout
    var data;
    try {
        data = sankeyGenerator(graph);
    }
    catch (error) {
        // There are two errors that can occur:
        // 1. If the data contains circular references, d3-sankey will throw an error.
        // 2. If there are missing source/target nodes, d3-sankey will throw an error.
        // We handle the second case by building a map of nodes ourselves, so they are always present.
        if (error instanceof Error && error.message === 'circular link') {
            throw new Error('MUI X Charts: Sankey diagram contains circular references.');
        }
        throw error;
    }
    return __assign(__assign({ id: (_p = seriesData.id) !== null && _p !== void 0 ? _p : "auto-generated-id-".concat(seriesIndex) }, seriesData), { valueFormatter: (_q = seriesData.valueFormatter) !== null && _q !== void 0 ? _q : defaultSankeyValueFormatter, highlightScope: highlightScope, data: data });
};
exports.getSeriesWithDefaultValues = getSeriesWithDefaultValues;
