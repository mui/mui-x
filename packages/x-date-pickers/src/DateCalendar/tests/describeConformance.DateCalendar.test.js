"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var DateCalendar_1 = require("@mui/x-date-pickers/DateCalendar");
var pickers_1 = require("test/utils/pickers");
var describeConformance_1 = require("test/utils/describeConformance");
describe('<DateCalendar /> - Describe Conformance', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, describeConformance_1.describeConformance)(<DateCalendar_1.DateCalendar defaultValue={pickers_1.adapterToUse.date()}/>, function () { return ({
        classes: DateCalendar_1.dateCalendarClasses,
        inheritComponent: 'div',
        render: render,
        muiName: 'MuiDateCalendar',
        refInstanceof: window.HTMLDivElement,
        skip: ['componentProp', 'componentsProp', 'themeVariants'],
    }); });
});
