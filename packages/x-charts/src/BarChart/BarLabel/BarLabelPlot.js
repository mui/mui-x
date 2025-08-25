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
exports.BarLabelPlot = BarLabelPlot;
var React = require("react");
var BarLabelItem_1 = require("./BarLabelItem");
var barClasses_1 = require("../barClasses");
/**
 * @ignore - internal component.
 */
function BarLabelPlot(props) {
    var bars = props.bars, skipAnimation = props.skipAnimation, other = __rest(props, ["bars", "skipAnimation"]);
    var classes = (0, barClasses_1.useUtilityClasses)();
    return (<React.Fragment>
      {bars.flatMap(function (_a) {
            var seriesId = _a.seriesId, data = _a.data;
            return (<g key={seriesId} className={classes.seriesLabels} data-series={seriesId}>
          {data.map(function (_a) {
                    var xOrigin = _a.xOrigin, yOrigin = _a.yOrigin, x = _a.x, y = _a.y, dataIndex = _a.dataIndex, color = _a.color, value = _a.value, width = _a.width, height = _a.height, layout = _a.layout;
                    return (<BarLabelItem_1.BarLabelItem key={dataIndex} seriesId={seriesId} dataIndex={dataIndex} value={value} color={color} xOrigin={xOrigin} yOrigin={yOrigin} x={x} y={y} width={width} height={height} skipAnimation={skipAnimation !== null && skipAnimation !== void 0 ? skipAnimation : false} layout={layout !== null && layout !== void 0 ? layout : 'vertical'} {...other}/>);
                })}
        </g>);
        })}
    </React.Fragment>);
}
