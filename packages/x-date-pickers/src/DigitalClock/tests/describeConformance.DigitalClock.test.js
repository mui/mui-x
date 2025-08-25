"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var pickers_1 = require("test/utils/pickers");
var DigitalClock_1 = require("@mui/x-date-pickers/DigitalClock");
var describeConformance_1 = require("test/utils/describeConformance");
describe('<DigitalClock /> - Describe Conformance', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, describeConformance_1.describeConformance)(<DigitalClock_1.DigitalClock />, function () { return ({
        classes: DigitalClock_1.digitalClockClasses,
        inheritComponent: 'div',
        render: render,
        muiName: 'MuiDigitalClock',
        refInstanceof: window.HTMLDivElement,
        skip: ['componentProp', 'componentsProp', 'themeVariants'],
    }); });
});
