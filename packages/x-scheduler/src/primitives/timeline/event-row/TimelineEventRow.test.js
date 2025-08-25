"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var timeline_1 = require("@mui/x-scheduler/primitives/timeline");
var scheduler_1 = require("test/utils/scheduler");
var luxon_1 = require("luxon");
describe('<Timeline.EventRow />', function () {
    var render = (0, scheduler_1.createSchedulerRenderer)().render;
    var start = luxon_1.DateTime.now().startOf('day');
    var end = luxon_1.DateTime.now().endOf('day');
    (0, scheduler_1.describeConformance)(<timeline_1.Timeline.EventRow start={start} end={end}/>, function () { return ({
        refInstanceof: window.HTMLDivElement,
        render: function (node) {
            return render(<timeline_1.Timeline.Root items={[]}>{node}</timeline_1.Timeline.Root>);
        },
    }); });
});
