"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var pickers_1 = require("test/utils/pickers");
var StaticDatePicker_1 = require("@mui/x-date-pickers/StaticDatePicker");
var describeConformance_1 = require("test/utils/describeConformance");
describe('<StaticDatePicker /> - Describe Conformance', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describePicker)(StaticDatePicker_1.StaticDatePicker, { render: render, fieldType: 'single-input', variant: 'static' });
    (0, describeConformance_1.describeConformance)(<StaticDatePicker_1.StaticDatePicker />, function () { return ({
        classes: {},
        render: render,
        muiName: 'MuiStaticDatePicker',
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
