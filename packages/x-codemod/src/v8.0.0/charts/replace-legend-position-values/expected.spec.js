"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
var React = require("react");
var BarChart_1 = require("@mui/x-charts/BarChart");
// prettier-ignore
<div>
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
