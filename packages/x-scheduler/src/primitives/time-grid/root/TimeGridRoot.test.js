"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var time_grid_1 = require("@mui/x-scheduler/primitives/time-grid");
var scheduler_1 = require("test/utils/scheduler");
describe('<TimeGrid.Root />', function () {
    var render = (0, scheduler_1.createSchedulerRenderer)().render;
    (0, scheduler_1.describeConformance)(<time_grid_1.TimeGrid.Root />, function () { return ({
        refInstanceof: window.HTMLDivElement,
        render: render,
    }); });
});
