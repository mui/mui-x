"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadarSeriesPlot = RadarSeriesPlot;
var React = require("react");
var prop_types_1 = require("prop-types");
var useRadarSeriesData_1 = require("./useRadarSeriesData");
var useInteractionItemProps_1 = require("../../hooks/useInteractionItemProps");
var useItemHighlightedGetter_1 = require("../../hooks/useItemHighlightedGetter");
var radarSeriesPlotClasses_1 = require("./radarSeriesPlotClasses");
var RadarSeriesArea_1 = require("./RadarSeriesArea");
var RadarSeriesMarks_1 = require("./RadarSeriesMarks");
var useRadarRotationIndex_1 = require("./useRadarRotationIndex");
function RadarSeriesPlot(props) {
    var inSeriesId = props.seriesId, inClasses = props.classes, onAreaClick = props.onAreaClick, onMarkClick = props.onMarkClick;
    var seriesCoordinates = (0, useRadarSeriesData_1.useRadarSeriesData)(inSeriesId);
    var getRotationIndex = (0, useRadarRotationIndex_1.useRadarRotationIndex)();
    var interactionProps = (0, useInteractionItemProps_1.useInteractionAllItemProps)(seriesCoordinates);
    var _a = (0, useItemHighlightedGetter_1.useItemHighlightedGetter)(), isFaded = _a.isFaded, isHighlighted = _a.isHighlighted;
    var classes = (0, radarSeriesPlotClasses_1.useUtilityClasses)(inClasses);
    return (<g className={classes.root}>
      {seriesCoordinates === null || seriesCoordinates === void 0 ? void 0 : seriesCoordinates.map(function (_a, seriesIndex) {
            var seriesId = _a.seriesId, points = _a.points, color = _a.color, hideMark = _a.hideMark, fillArea = _a.fillArea;
            return (<g key={seriesId}>
            {<path key={seriesId} {...(0, RadarSeriesArea_1.getPathProps)({
                    seriesId: seriesId,
                    points: points,
                    color: color,
                    fillArea: fillArea,
                    isFaded: isFaded,
                    isHighlighted: isHighlighted,
                    classes: classes,
                })} onClick={function (event) {
                        return onAreaClick === null || onAreaClick === void 0 ? void 0 : onAreaClick(event, {
                            type: 'radar',
                            seriesId: seriesId,
                            dataIndex: getRotationIndex(event),
                        });
                    }} cursor={onAreaClick ? 'pointer' : 'unset'} {...interactionProps[seriesIndex]}/>}
            {!hideMark &&
                    points.map(function (point, index) { return (<circle key={index} {...(0, RadarSeriesMarks_1.getCircleProps)({
                        seriesId: seriesId,
                        point: point,
                        color: color,
                        fillArea: fillArea,
                        isFaded: isFaded,
                        isHighlighted: isHighlighted,
                        classes: classes,
                    })} onClick={function (event) {
                            return onMarkClick === null || onMarkClick === void 0 ? void 0 : onMarkClick(event, { type: 'radar', seriesId: seriesId, dataIndex: index });
                        }} cursor={onMarkClick ? 'pointer' : 'unset'}/>); })}
          </g>);
        })}
    </g>);
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
