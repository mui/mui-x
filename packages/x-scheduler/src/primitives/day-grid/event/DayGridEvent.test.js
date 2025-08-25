"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var luxon_1 = require("luxon");
var day_grid_1 = require("@mui/x-scheduler/primitives/day-grid");
var scheduler_1 = require("test/utils/scheduler");
describe('<DayGrid.Event />', function () {
    var render = (0, scheduler_1.createSchedulerRenderer)().render;
    var eventStart = luxon_1.DateTime.now();
    var eventEnd = eventStart.plus({ hours: 1 });
    (0, scheduler_1.describeConformance)(<day_grid_1.DayGrid.Event start={eventStart} end={eventEnd}/>, function () { return ({
        refInstanceof: window.HTMLDivElement,
        render: function (node) {
            return render(<day_grid_1.DayGrid.Root>
          <day_grid_1.DayGrid.Row>
            <day_grid_1.DayGrid.Cell>{node}</day_grid_1.DayGrid.Cell>
          </day_grid_1.DayGrid.Row>
        </day_grid_1.DayGrid.Root>);
        },
    }); });
});
