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
exports.SankeyNodeElement = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var internals_1 = require("@mui/x-charts/internals");
var sankeyHighlightHooks_1 = require("./sankeyHighlightHooks");
var sankeyClasses_1 = require("./sankeyClasses");
/**
 * @ignore - internal component.
 */
exports.SankeyNodeElement = React.forwardRef(function SankeyNodeElement(props, ref) {
    var _a, _b, _c, _d;
    var node = props.node, onClick = props.onClick, seriesId = props.seriesId;
    var x0 = (_a = node.x0) !== null && _a !== void 0 ? _a : 0;
    var y0 = (_b = node.y0) !== null && _b !== void 0 ? _b : 0;
    var x1 = (_c = node.x1) !== null && _c !== void 0 ? _c : 0;
    var y1 = (_d = node.y1) !== null && _d !== void 0 ? _d : 0;
    var nodeWidth = x1 - x0;
    var nodeHeight = y1 - y0;
    var identifier = {
        type: 'sankey',
        seriesId: seriesId,
        subType: 'node',
        nodeId: node.id,
        node: node,
    };
    var highlightState = (0, sankeyHighlightHooks_1.useSankeyNodeHighlightState)(identifier);
    var isFaded = highlightState === 'faded';
    var isHighlighted = highlightState === 'highlighted';
    // Add interaction props for tooltips
    var interactionProps = (0, internals_1.useInteractionItemProps)(identifier);
    var classes = (0, sankeyClasses_1.useUtilityClasses)();
    var handleClick = (0, useEventCallback_1.default)(function (event) {
        onClick === null || onClick === void 0 ? void 0 : onClick(event, identifier);
    });
    var opacity = 1;
    if (isFaded) {
        opacity = 0.3;
    }
    else if (isHighlighted) {
        opacity = 1;
    }
    return ((0, jsx_runtime_1.jsx)("rect", __assign({ x: node.x0, y: node.y0, width: nodeWidth, height: nodeHeight, fill: node.color, opacity: opacity, onClick: onClick ? handleClick : undefined, cursor: onClick ? 'pointer' : 'default', stroke: "none", "data-highlighted": isHighlighted || undefined, "data-faded": isFaded || undefined, ref: ref, "data-node": node.id, className: classes.node }, interactionProps)));
});
