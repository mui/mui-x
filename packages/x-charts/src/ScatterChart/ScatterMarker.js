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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScatterMarker = ScatterMarker;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
function ScatterMarker(props) {
    var seriesId = props.seriesId, isFaded = props.isFaded, isHighlighted = props.isHighlighted, x = props.x, y = props.y, color = props.color, size = props.size, dataIndex = props.dataIndex, other = __rest(props, ["seriesId", "isFaded", "isHighlighted", "x", "y", "color", "size", "dataIndex"]);
    return ((0, jsx_runtime_1.jsx)("circle", __assign({ cx: 0, cy: 0, r: (isHighlighted ? 1.2 : 1) * size, transform: "translate(".concat(x, ", ").concat(y, ")"), fill: color, opacity: isFaded ? 0.3 : 1, cursor: other.onClick ? 'pointer' : 'unset' }, other)));
}
ScatterMarker.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * The fill color of the marker.
     */
    color: prop_types_1.default.string.isRequired,
    /**
     * The index of the data point.
     */
    dataIndex: prop_types_1.default.number.isRequired,
    /**
     * If `true`, the marker is faded.
     */
    isFaded: prop_types_1.default.bool.isRequired,
    /**
     * If `true`, the marker is highlighted.
     */
    isHighlighted: prop_types_1.default.bool.isRequired,
    /**
     * Callback fired when clicking on a scatter item.
     * @param {MouseEvent} event Mouse event recorded on the `<svg/>` element.
     */
    onClick: prop_types_1.default.func,
    /**
     * The series ID.
     */
    seriesId: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
    /**
     * The size of the marker.
     */
    size: prop_types_1.default.number.isRequired,
    /**
     * The x coordinate of the data point.
     */
    x: prop_types_1.default.number.isRequired,
    /**
     * The y coordinate of the data point.
     */
    y: prop_types_1.default.number.isRequired,
};
