"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var pickers_1 = require("test/utils/pickers");
var StaticDateTimePicker_1 = require("@mui/x-date-pickers/StaticDateTimePicker");
var describeConformance_1 = require("test/utils/describeConformance");
describe('<StaticDateTimePicker /> - Describe Conformance', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describePicker)(StaticDateTimePicker_1.StaticDateTimePicker, { render: render, fieldType: 'single-input', variant: 'static' });
    (0, describeConformance_1.describeConformance)(<StaticDateTimePicker_1.StaticDateTimePicker />, function () { return ({
        classes: {},
        render: render,
        muiName: 'MuiStaticDateTimePicker',
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
