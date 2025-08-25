"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var luxon_1 = require("luxon");
var time_grid_1 = require("@mui/x-scheduler/primitives/time-grid");
var scheduler_1 = require("test/utils/scheduler");
describe('<TimeGrid.Column />', function () {
    var render = (0, scheduler_1.createSchedulerRenderer)().render;
    var day = luxon_1.DateTime.now();
    (0, scheduler_1.describeConformance)(<time_grid_1.TimeGrid.Column start={day.startOf('day')} end={day.endOf('day')}/>, function () { return ({
        refInstanceof: window.HTMLDivElement,
        render: function (node) {
            return render(<time_grid_1.TimeGrid.Root>{node}</time_grid_1.TimeGrid.Root>);
        },
    }); });
});
