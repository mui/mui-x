"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
var React = require("react");
var x_charts_pro_1 = require("@mui/x-charts-pro");
var ResponsiveChartContainerPro_1 = require("@mui/x-charts-pro/ResponsiveChartContainerPro");
var x_charts_ChartContainerPro_1 = require("@mui/x-charts-ChartContainerPro");
// prettier-ignore
<div>
  <x_charts_ChartContainerPro_1.ChartContainerPro onAxisClick={function (event, data) {
        console.log(data);
    }}>
    {/* ... */}

    <x_charts_pro_1.BarPlot onItemClick={onItemClick}/>
  </x_charts_ChartContainerPro_1.ChartContainerPro>
  <ResponsiveChartContainerPro_1.ResponsiveChartContainerPro onAxisClick={onAxisClick}>
    {/* ... */}

    <x_charts_pro_1.BarPlot onItemClick={onItemClick}/>
  </ResponsiveChartContainerPro_1.ResponsiveChartContainerPro>
</div>;
