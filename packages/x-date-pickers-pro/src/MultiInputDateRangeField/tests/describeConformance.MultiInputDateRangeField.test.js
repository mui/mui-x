"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var MultiInputDateRangeField_1 = require("@mui/x-date-pickers-pro/MultiInputDateRangeField");
var pickers_1 = require("test/utils/pickers");
var describeConformance_1 = require("test/utils/describeConformance");
describe('<MultiInputDateRangeField /> - Describe Conformance', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, describeConformance_1.describeConformance)(<MultiInputDateRangeField_1.MultiInputDateRangeField />, function () { return ({
        classes: {},
        inheritComponent: 'div',
        render: render,
        muiName: 'MuiMultiInputDateRangeField',
        refInstanceof: window.HTMLDivElement,
        skip: ['themeVariants', 'componentProp', 'componentsProp'],
    }); });
});
