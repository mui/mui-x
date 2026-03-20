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
exports.BarLabelPlot = BarLabelPlot;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var BarLabelItem_1 = require("./BarLabelItem");
/**
 * @ignore - internal component.
 */
function BarLabelPlot(props) {
    var _a;
    var processedSeries = props.processedSeries, className = props.className, skipAnimation = props.skipAnimation, other = __rest(props, ["processedSeries", "className", "skipAnimation"]);
    var seriesId = processedSeries.seriesId, data = processedSeries.data, layout = processedSeries.layout, xOrigin = processedSeries.xOrigin, yOrigin = processedSeries.yOrigin;
    var barLabel = (_a = processedSeries.barLabel) !== null && _a !== void 0 ? _a : props.barLabel;
    if (!barLabel) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)("g", { className: className, "data-series": seriesId, children: data.map(function (_a) {
            var x = _a.x, y = _a.y, dataIndex = _a.dataIndex, color = _a.color, value = _a.value, width = _a.width, height = _a.height, hidden = _a.hidden;
            return ((0, jsx_runtime_1.jsx)(BarLabelItem_1.BarLabelItem, __assign({ seriesId: seriesId, dataIndex: dataIndex, value: value, color: color, xOrigin: xOrigin, yOrigin: yOrigin, x: x, y: y, width: width, height: height, skipAnimation: skipAnimation !== null && skipAnimation !== void 0 ? skipAnimation : false, layout: layout !== null && layout !== void 0 ? layout : 'vertical', hidden: hidden }, other, { barLabel: barLabel, barLabelPlacement: processedSeries.barLabelPlacement || 'center' }), dataIndex));
        }) }, seriesId));
}
