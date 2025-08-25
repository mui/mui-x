"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
/* eslint-disable */
var React = require("react");
var PieChart_1 = require("@mui/x-charts/PieChart");
var BarChart_1 = require("@mui/x-charts/BarChart");
var LineChart_1 = require("@mui/x-charts/LineChart");
var ChartContainer_1 = require("@mui/x-charts/ChartContainer");
var ChartsXAxis_1 = require("@mui/x-charts/ChartsXAxis");
var hooks_1 = require("@mui/x-charts/hooks");
var hooks_2 = require("@mui/x-charts-pro/hooks");
function App() {
    var series = (0, hooks_1.useSeries)();
    var pieSeries = (0, hooks_1.usePieSeries)();
    var lineSeries = (0, hooks_1.useLineSeries)();
    var barSeries = (0, hooks_1.useBarSeries)();
    var scatterSeries = (0, hooks_1.useScatterSeries)();
    var heatmapSeries = (0, hooks_2.useHeatmapSeries)();
    // prettier-ignore
    <div>
  <PieChart_1.PieChart hideLegend={true}/>
  <PieChart_1.PieChart slotProps={{
            tooltip: { trigger: 'axis' }
        }} hideLegend={true}/>
  <ChartContainer_1.ChartContainer onAxisClick={onAxisClickHandler}>

    <BarChart_1.BarPlot />
  </ChartContainer_1.ChartContainer>
  <ChartsXAxis_1.ChartsXAxis labelStyle={{
            fontSize: 18
        }} tickStyle={{
            fontSize: 20
        }}/>
  <ChartsXAxis_1.ChartsXAxis labelStyle={{
            fontWeight: 'bold',
            fontSize: 18
        }} tickStyle={{
            fontWeight: 'bold',
            fontSize: 20
        }}/>
  <ChartsXAxis_1.ChartsXAxis labelStyle={{
            fontWeight: 'bold',
            fontSize: 10
        }} tickStyle={{
            fontWeight: 'bold',
            fontSize: 12
        }}/>
  <LineChart_1.LineChart series={[{}]}/>
  <BarChart_1.BarChart slotProps={{
            legend: {
                direction: "horizontal"
            }
        }}/>
  <BarChart_1.BarChart slotProps={{
            legend: {
                direction: "vertical",
                position: {
                    vertical: 'top',
                    horizontal: "center"
                }
            }
        }}/>
  <BarChart_1.BarChart slotProps={{
            legend: {
                direction: 'wrong'
            }
        }}/>
  <BarChart_1.BarChart slotProps={{
            legend: {
                position: {
                    vertical: 'middle',
                    horizontal: "start"
                }
            }
        }}/>
  <BarChart_1.BarChart slotProps={{
            legend: {
                position: {
                    vertical: 'top',
                    horizontal: "center"
                }
            }
        }}/>
  <BarChart_1.BarChart slotProps={{
            legend: {
                position: {
                    vertical: 'bottom',
                    horizontal: "end"
                }
            }
        }}/>
  <BarChart_1.BarChart slotProps={{
            legend: {
                position: {
                    vertical: 'wrong',
                    horizontal: 'wrong'
                }
            }
        }}/>
  </div>;
}
