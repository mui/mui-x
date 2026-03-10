"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var BarChart_1 = require("@mui/x-charts/BarChart");
var warning_1 = require("@mui/x-internals/warning");
describe('ChartsTooltipContainer', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    beforeEach(function () {
        (0, warning_1.clearWarningsCache)();
    });
    it('should warn when tooltipItem is controlled but trigger is axis', function () {
        var expectedError = [
            "MUI X Charts: The `tooltipItem` prop is provided, but the tooltip trigger is set to 'axis'.",
            "The `tooltipItem` prop only has an effect when the tooltip trigger is 'item'.",
        ].join('\n');
        expect(function () {
            return render((0, jsx_runtime_1.jsx)(BarChart_1.BarChart, { series: [{ data: [1, 2, 3], id: 'A' }], xAxis: [{ data: ['a', 'b', 'c'], position: 'none' }], yAxis: [{ position: 'none' }], height: 100, width: 100, hideLegend: true, tooltipItem: { seriesId: 'A', dataIndex: 0 }, slotProps: { tooltip: { trigger: 'axis' } } }));
        }).toErrorDev(expectedError);
    });
    it('should warn when tooltipAxis is controlled but trigger is item', function () {
        var expectedError = [
            "MUI X Charts: The `tooltipAxis` prop is provided, but the tooltip trigger is set to 'item'.",
            "The `tooltipAxis` prop only has an effect when the tooltip trigger is 'axis'.",
        ].join('\n');
        expect(function () {
            return render((0, jsx_runtime_1.jsx)(BarChart_1.BarChart, { series: [{ data: [1, 2, 3], id: 'A' }], xAxis: [{ id: 'x-axis', data: ['a', 'b', 'c'], position: 'none' }], yAxis: [{ position: 'none' }], height: 100, width: 100, hideLegend: true, tooltipAxis: [{ axisId: 'x-axis', dataIndex: 0 }], slotProps: { tooltip: { trigger: 'item' } } }));
        }).toErrorDev(expectedError);
    });
    it('should not warn when tooltipItem is controlled and trigger is item', function () {
        expect(function () {
            return render((0, jsx_runtime_1.jsx)(BarChart_1.BarChart, { series: [{ data: [1, 2, 3], id: 'A' }], xAxis: [{ data: ['a', 'b', 'c'], position: 'none' }], yAxis: [{ position: 'none' }], height: 100, width: 100, hideLegend: true, tooltipItem: { seriesId: 'A', dataIndex: 0 }, slotProps: { tooltip: { trigger: 'item' } } }));
        }).not.toErrorDev();
    });
    it('should not warn when tooltipAxis is controlled and trigger is axis', function () {
        expect(function () {
            return render((0, jsx_runtime_1.jsx)(BarChart_1.BarChart, { series: [{ data: [1, 2, 3], id: 'A' }], xAxis: [{ id: 'x-axis', data: ['a', 'b', 'c'], position: 'none' }], yAxis: [{ position: 'none' }], height: 100, width: 100, hideLegend: true, tooltipAxis: [{ axisId: 'x-axis', dataIndex: 0 }], slotProps: { tooltip: { trigger: 'axis' } } }));
        }).not.toErrorDev();
    });
});
