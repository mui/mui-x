"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.SankeyLinkLabel = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var styles_1 = require("@mui/material/styles");
var useSankeySeries_1 = require("../hooks/useSankeySeries");
var sankeyClasses_1 = require("./sankeyClasses");
var getLinkMidpoint = function (link) {
    if (link.y0 === undefined || link.y1 === undefined) {
        return { x: 0, y: 0 };
    }
    // For Sankey links, we can calculate the midpoint using the source and target positions
    var sourceX = link.source.x1 || 0;
    var sourceY = (link.y0 + link.y1) / 2;
    var targetX = link.target.x0 || 0;
    var targetY = (link.y0 + link.y1) / 2;
    return {
        x: (sourceX + targetX) / 2,
        y: (sourceY + targetY) / 2,
    };
};
/**
 * @ignore - internal component.
 */
exports.SankeyLinkLabel = React.forwardRef(function SankeyLinkLabel(props, ref) {
    var link = props.link;
    var theme = (0, styles_1.useTheme)();
    var series = (0, useSankeySeries_1.useSankeySeries)()[0];
    var classes = (0, sankeyClasses_1.useUtilityClasses)();
    if (!link.path || link.y0 === undefined || link.y1 === undefined) {
        return null; // No path defined or invalid coordinates, nothing to render
    }
    var midpoint = getLinkMidpoint(link);
    // Get the series data and valueFormatter
    var formattedValue = (series === null || series === void 0 ? void 0 : series.valueFormatter)
        ? series.valueFormatter(link.value, {
            type: 'link',
            sourceId: link.source.id,
            targetId: link.target.id,
            location: 'label',
        })
        : link.value;
    return ((0, jsx_runtime_1.jsx)("text", { ref: ref, className: classes.linkLabel, x: midpoint.x, y: midpoint.y, textAnchor: "middle", dominantBaseline: "middle", fontSize: theme.typography.caption.fontSize, fill: (theme.vars || theme).palette.text.primary, "data-link-source": link.source.id, "data-link-target": link.target.id, fontFamily: theme.typography.fontFamily, pointerEvents: "none", children: formattedValue }));
});
