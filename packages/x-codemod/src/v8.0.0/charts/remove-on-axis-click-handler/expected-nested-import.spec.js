"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
var React = require("react");
var ChartContainer_1 = require("@mui/x-charts/ChartContainer");
var BarChart_1 = require("@mui/x-charts/BarChart");
// prettier-ignore
<ChartContainer_1.ChartContainer onAxisClick={onAxisClick}>
  {/* ... */}

  <BarChart_1.BarPlot onItemClick={onItemClick}/>
</ChartContainer_1.ChartContainer>;
