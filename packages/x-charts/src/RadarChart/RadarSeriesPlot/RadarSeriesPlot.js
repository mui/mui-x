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
exports.RadarSeriesPlot = RadarSeriesPlot;
var jsx_runtime_1 = require("react/jsx-runtime");
var prop_types_1 = require("prop-types");
var useRadarSeriesData_1 = require("./useRadarSeriesData");
var useInteractionAllItemProps_1 = require("./useInteractionAllItemProps");
var useItemHighlightedGetter_1 = require("../../hooks/useItemHighlightedGetter");
var radarSeriesPlotClasses_1 = require("./radarSeriesPlotClasses");
var RadarSeriesArea_1 = require("./RadarSeriesArea");
var RadarSeriesMarks_1 = require("./RadarSeriesMarks");
var useRadarRotationIndex_1 = require("./useRadarRotationIndex");
function RadarSeriesPlot(props) {
    var inSeriesId = props.seriesId, inClasses = props.classes, onAreaClick = props.onAreaClick, onMarkClick = props.onMarkClick;
    var seriesCoordinates = (0, useRadarSeriesData_1.useRadarSeriesData)(inSeriesId);
    var getRotationIndex = (0, useRadarRotationIndex_1.useRadarRotationIndex)();
    var interactionProps = (0, useInteractionAllItemProps_1.useInteractionAllItemProps)(seriesCoordinates);
    var _a = (0, useItemHighlightedGetter_1.useItemHighlightedGetter)(), isFaded = _a.isFaded, isHighlighted = _a.isHighlighted;
    var classes = (0, radarSeriesPlotClasses_1.useUtilityClasses)(inClasses);
    return ((0, jsx_runtime_1.jsx)("g", { className: classes.root, children: seriesCoordinates === null || seriesCoordinates === void 0 ? void 0 : seriesCoordinates.map(function (_a, seriesIndex) {
            var seriesId = _a.seriesId, points = _a.points, color = _a.color, hideMark = _a.hideMark, fillArea = _a.fillArea, hidden = _a.hidden;
            if (hidden) {
                return null;
            }
            return ((0, jsx_runtime_1.jsxs)("g", { children: [(0, jsx_runtime_1.jsx)("path", __assign({}, (0, RadarSeriesArea_1.getPathProps)({
                        seriesId: seriesId,
                        points: points,
                        color: color,
                        fillArea: fillArea,
                        isFaded: isFaded,
                        isHighlighted: isHighlighted,
                        classes: classes,
                    }), { onClick: function (event) {
                            return onAreaClick === null || onAreaClick === void 0 ? void 0 : onAreaClick(event, {
                                type: 'radar',
                                seriesId: seriesId,
                                dataIndex: getRotationIndex(event),
                            });
                        }, cursor: onAreaClick ? 'pointer' : 'unset' }, interactionProps[seriesIndex]), seriesId), !hideMark &&
                        points.map(function (point, index) { return ((0, jsx_runtime_1.jsx)("circle", __assign({}, (0, RadarSeriesMarks_1.getCircleProps)({
                            seriesId: seriesId,
                            point: point,
                            color: point.color,
                            fillArea: fillArea,
                            isFaded: isFaded,
                            isHighlighted: isHighlighted,
                            classes: classes,
                        }), { onClick: function (event) {
                                return onMarkClick === null || onMarkClick === void 0 ? void 0 : onMarkClick(event, { type: 'radar', seriesId: seriesId, dataIndex: index });
                            }, cursor: onMarkClick ? 'pointer' : 'unset' }), index)); })] }, seriesId));
        }) }));
}
RadarSeriesPlot.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Override or extend the styles applied to the component.
     */
    classes: prop_types_1.default.object,
    /**
     * Callback fired when an area is clicked.
     * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
     * @param {RadarItemIdentifier} radarItemIdentifier The radar item identifier.
     */
    onAreaClick: prop_types_1.default.func,
    /**
     * Callback fired when a mark is clicked.
     * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
     * @param {RadarItemIdentifier} radarItemIdentifier The radar item identifier.
     */
    onMarkClick: prop_types_1.default.func,
    /**
     * The id of the series to display.
     * If undefined all series are displayed.
     */
    seriesId: prop_types_1.default.string,
};
