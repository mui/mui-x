"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var MultiInputTimeRangeField_1 = require("@mui/x-date-pickers-pro/MultiInputTimeRangeField");
var pickers_1 = require("test/utils/pickers");
var describeConformance_1 = require("test/utils/describeConformance");
describe('<MultiInputTimeRangeField /> - Describe Conformance', function () {
    var render = (0, pickers_1.createPickerRenderer)({
        clockConfig: new Date(2018, 0, 10),
    }).render;
    (0, describeConformance_1.describeConformance)(<MultiInputTimeRangeField_1.MultiInputTimeRangeField />, function () { return ({
        classes: {},
        inheritComponent: 'div',
        render: render,
        muiName: 'MuiMultiInputTimeRangeField',
        refInstanceof: window.HTMLDivElement,
        skip: ['themeVariants', 'componentProp', 'componentsProp'],
    }); });
});
