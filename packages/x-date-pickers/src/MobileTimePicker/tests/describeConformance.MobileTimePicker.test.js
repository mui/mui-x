"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var pickers_1 = require("test/utils/pickers");
var MobileTimePicker_1 = require("@mui/x-date-pickers/MobileTimePicker");
var describeConformance_1 = require("test/utils/describeConformance");
describe('<MobileTimePicker /> - Describe Conformance', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describePicker)(MobileTimePicker_1.MobileTimePicker, { render: render, fieldType: 'single-input', variant: 'mobile' });
    (0, describeConformance_1.describeConformance)(<MobileTimePicker_1.MobileTimePicker />, function () { return ({
        classes: {},
        render: render,
        muiName: 'MuiMobileTimePicker',
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
