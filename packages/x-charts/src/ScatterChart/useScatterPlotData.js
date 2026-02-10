"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useScatterPlotData = useScatterPlotData;
var React = require("react");
var hooks_1 = require("../hooks");
function useScatterPlotData(series, xScale, yScale, isPointInside) {
    return React.useMemo(function () {
        var getXPosition = (0, hooks_1.getValueToPositionMapper)(xScale);
        var getYPosition = (0, hooks_1.getValueToPositionMapper)(yScale);
        var temp = [];
        for (var i = 0; i < series.data.length; i += 1) {
            var scatterPoint = series.data[i];
            var x = getXPosition(scatterPoint.x);
            var y = getYPosition(scatterPoint.y);
            var isInRange = isPointInside(x, y);
            if (isInRange) {
                temp.push({
                    x: x,
                    y: y,
                    id: scatterPoint.id,
                    seriesId: series.id,
                    type: 'scatter',
                    dataIndex: i,
                });
            }
        }
        return temp;
    }, [xScale, yScale, series.data, series.id, isPointInside]);
}
