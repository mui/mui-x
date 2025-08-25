"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
var React = require("react");
var BarChart_1 = require("@mui/x-charts/BarChart");
// prettier-ignore
<div>
  <BarChart_1.BarChart slotProps={{ legend: {
            position: { vertical: 'middle' }
        } }} hideLegend={true}/>
  <BarChart_1.BarChart slotProps={{ legend: {
            position: { vertical: 'top' }
        } }} hideLegend={false}/>
  <BarChart_1.BarChart hideLegend={true}/>
  <BarChart_1.BarChart slotProps={{ legend: __assign({}, rest) }} hideLegend={true}/>
  <BarChart_1.BarChart slotProps={{ legend: {} }}/>
  <BarChart_1.BarChart slotProps={{}}/>
  <BarChart_1.BarChart />
</div>;
