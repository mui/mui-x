"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var timeline_1 = require("@mui/x-scheduler/primitives/timeline");
var scheduler_1 = require("test/utils/scheduler");
describe('<Timeline.Row />', function () {
    var render = (0, scheduler_1.createSchedulerRenderer)().render;
    (0, scheduler_1.describeConformance)(<timeline_1.Timeline.Row />, function () { return ({
        refInstanceof: window.HTMLDivElement,
        render: function (node) {
            return render(<timeline_1.Timeline.Root items={[]}>{node}</timeline_1.Timeline.Root>);
        },
    }); });
});
