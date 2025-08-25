"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var MobileDateRangePicker_1 = require("@mui/x-date-pickers-pro/MobileDateRangePicker");
var pickers_1 = require("test/utils/pickers");
var describeConformance_1 = require("test/utils/describeConformance");
describe('<MobileDateRangePicker /> - Describe Conformance', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describePicker)(MobileDateRangePicker_1.MobileDateRangePicker, { render: render, fieldType: 'multi-input', variant: 'mobile' });
    (0, describeConformance_1.describeConformance)(<MobileDateRangePicker_1.MobileDateRangePicker />, function () { return ({
        classes: {},
        render: render,
        muiName: 'MuiMobileDateRangePicker',
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
