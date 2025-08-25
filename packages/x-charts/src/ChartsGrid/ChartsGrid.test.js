"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var createRenderer_1 = require("@mui/internal-test-utils/createRenderer");
var ChartsGrid_1 = require("@mui/x-charts/ChartsGrid");
var ChartContainer_1 = require("@mui/x-charts/ChartContainer");
describe('<ChartsGrid />', function () {
    var render = (0, createRenderer_1.createRenderer)().render;
    it('should render grid at millisecond level without warnings', function () {
        render(<ChartContainer_1.ChartContainer series={[]} width={500} height={500} xAxis={[
                {
                    scaleType: 'time',
                    min: new Date(2022, 1, 1, 12, 30, 30, 100),
                    max: new Date(2022, 1, 1, 12, 30, 30, 500),
                },
            ]} yAxis={[
                {
                    scaleType: 'time',
                    min: new Date(2022, 1, 1, 12, 30, 30, 100),
                    max: new Date(2022, 1, 1, 12, 30, 30, 500),
                },
            ]}>
        <ChartsGrid_1.ChartsGrid vertical horizontal/>
      </ChartContainer_1.ChartContainer>);
    });
    it('should render grid on band scale without error', function () {
        render(<ChartContainer_1.ChartContainer series={[]} width={500} height={500} xAxis={[{ scaleType: 'band', data: ['A', 'B', 'C'] }]} yAxis={[{ scaleType: 'band', data: ['A', 'B', 'C'] }]}>
        <ChartsGrid_1.ChartsGrid vertical horizontal/>
      </ChartContainer_1.ChartContainer>);
    });
});
