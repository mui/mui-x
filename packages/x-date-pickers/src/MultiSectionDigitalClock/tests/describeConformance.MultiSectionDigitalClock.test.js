"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var pickers_1 = require("test/utils/pickers");
var MultiSectionDigitalClock_1 = require("@mui/x-date-pickers/MultiSectionDigitalClock");
var describeConformance_1 = require("test/utils/describeConformance");
describe('<MultiSectionDigitalClock /> - Describe Conformance', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, describeConformance_1.describeConformance)(<MultiSectionDigitalClock_1.MultiSectionDigitalClock />, function () { return ({
        classes: MultiSectionDigitalClock_1.multiSectionDigitalClockClasses,
        inheritComponent: 'div',
        render: render,
        muiName: 'MuiMultiSectionDigitalClock',
        refInstanceof: window.HTMLDivElement,
        skip: ['componentProp', 'componentsProp', 'themeVariants'],
    }); });
});
