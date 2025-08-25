"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var pickers_1 = require("test/utils/pickers");
var TimeField_1 = require("@mui/x-date-pickers/TimeField");
var PickersTextField_1 = require("@mui/x-date-pickers/PickersTextField");
var describeConformance_1 = require("test/utils/describeConformance");
describe('<TimeField /> - Describe Conformance', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, describeConformance_1.describeConformance)(<TimeField_1.TimeField />, function () { return ({
        classes: {},
        inheritComponent: PickersTextField_1.PickersTextField,
        render: render,
        muiName: 'MuiTimeField',
        refInstanceof: window.HTMLDivElement,
        skip: ['componentProp', 'componentsProp', 'themeVariants', 'themeStyleOverrides'],
    }); });
});
