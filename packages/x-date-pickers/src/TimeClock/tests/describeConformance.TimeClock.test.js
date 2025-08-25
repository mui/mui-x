"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var TimeClock_1 = require("@mui/x-date-pickers/TimeClock");
var pickers_1 = require("test/utils/pickers");
var describeConformance_1 = require("test/utils/describeConformance");
describe('<TimeClock /> - Describe Conformance', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, describeConformance_1.describeConformance)(<TimeClock_1.TimeClock />, function () { return ({
        classes: TimeClock_1.timeClockClasses,
        inheritComponent: 'div',
        render: render,
        refInstanceof: window.HTMLDivElement,
        muiName: 'MuiTimeClock',
        skip: ['componentProp', 'componentsProp', 'themeVariants'],
    }); });
});
