"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var SingleInputDateTimeRangeField_1 = require("@mui/x-date-pickers-pro/SingleInputDateTimeRangeField");
var pickers_1 = require("test/utils/pickers");
var describeConformance_1 = require("test/utils/describeConformance");
describe('<SingleInputDateTimeRangeField /> - Describe Conformance', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, describeConformance_1.describeConformance)(<SingleInputDateTimeRangeField_1.SingleInputDateTimeRangeField />, function () { return ({
        classes: {},
        inheritComponent: 'div',
        render: render,
        muiName: 'MuiSingleInputDateTimeRangeField',
        refInstanceof: window.HTMLDivElement,
        skip: ['componentProp', 'componentsProp', 'themeVariants', 'themeStyleOverrides'],
    }); });
});
