"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var luxon_1 = require("luxon");
var time_grid_1 = require("@mui/x-scheduler/primitives/time-grid");
var scheduler_1 = require("test/utils/scheduler");
describe('<TimeGrid.Event />', function () {
    var render = (0, scheduler_1.createSchedulerRenderer)().render;
    var eventStart = luxon_1.DateTime.now();
    var eventEnd = eventStart.plus({ hours: 1 });
    (0, scheduler_1.describeConformance)(<time_grid_1.TimeGrid.Event eventId="fake-id" start={eventStart} end={eventEnd}/>, function () { return ({
        refInstanceof: window.HTMLDivElement,
        render: function (node) {
            return render(<time_grid_1.TimeGrid.Root>
            <time_grid_1.TimeGrid.Column start={eventStart} end={eventEnd}>
              {node}
            </time_grid_1.TimeGrid.Column>
          </time_grid_1.TimeGrid.Root>);
        },
    }); });
});
