"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var pickers_1 = require("test/utils/pickers");
var MobileDatePicker_1 = require("@mui/x-date-pickers/MobileDatePicker");
var describeConformance_1 = require("test/utils/describeConformance");
describe('<MobileDatePicker /> - Describe Conformance', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describePicker)(MobileDatePicker_1.MobileDatePicker, { render: render, fieldType: 'single-input', variant: 'mobile' });
    (0, describeConformance_1.describeConformance)(<MobileDatePicker_1.MobileDatePicker />, function () { return ({
        classes: {},
        render: render,
        muiName: 'MuiMobileDatePicker',
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
