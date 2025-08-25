"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
var React = require("react");
var BarChart_1 = require("@mui/x-charts/BarChart");
// prettier-ignore
<div>
  <BarChart_1.BarChart slotProps={{
        legend: {
            direction: "horizontal"
        }
    }}/>
  <BarChart_1.BarChart slotProps={{
        legend: {
            position: { vertical: 'top', horizontal: 'middle' },
            direction: "vertical"
        }
    }}/>
  <BarChart_1.BarChart slotProps={{
        legend: {
            direction: 'wrong'
        }
    }}/>
</div>;
