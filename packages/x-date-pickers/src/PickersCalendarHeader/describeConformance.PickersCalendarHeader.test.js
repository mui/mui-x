"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var pickers_1 = require("test/utils/pickers");
var describeConformance_1 = require("test/utils/describeConformance");
var PickersCalendarHeader_1 = require("./PickersCalendarHeader");
var pickersCalendarHeaderClasses_1 = require("./pickersCalendarHeaderClasses");
describe('<PickersCalendarHeader /> - Describe Conformance', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, describeConformance_1.describeConformance)(<PickersCalendarHeader_1.PickersCalendarHeader currentMonth={pickers_1.adapterToUse.date('2018-01-01')} minDate={pickers_1.adapterToUse.date('1900-01-01')} maxDate={pickers_1.adapterToUse.date('2100-12-31')} onMonthChange={function () { }} views={['year', 'day']} view="day" timezone="system" reduceAnimations/>, function () { return ({
        classes: pickersCalendarHeaderClasses_1.pickersCalendarHeaderClasses,
        inheritComponent: 'div',
        render: render,
        muiName: 'MuiPickersCalendarHeader',
        refInstanceof: window.HTMLDivElement,
        skip: [
            'componentProp',
            'componentsProp',
            'themeVariants',
            'slotPropsCallbackWithPropsAsOwnerState',
        ],
        slots: {
            switchViewButton: {
                expectedClassName: pickersCalendarHeaderClasses_1.pickersCalendarHeaderClasses.switchViewButton,
            },
            switchViewIcon: {
                expectedClassName: pickersCalendarHeaderClasses_1.pickersCalendarHeaderClasses.switchViewIcon,
            },
        },
    }); });
});
