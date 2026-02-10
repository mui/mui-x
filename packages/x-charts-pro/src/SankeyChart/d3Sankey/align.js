"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sankeyLeft = sankeyLeft;
exports.sankeyRight = sankeyRight;
exports.sankeyJustify = sankeyJustify;
exports.sankeyCenter = sankeyCenter;
var d3_array_1 = require("@mui/x-charts-vendor/d3-array");
function targetDepth(d) {
    var _a;
    return (_a = d.target.depth) !== null && _a !== void 0 ? _a : 0;
}
/**
 * Compute the horizontal node position of a node in a Sankey layout with left alignment.
 * Returns (node.depth) to indicate the desired horizontal position of the node in the generated Sankey diagram.
 *
 * @param node Sankey node for which to calculate the horizontal node position.
 */
function sankeyLeft(node) {
    var _a;
    return (_a = node.depth) !== null && _a !== void 0 ? _a : 0;
}
/**
 * Compute the horizontal node position of a node in a Sankey layout with right alignment.
 * Returns (n - 1 - node.height) to indicate the desired horizontal position of the node in the generated Sankey diagram.
 *
 * @param node Sankey node for which to calculate the horizontal node position.
 * @param n Total depth n of the graph  (one plus the maximum node.depth)
 */
function sankeyRight(node, n) {
    var _a;
    return n - 1 - ((_a = node.height) !== null && _a !== void 0 ? _a : 0);
}
/**
 * Compute the horizontal node position of a node in a Sankey layout with justified alignment.
 * Like d3.sankeyLeft, except that nodes without any outgoing links are moved to the far right.
 * Returns an integer between 0 and n - 1 that indicates the desired horizontal position of the node in the generated Sankey diagram.
 *
 * @param node Sankey node for which to calculate the horizontal node position.
 * @param n Total depth n of the graph  (one plus the maximum node.depth)
 */
function sankeyJustify(node, n) {
    var _a, _b;
    return ((_a = node.sourceLinks) === null || _a === void 0 ? void 0 : _a.length) ? ((_b = node.depth) !== null && _b !== void 0 ? _b : 0) : n - 1;
}
/**
 * Compute the horizontal node position of a node in a Sankey layout with center alignment.
 * Like d3.sankeyLeft, except that nodes without any incoming links are moved as right as possible.
 * Returns an integer between 0 and n - 1 that indicates the desired horizontal position of the node in the generated Sankey diagram.
 *
 * @param node Sankey node for which to calculate the horizontal node position.
 */
function sankeyCenter(node) {
    var _a, _b, _c, _d;
    if ((_a = node.targetLinks) === null || _a === void 0 ? void 0 : _a.length) {
        return (_b = node.depth) !== null && _b !== void 0 ? _b : 0;
    }
    if ((_c = node.sourceLinks) === null || _c === void 0 ? void 0 : _c.length) {
        return ((_d = (0, d3_array_1.min)(node.sourceLinks, targetDepth)) !== null && _d !== void 0 ? _d : 0) - 1;
    }
    return 0;
}
