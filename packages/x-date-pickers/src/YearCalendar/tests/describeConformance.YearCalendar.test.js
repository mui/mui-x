"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var YearCalendar_1 = require("@mui/x-date-pickers/YearCalendar");
var pickers_1 = require("test/utils/pickers");
var describeConformance_1 = require("test/utils/describeConformance");
describe('<YearCalendar /> - Describe Conformance', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, describeConformance_1.describeConformance)(<YearCalendar_1.YearCalendar defaultValue={pickers_1.adapterToUse.date()}/>, function () { return ({
        classes: YearCalendar_1.yearCalendarClasses,
        inheritComponent: 'div',
        render: render,
        muiName: 'MuiYearCalendar',
        refInstanceof: window.HTMLDivElement,
        skip: ['componentProp', 'componentsProp', 'themeVariants'],
    }); });
});
