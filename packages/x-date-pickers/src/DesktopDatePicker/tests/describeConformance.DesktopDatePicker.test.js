"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var pickers_1 = require("test/utils/pickers");
var DesktopDatePicker_1 = require("@mui/x-date-pickers/DesktopDatePicker");
var describeConformance_1 = require("test/utils/describeConformance");
describe('<DesktopDatePicker /> - Describe Conformance', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describePicker)(DesktopDatePicker_1.DesktopDatePicker, { render: render, fieldType: 'single-input', variant: 'desktop' });
    (0, describeConformance_1.describeConformance)(<DesktopDatePicker_1.DesktopDatePicker />, function () { return ({
        classes: {},
        render: render,
        muiName: 'MuiDesktopDatePicker',
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
