"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var SingleInputTimeRangeField_1 = require("@mui/x-date-pickers-pro/SingleInputTimeRangeField");
var pickers_1 = require("test/utils/pickers");
var describeConformance_1 = require("test/utils/describeConformance");
describe('<SingleInputTimeRangeField /> - Describe Conformance', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, describeConformance_1.describeConformance)(<SingleInputTimeRangeField_1.SingleInputTimeRangeField />, function () { return ({
        classes: {},
        inheritComponent: 'div',
        render: render,
        muiName: 'MuiSingleInputTimeRangeField',
        refInstanceof: window.HTMLDivElement,
        skip: ['componentProp', 'componentsProp', 'themeVariants', 'themeStyleOverrides'],
    }); });
});
