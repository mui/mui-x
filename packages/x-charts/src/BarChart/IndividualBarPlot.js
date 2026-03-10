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
exports.IndividualBarPlot = IndividualBarPlot;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var BarElement_1 = require("./BarElement");
var barClasses_1 = require("./barClasses");
var BarClipPath_1 = require("./BarClipPath");
function IndividualBarPlot(_a) {
    var completedData = _a.completedData, masksData = _a.masksData, borderRadius = _a.borderRadius, onItemClick = _a.onItemClick, skipAnimation = _a.skipAnimation, other = __rest(_a, ["completedData", "masksData", "borderRadius", "onItemClick", "skipAnimation"]);
    var classes = (0, barClasses_1.useUtilityClasses)();
    var withoutBorderRadius = !borderRadius || borderRadius <= 0;
    return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [!withoutBorderRadius &&
                masksData.map(function (_a) {
                    var id = _a.id, x = _a.x, y = _a.y, xOrigin = _a.xOrigin, yOrigin = _a.yOrigin, width = _a.width, height = _a.height, hasPositive = _a.hasPositive, hasNegative = _a.hasNegative, layout = _a.layout;
                    return ((0, jsx_runtime_1.jsx)(BarClipPath_1.BarClipPath, { maskId: id, borderRadius: borderRadius, hasNegative: hasNegative, hasPositive: hasPositive, layout: layout, x: x, y: y, xOrigin: xOrigin, yOrigin: yOrigin, width: width, height: height, skipAnimation: skipAnimation !== null && skipAnimation !== void 0 ? skipAnimation : false }, id));
                }), completedData.map(function (_a) {
                var seriesId = _a.seriesId, layout = _a.layout, xOrigin = _a.xOrigin, yOrigin = _a.yOrigin, data = _a.data;
                return ((0, jsx_runtime_1.jsx)("g", { "data-series": seriesId, className: classes.series, children: data.map(function (_a) {
                        var dataIndex = _a.dataIndex, color = _a.color, maskId = _a.maskId, x = _a.x, y = _a.y, width = _a.width, height = _a.height;
                        var barElement = ((0, jsx_runtime_1.jsx)(BarElement_1.BarElement, __assign({ seriesId: seriesId, dataIndex: dataIndex, color: color, skipAnimation: skipAnimation !== null && skipAnimation !== void 0 ? skipAnimation : false, layout: layout !== null && layout !== void 0 ? layout : 'vertical', x: x, xOrigin: xOrigin, y: y, yOrigin: yOrigin, width: width, height: height }, other, { onClick: onItemClick &&
                                (function (event) {
                                    onItemClick(event, { type: 'bar', seriesId: seriesId, dataIndex: dataIndex });
                                }) }), dataIndex));
                        if (withoutBorderRadius) {
                            return barElement;
                        }
                        return ((0, jsx_runtime_1.jsx)("g", { clipPath: "url(#".concat(maskId, ")"), children: barElement }, dataIndex));
                    }) }, seriesId));
            })] }));
}
