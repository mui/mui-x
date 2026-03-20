"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.SankeyNodeLabel = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var styles_1 = require("@mui/material/styles");
var sankeyHighlightHooks_1 = require("./sankeyHighlightHooks");
var sankeyClasses_1 = require("./sankeyClasses");
/**
 * @ignore - internal component.
 */
exports.SankeyNodeLabel = React.forwardRef(function SankeyNodeLabel(props, ref) {
    var _a, _b, _c, _d;
    var node = props.node, seriesId = props.seriesId;
    var theme = (0, styles_1.useTheme)();
    var x0 = (_a = node.x0) !== null && _a !== void 0 ? _a : 0;
    var y0 = (_b = node.y0) !== null && _b !== void 0 ? _b : 0;
    var x1 = (_c = node.x1) !== null && _c !== void 0 ? _c : 0;
    var y1 = (_d = node.y1) !== null && _d !== void 0 ? _d : 0;
    var isRightSide = node.depth === 0;
    // Determine label position
    var labelX = isRightSide
        ? x1 + 6 // Right side for first column
        : x0 - 6; // Left side for other columns
    var labelAnchor = isRightSide ? 'start' : 'end';
    var classes = (0, sankeyClasses_1.useUtilityClasses)();
    var highlightState = (0, sankeyHighlightHooks_1.useSankeyNodeHighlightState)(React.useMemo(function () { return ({
        type: 'sankey',
        subType: 'node',
        seriesId: seriesId,
        nodeId: node.id,
    }); }, [seriesId, node.id]));
    var opacity = 1;
    if (highlightState === 'faded') {
        opacity = 0.3;
    }
    else if (highlightState === 'highlighted') {
        opacity = 1;
    }
    if (!node.label) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)("text", { ref: ref, className: classes.nodeLabel, x: labelX, y: (y0 + y1) / 2, textAnchor: labelAnchor, fill: (theme.vars || theme).palette.text.primary, fontSize: theme.typography.caption.fontSize, fontFamily: theme.typography.fontFamily, pointerEvents: "none", opacity: opacity, "data-node": node.id, "data-highlighted": highlightState === 'highlighted' || undefined, "data-faded": highlightState === 'faded' || undefined, children: node.label }));
});
