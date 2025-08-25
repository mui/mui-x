"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
/* eslint-disable no-restricted-imports */
var React = require("react");
var x_charts_1 = require("@mui/x-charts");
var data = [1, 2];
function Chart() {
    var fn = function (mode) { return (mode === 'light' ? ['black'] : ['white']); };
    // prettier-ignore
    return (<React.Fragment>
      <x_charts_1.SparkLineChart data={data} color={'red'}/>
      <x_charts_1.SparkLineChart data={data} color={typeof fn === "function" ? function (mode) { var _a; return (_a = fn(mode)) === null || _a === void 0 ? void 0 : _a[0]; } : fn}/>
      <x_charts_1.SparkLineChart data={data} 
    /* mui-x-codemod: We renamed the `colors` prop to `color`, but didn't change the value. Please ensure sure this prop receives a string or a function that returns a string. */
    color={function (mode) { return (mode === 'light' ? ['black'] : ['white']); }}/>
      <x_charts_1.SparkLineChart data={data} 
    /* mui-x-codemod: We renamed the `colors` prop to `color`, but didn't change the value. Please ensure sure this prop receives a string or a function that returns a string. */
    color="red"/>
    </React.Fragment>);
}
