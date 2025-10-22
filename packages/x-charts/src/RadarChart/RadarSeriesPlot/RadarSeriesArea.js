"use strict";
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
exports.getPathProps = getPathProps;
exports.RadarSeriesArea = RadarSeriesArea;
var React = require("react");
var prop_types_1 = require("prop-types");
var clsx_1 = require("clsx");
var useRadarSeriesData_1 = require("./useRadarSeriesData");
var getAreaPath_1 = require("./getAreaPath");
var radarSeriesPlotClasses_1 = require("./radarSeriesPlotClasses");
var useItemHighlightedGetter_1 = require("../../hooks/useItemHighlightedGetter");
var useInteractionItemProps_1 = require("../../hooks/useInteractionItemProps");
var useRadarRotationIndex_1 = require("./useRadarRotationIndex");
function getPathProps(params) {
    var isHighlighted = params.isHighlighted, isFaded = params.isFaded, seriesId = params.seriesId, classes = params.classes, points = params.points, fillArea = params.fillArea, color = params.color;
    var isItemHighlighted = isHighlighted({ seriesId: seriesId });
    var isItemFaded = !isItemHighlighted && isFaded({ seriesId: seriesId });
    return {
        d: (0, getAreaPath_1.getAreaPath)(points),
        fill: fillArea ? color : 'transparent',
        stroke: color,
        className: (0, clsx_1.default)(classes.area, (isItemHighlighted && classes.highlighted) || (isItemFaded && classes.faded)),
        strokeOpacity: isItemFaded ? 0.5 : 1,
        fillOpacity: (isItemHighlighted && 0.4) || (isItemFaded && 0.1) || 0.2,
        strokeWidth: !fillArea && isItemHighlighted ? 2 : 1,
    };
}
function RadarSeriesArea(props) {
    var seriesId = props.seriesId, onItemClick = props.onItemClick, other = __rest(props, ["seriesId", "onItemClick"]);
    var seriesCoordinates = (0, useRadarSeriesData_1.useRadarSeriesData)(seriesId);
    var getRotationIndex = (0, useRadarRotationIndex_1.useRadarRotationIndex)();
    var interactionProps = (0, useInteractionItemProps_1.useInteractionAllItemProps)(seriesCoordinates);
    var _a = (0, useItemHighlightedGetter_1.useItemHighlightedGetter)(), isFaded = _a.isFaded, isHighlighted = _a.isHighlighted;
    var classes = (0, radarSeriesPlotClasses_1.useUtilityClasses)(props.classes);
    return (<React.Fragment>
      {seriesCoordinates === null || seriesCoordinates === void 0 ? void 0 : seriesCoordinates.map(function (_a, seriesIndex) {
            var id = _a.seriesId, points = _a.points, color = _a.color, fillArea = _a.fillArea;
            return (<path key={id} {...getPathProps({
                seriesId: id,
                points: points,
                color: color,
                fillArea: fillArea,
                isFaded: isFaded,
                isHighlighted: isHighlighted,
                classes: classes,
            })} onClick={function (event) {
                    return onItemClick === null || onItemClick === void 0 ? void 0 : onItemClick(event, {
                        type: 'radar',
                        seriesId: id,
                        dataIndex: getRotationIndex(event),
                    });
                }} cursor={onItemClick ? 'pointer' : 'unset'} {...interactionProps[seriesIndex]} {...other}/>);
        })}
    </React.Fragment>);
}
RadarSeriesArea.propTypes = {
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
    onItemClick: prop_types_1.default.func,
    /**
     * The id of the series to display.
     * If undefined all series are displayed.
     */
    seriesId: prop_types_1.default.string,
};
