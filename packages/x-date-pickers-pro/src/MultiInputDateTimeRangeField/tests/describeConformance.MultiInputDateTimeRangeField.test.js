"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var MultiInputDateTimeRangeField_1 = require("@mui/x-date-pickers-pro/MultiInputDateTimeRangeField");
var pickers_1 = require("test/utils/pickers");
var describeConformance_1 = require("test/utils/describeConformance");
describe('<MultiInputDateTimeRangeField /> - Describe Conformance', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, describeConformance_1.describeConformance)(<MultiInputDateTimeRangeField_1.MultiInputDateTimeRangeField />, function () { return ({
        classes: {},
        inheritComponent: 'div',
        render: render,
        muiName: 'MuiMultiInputDateTimeRangeField',
        refInstanceof: window.HTMLDivElement,
        skip: ['componentProp', 'componentsProp', 'themeVariants'],
    }); });
});
