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
exports.SankeyLinkElement = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var internals_1 = require("@mui/x-charts/internals");
var sankeyHighlightHooks_1 = require("./sankeyHighlightHooks");
var sankeyClasses_1 = require("./sankeyClasses");
/**
 * @ignore - internal component.
 */
exports.SankeyLinkElement = React.forwardRef(function SankeyLinkElement(props, ref) {
    var link = props.link, _a = props.opacity, opacity = _a === void 0 ? 0.4 : _a, onClick = props.onClick, seriesId = props.seriesId;
    var identifier = {
        type: 'sankey',
        seriesId: seriesId,
        subType: 'link',
        targetId: link.target.id,
        sourceId: link.source.id,
        link: link,
    };
    var highlightState = (0, sankeyHighlightHooks_1.useSankeyLinkHighlightState)(identifier);
    var isFaded = highlightState === 'faded';
    var isHighlighted = highlightState === 'highlighted';
    // Add interaction props for tooltips
    var interactionProps = (0, internals_1.useInteractionItemProps)(identifier);
    var classes = (0, sankeyClasses_1.useUtilityClasses)();
    var handleClick = (0, useEventCallback_1.default)(function (event) {
        onClick === null || onClick === void 0 ? void 0 : onClick(event, identifier);
    });
    if (!link.path) {
        return null;
    }
    var finalOpacity = opacity;
    if (isFaded) {
        finalOpacity = opacity * 0.3;
    }
    else if (isHighlighted) {
        finalOpacity = Math.min(opacity * 1.2, 1);
    }
    return ((0, jsx_runtime_1.jsx)("path", __assign({ ref: ref, className: classes.link, d: link.path, fill: link.color, opacity: finalOpacity, "data-link-source": link.source.id, "data-link-target": link.target.id, "data-highlighted": isHighlighted || undefined, "data-faded": isFaded || undefined, onClick: onClick ? handleClick : undefined, cursor: onClick ? 'pointer' : 'default' }, interactionProps)));
});
