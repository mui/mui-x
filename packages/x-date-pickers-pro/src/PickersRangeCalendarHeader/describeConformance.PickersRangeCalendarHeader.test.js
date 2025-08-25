"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var PickersCalendarHeader_1 = require("@mui/x-date-pickers/PickersCalendarHeader");
var internals_1 = require("@mui/x-date-pickers/internals");
var PickersRangeCalendarHeader_1 = require("@mui/x-date-pickers-pro/PickersRangeCalendarHeader");
var pickers_1 = require("test/utils/pickers");
var describeConformance_1 = require("test/utils/describeConformance");
var CALENDARS_TO_CLASSES_MAP = {
    1: PickersCalendarHeader_1.pickersCalendarHeaderClasses,
    2: internals_1.pickersArrowSwitcherClasses,
};
describe('<PickersRangeCalendarHeader /> - Describe Conformance', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    Object.entries(CALENDARS_TO_CLASSES_MAP).forEach(function (_a) {
        var calendars = _a[0], classes = _a[1];
        (0, describeConformance_1.describeConformance)(<PickersRangeCalendarHeader_1.PickersRangeCalendarHeader calendars={parseInt(calendars, 10)} monthIndex={0} month={pickers_1.adapterToUse.date('2018-01-01')} currentMonth={pickers_1.adapterToUse.date('2018-01-01')} minDate={pickers_1.adapterToUse.date('1900-01-01')} maxDate={pickers_1.adapterToUse.date('2100-12-31')} onMonthChange={function () { }} views={['day']} view="day" timezone="system" reduceAnimations/>, function () { return ({
            classes: classes,
            inheritComponent: 'div',
            render: render,
            muiName: 'MuiPickersRangeCalendarHeader',
            refInstanceof: window.HTMLDivElement,
            skip: [
                'componentProp',
                'componentsProp',
                'themeVariants',
                'themeDefaultProps',
                'themeStyleOverrides',
            ],
        }); });
    });
});
