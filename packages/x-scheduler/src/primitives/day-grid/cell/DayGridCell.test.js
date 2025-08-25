"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var day_grid_1 = require("@mui/x-scheduler/primitives/day-grid");
var scheduler_1 = require("test/utils/scheduler");
describe('<DayGrid.Cell />', function () {
    var render = (0, scheduler_1.createSchedulerRenderer)().render;
    (0, scheduler_1.describeConformance)(<day_grid_1.DayGrid.Cell />, function () { return ({
        refInstanceof: window.HTMLDivElement,
        render: function (node) {
            return render(<day_grid_1.DayGrid.Root>
          <day_grid_1.DayGrid.Row>{node}</day_grid_1.DayGrid.Row>
        </day_grid_1.DayGrid.Root>);
        },
    }); });
});
