"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var DayCalendarSkeleton_1 = require("@mui/x-date-pickers/DayCalendarSkeleton");
var pickers_1 = require("test/utils/pickers");
var describeConformance_1 = require("test/utils/describeConformance");
describe('<DayCalendarSkeleton />', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, describeConformance_1.describeConformance)(<DayCalendarSkeleton_1.DayCalendarSkeleton />, function () { return ({
        classes: DayCalendarSkeleton_1.dayCalendarSkeletonClasses,
        inheritComponent: 'div',
        render: render,
        muiName: 'MuiDayCalendarSkeleton',
        refInstanceof: window.HTMLDivElement,
        skip: ['componentProp', 'refForwarding', 'componentsProp', 'themeVariants'],
    }); });
});
