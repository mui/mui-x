"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var DatePicker_1 = require("@mui/x-date-pickers/DatePicker");
var pickers_1 = require("test/utils/pickers");
var describeConformance_1 = require("test/utils/describeConformance");
describe('<DatePicker /> - Describe Conformance', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, describeConformance_1.describeConformance)(<DatePicker_1.DatePicker />, function () { return ({
        classes: {},
        render: render,
        muiName: 'MuiDatePicker',
        refInstanceof: window.HTMLDivElement,
        skip: [
            'componentProp',
            'componentsProp',
            'themeDefaultProps',
            'themeStyleOverrides',
            'themeVariants',
            'mergeClassName',
            'propsSpread',
        ],
    }); });
});
