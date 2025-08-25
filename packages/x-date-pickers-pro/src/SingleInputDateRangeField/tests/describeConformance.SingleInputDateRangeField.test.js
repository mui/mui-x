"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var PickersTextField_1 = require("@mui/x-date-pickers/PickersTextField");
var SingleInputDateRangeField_1 = require("@mui/x-date-pickers-pro/SingleInputDateRangeField");
var pickers_1 = require("test/utils/pickers");
var describeConformance_1 = require("test/utils/describeConformance");
describe('<SingleInputDateRangeField /> - Describe Conformance', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, describeConformance_1.describeConformance)(<SingleInputDateRangeField_1.SingleInputDateRangeField />, function () { return ({
        classes: {},
        inheritComponent: PickersTextField_1.PickersTextField,
        render: render,
        muiName: 'MuiSingleInputDateRangeField',
        refInstanceof: window.HTMLDivElement,
        skip: ['componentProp', 'componentsProp', 'themeVariants', 'themeStyleOverrides'],
    }); });
});
