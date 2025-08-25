"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var PickersTextField_1 = require("@mui/x-date-pickers/PickersTextField");
var DateTimeField_1 = require("@mui/x-date-pickers/DateTimeField");
var pickers_1 = require("test/utils/pickers");
var describeConformance_1 = require("test/utils/describeConformance");
describe('<DateTimeField /> - Describe Conformance', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, describeConformance_1.describeConformance)(<DateTimeField_1.DateTimeField />, function () { return ({
        classes: {},
        inheritComponent: PickersTextField_1.PickersTextField,
        render: render,
        muiName: 'MuiDateTimeField',
        refInstanceof: window.HTMLDivElement,
        skip: ['componentProp', 'componentsProp', 'themeVariants', 'themeStyleOverrides'],
    }); });
});
