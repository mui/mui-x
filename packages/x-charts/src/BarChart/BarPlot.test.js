"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var React = require("react");
var ChartContainer_1 = require("../ChartContainer");
var BarPlot_1 = require("./BarPlot");
describe('BarPlot', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    it('`barLabel` prop works', function () {
        render((0, jsx_runtime_1.jsx)(ChartContainer_1.ChartContainer, { series: [{ type: 'bar', data: [1] }], width: 100, height: 100, xAxis: [{ scaleType: 'band', data: ['A'] }], yAxis: [], children: (0, jsx_runtime_1.jsx)(BarPlot_1.BarPlot, { barLabel: function () { return 'Bar label from prop'; } }) }));
        expect(internal_test_utils_1.screen.getByText('Bar label from prop')).toBeVisible();
    });
    it('prioritizes `barLabel` from series over `barLabel` prop', function () {
        render((0, jsx_runtime_1.jsx)(ChartContainer_1.ChartContainer, { series: [{ type: 'bar', data: [1], barLabel: function () { return 'Bar label from series'; } }], width: 100, height: 100, xAxis: [{ scaleType: 'band', data: ['A'] }], yAxis: [], children: (0, jsx_runtime_1.jsx)(BarPlot_1.BarPlot, { barLabel: function () { return 'Bar label from prop'; } }) }));
        expect(internal_test_utils_1.screen.getByText('Bar label from series')).toBeVisible();
    });
    it("defaults to `barLabel` prop when `barLabel` from series isn't defined", function () {
        render((0, jsx_runtime_1.jsx)(ChartContainer_1.ChartContainer, { series: [
                { type: 'bar', data: [1] },
                { type: 'bar', data: [1], barLabel: function () { return 'Bar label from 2nd series'; } },
            ], width: 100, height: 100, xAxis: [{ scaleType: 'band', data: ['A'] }], yAxis: [], children: (0, jsx_runtime_1.jsx)(BarPlot_1.BarPlot, { barLabel: function () { return 'Bar label from prop'; } }) }));
        expect(internal_test_utils_1.screen.getByText('Bar label from prop')).toBeVisible();
        expect(internal_test_utils_1.screen.getByText('Bar label from 2nd series')).toBeVisible();
    });
});
