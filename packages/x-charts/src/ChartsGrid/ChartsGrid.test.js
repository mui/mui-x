"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var createRenderer_1 = require("@mui/internal-test-utils/createRenderer");
var ChartsGrid_1 = require("@mui/x-charts/ChartsGrid");
var ChartContainer_1 = require("@mui/x-charts/ChartContainer");
describe('<ChartsGrid />', function () {
    var render = (0, createRenderer_1.createRenderer)().render;
    it('should render grid at millisecond level without warnings', function () {
        render((0, jsx_runtime_1.jsx)(ChartContainer_1.ChartContainer, { series: [], width: 500, height: 500, xAxis: [
                {
                    scaleType: 'time',
                    min: new Date(2022, 1, 1, 12, 30, 30, 100),
                    max: new Date(2022, 1, 1, 12, 30, 30, 500),
                },
            ], yAxis: [
                {
                    scaleType: 'time',
                    min: new Date(2022, 1, 1, 12, 30, 30, 100),
                    max: new Date(2022, 1, 1, 12, 30, 30, 500),
                },
            ], children: (0, jsx_runtime_1.jsx)(ChartsGrid_1.ChartsGrid, { vertical: true, horizontal: true }) }));
        var gridLines = document.querySelectorAll('.MuiChartsGrid-line');
        expect(gridLines.length).to.be.greaterThan(0);
    });
    it('should render grid on band scale without error', function () {
        render((0, jsx_runtime_1.jsx)(ChartContainer_1.ChartContainer, { series: [], width: 500, height: 500, xAxis: [{ scaleType: 'band', data: ['A', 'B', 'C'] }], yAxis: [{ scaleType: 'band', data: ['A', 'B', 'C'] }], children: (0, jsx_runtime_1.jsx)(ChartsGrid_1.ChartsGrid, { vertical: true, horizontal: true }) }));
        var gridLines = document.querySelectorAll('.MuiChartsGrid-line');
        expect(gridLines.length).to.be.greaterThan(0);
    });
});
