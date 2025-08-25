"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var PickersTextField_1 = require("@mui/x-date-pickers/PickersTextField");
var DateField_1 = require("@mui/x-date-pickers/DateField");
var pickers_1 = require("test/utils/pickers");
var describeConformance_1 = require("test/utils/describeConformance");
describe('<DateField /> - Describe Conformance', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, describeConformance_1.describeConformance)(<DateField_1.DateField />, function () { return ({
        classes: {},
        inheritComponent: PickersTextField_1.PickersTextField,
        render: render,
        muiName: 'MuiDateField',
        refInstanceof: window.HTMLDivElement,
        skip: ['componentProp', 'componentsProp', 'themeVariants', 'themeStyleOverrides'],
    }); });
});
