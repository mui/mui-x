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
exports.LinePreviewPlot = LinePreviewPlot;
var React = require("react");
var internals_1 = require("@mui/x-charts/internals");
function LinePreviewPlot(_a) {
    var axisId = _a.axisId;
    var completedData = useLinePreviewData(axisId);
    return (<g>
      {completedData.map(function (_a) {
            var d = _a.d, seriesId = _a.seriesId, color = _a.color, gradientId = _a.gradientId;
            return (<PreviewLineElement key={seriesId} id={seriesId} d={d} color={color} gradientId={gradientId}/>);
        })}
    </g>);
}
/**
 * Preview of the line element for the zoom preview.
 * Based on LineElement and AnimatedLine.
 */
function PreviewLineElement(_a) {
    var id = _a.id, color = _a.color, gradientId = _a.gradientId, onClick = _a.onClick, other = __rest(_a, ["id", "color", "gradientId", "onClick"]);
    return (<path stroke={gradientId ? "url(#".concat(gradientId, ")") : color} strokeWidth={2} strokeLinejoin="round" fill="none" data-series={id} {...other}/>);
}
function useLinePreviewData(axisId) {
    var store = (0, internals_1.useStore)();
    var xAxes = (0, internals_1.useSelector)(store, internals_1.selectorChartPreviewComputedXAxis, [axisId]);
    var yAxes = (0, internals_1.useSelector)(store, internals_1.selectorChartPreviewComputedYAxis, [axisId]);
    return (0, internals_1.useLinePlotData)(xAxes, yAxes);
}
