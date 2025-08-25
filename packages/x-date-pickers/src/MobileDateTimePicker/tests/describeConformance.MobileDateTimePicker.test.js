"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var pickers_1 = require("test/utils/pickers");
var MobileDateTimePicker_1 = require("@mui/x-date-pickers/MobileDateTimePicker");
var describeConformance_1 = require("test/utils/describeConformance");
describe('<MobileDateTimePicker /> - Describe Conformance', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describePicker)(MobileDateTimePicker_1.MobileDateTimePicker, { render: render, fieldType: 'single-input', variant: 'mobile' });
    (0, describeConformance_1.describeConformance)(<MobileDateTimePicker_1.MobileDateTimePicker />, function () { return ({
        classes: {},
        render: render,
        muiName: 'MuiMobileDateTimePicker',
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
