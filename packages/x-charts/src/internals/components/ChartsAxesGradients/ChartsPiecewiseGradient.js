"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChartsPiecewiseGradient;
var React = require("react");
function ChartsPiecewiseGradient(props) {
    var _a;
    var isReversed = props.isReversed, gradientId = props.gradientId, size = props.size, direction = props.direction, scale = props.scale, colorMap = props.colorMap;
    if (size <= 0) {
        return null;
    }
    return (<linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="0" {..._a = {}, _a["".concat(direction).concat(isReversed ? 1 : 2)] = "".concat(size, "px"), _a} gradientUnits="userSpaceOnUse" // Use the SVG coordinate instead of the component ones.
    >
      {colorMap.thresholds.map(function (threshold, index) {
            var x = scale(threshold);
            if (x === undefined) {
                return null;
            }
            var offset = isReversed ? 1 - x / size : x / size;
            if (Number.isNaN(offset)) {
                return null;
            }
            return (<React.Fragment key={threshold.toString() + index}>
            <stop offset={offset} stopColor={colorMap.colors[index]} stopOpacity={1}/>
            <stop offset={offset} stopColor={colorMap.colors[index + 1]} stopOpacity={1}/>
          </React.Fragment>);
        })}
    </linearGradient>);
}
