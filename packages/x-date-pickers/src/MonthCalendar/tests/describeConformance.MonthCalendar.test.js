"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var pickers_1 = require("test/utils/pickers");
var MonthCalendar_1 = require("@mui/x-date-pickers/MonthCalendar");
var describeConformance_1 = require("test/utils/describeConformance");
describe('<MonthCalendar /> - Describe Conformance', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, describeConformance_1.describeConformance)(<MonthCalendar_1.MonthCalendar defaultValue={pickers_1.adapterToUse.date()}/>, function () { return ({
        classes: MonthCalendar_1.monthCalendarClasses,
        inheritComponent: 'div',
        render: render,
        muiName: 'MuiMonthCalendar',
        refInstanceof: window.HTMLDivElement,
        skip: ['componentProp', 'componentsProp', 'themeVariants'],
    }); });
});
