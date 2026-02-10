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
exports.getCircleProps = getCircleProps;
exports.RadarSeriesMarks = RadarSeriesMarks;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var clsx_1 = require("clsx");
var prop_types_1 = require("prop-types");
var useRadarSeriesData_1 = require("./useRadarSeriesData");
var useItemHighlightedGetter_1 = require("../../hooks/useItemHighlightedGetter");
var radarSeriesPlotClasses_1 = require("./radarSeriesPlotClasses");
function getCircleProps(params) {
    var isHighlighted = params.isHighlighted, isFaded = params.isFaded, seriesId = params.seriesId, classes = params.classes, point = params.point, fillArea = params.fillArea, color = params.color;
    var isItemHighlighted = isHighlighted({ seriesId: seriesId });
    var isItemFaded = !isItemHighlighted && isFaded({ seriesId: seriesId });
    return {
        cx: point.x,
        cy: point.y,
        r: 3,
        fill: color,
        stroke: color,
        opacity: fillArea && isItemFaded ? 0.5 : 1,
        className: (0, clsx_1.clsx)(classes.mark, (isItemHighlighted && classes.highlighted) || (isItemFaded && classes.faded)),
    };
}
function RadarSeriesMarks(props) {
    var seriesId = props.seriesId, onItemClick = props.onItemClick, other = __rest(props, ["seriesId", "onItemClick"]);
    var seriesCoordinates = (0, useRadarSeriesData_1.useRadarSeriesData)(props.seriesId);
    var classes = (0, radarSeriesPlotClasses_1.useUtilityClasses)(props.classes);
    var _a = (0, useItemHighlightedGetter_1.useItemHighlightedGetter)(), isFaded = _a.isFaded, isHighlighted = _a.isHighlighted;
    return ((0, jsx_runtime_1.jsx)(React.Fragment, { children: seriesCoordinates === null || seriesCoordinates === void 0 ? void 0 : seriesCoordinates.map(function (_a) {
            var id = _a.seriesId, points = _a.points, hideMark = _a.hideMark, fillArea = _a.fillArea, hidden = _a.hidden;
            if (hideMark || hidden) {
                return null;
            }
            return ((0, jsx_runtime_1.jsx)("g", { children: points.map(function (point, index) { return ((0, jsx_runtime_1.jsx)("circle", __assign({}, getCircleProps({
                    seriesId: id,
                    point: point,
                    color: point.color,
                    fillArea: fillArea,
                    isFaded: isFaded,
                    isHighlighted: isHighlighted,
                    classes: classes,
                }), { pointerEvents: onItemClick ? undefined : 'none', onClick: function (event) {
                        return onItemClick === null || onItemClick === void 0 ? void 0 : onItemClick(event, { type: 'radar', seriesId: id, dataIndex: index });
                    }, cursor: onItemClick ? 'pointer' : 'unset' }, other), index)); }) }, id));
        }) }));
}
RadarSeriesMarks.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Override or extend the styles applied to the component.
     */
    classes: prop_types_1.default.object,
    /**
     * Callback fired when a mark is clicked.
     * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
     * @param {RadarItemIdentifier} radarItemIdentifier The radar item identifier.
     */
    onItemClick: prop_types_1.default.func,
    /**
     * The id of the series to display.
     * If undefined all series are displayed.
     */
    seriesId: prop_types_1.default.string,
};
