"use strict";
'use client';
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
exports.calculateSankeyLayout = calculateSankeyLayout;
exports.improvedNaiveSankeyLinkPathHorizontal = improvedNaiveSankeyLinkPathHorizontal;
var d3_path_1 = require("@mui/x-charts-vendor/d3-path");
var d3Sankey_1 = require("./d3Sankey");
var utils_1 = require("./utils");
/**
 * Calculates the layout for a Sankey diagram using d3-sankey
 *
 * @param data The Sankey data (nodes and links)
 * @param drawingArea The drawing area dimensions
 * @param options Layout configuration options
 * @returns The calculated layout
 */
function calculateSankeyLayout(series, drawingArea) {
    var data = series.data, _a = series.iterations, iterations = _a === void 0 ? 6 : _a, nodeOptions = series.nodeOptions, linkOptions = series.linkOptions;
    var _b = nodeOptions !== null && nodeOptions !== void 0 ? nodeOptions : {}, _c = _b.width, nodeWidth = _c === void 0 ? 15 : _c, _d = _b.padding, nodePadding = _d === void 0 ? 10 : _d, nodeAlign = _b.align, nodeSort = _b.sort;
    var _e = linkOptions !== null && linkOptions !== void 0 ? linkOptions : {}, linkSort = _e.sort, _f = _e.curveCorrection, curveCorrection = _f === void 0 ? 10 : _f;
    if (!data || !data.links) {
        return { nodes: [], links: [] };
    }
    var width = drawingArea.width, height = drawingArea.height, left = drawingArea.left, top = drawingArea.top, bottom = drawingArea.bottom, right = drawingArea.right;
    // Create the sankey layout generator
    var sankeyGenerator = (0, d3Sankey_1.sankey)(true)
        .nodeWidth(nodeWidth)
        .nodePadding(nodePadding)
        .nodeAlign((0, utils_1.getNodeAlignFunction)(nodeAlign))
        .nodeId(function (d) { return d.id; })
        .extent([
        [left, top],
        [width + right, height + bottom],
    ])
        .iterations(iterations);
    // For 'auto' or undefined, don't set anything (use d3-sankey default behavior)
    if (typeof nodeSort === 'function') {
        sankeyGenerator.nodeSort(nodeSort);
    }
    else if (nodeSort === 'fixed') {
        // Null is not accepted by the types.
        // https://github.com/DefinitelyTyped/DefinitelyTyped/pull/73953
        sankeyGenerator.nodeSort(null);
    }
    if (typeof linkSort === 'function') {
        sankeyGenerator.linkSort(linkSort);
    }
    else if (linkSort === 'fixed') {
        // Null is not accepted by the types.
        sankeyGenerator.linkSort(null);
    }
    // Generate the layout
    var result;
    try {
        result = sankeyGenerator(data);
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
    var nodes = result.nodes, links = result.links;
    // Convert d3-sankey links to our format
    var layoutLinks = links.map(function (link) {
        var rep = __assign(__assign({}, link), { path: improvedNaiveSankeyLinkPathHorizontal(link, curveCorrection) });
        return rep;
    });
    return {
        nodes: nodes,
        links: layoutLinks,
    };
}
function improvedNaiveSankeyLinkPathHorizontal(link, curveCorrection) {
    var sx = link.source.x1;
    var tx = link.target.x0;
    // Weirdly this seems to work for any chart or node width change
    // But needs to be changed when the sankey height changes.
    var correction = curveCorrection !== null && curveCorrection !== void 0 ? curveCorrection : 5;
    var y0 = link.y0;
    var y1 = link.y1;
    var w = link.width;
    var halfW = w / 2;
    var sy0 = y0 - halfW;
    var sy1 = y0 + halfW;
    var ty0 = y1 - halfW;
    var ty1 = y1 + halfW;
    var halfX = (tx - sx) / 2;
    var p = (0, d3_path_1.path)();
    p.moveTo(sx, sy0);
    var isDecreasing = y0 > y1;
    var direction = isDecreasing ? -1 : 1;
    var cpx1 = sx + halfX + correction * direction;
    var cpy1 = sy0;
    var cpx2 = sx + halfX + correction * direction;
    var cpy2 = ty0;
    p.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, tx, ty0);
    p.lineTo(tx, ty1);
    cpx1 = sx + halfX - correction * direction;
    cpy1 = ty1;
    cpx2 = sx + halfX - correction * direction;
    cpy2 = sy1;
    p.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, sx, sy1);
    p.lineTo(sx, sy0);
    return p.toString();
}
