"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var pickers_1 = require("test/utils/pickers");
var DesktopTimePicker_1 = require("@mui/x-date-pickers/DesktopTimePicker");
var describeConformance_1 = require("test/utils/describeConformance");
describe('<DesktopTimePicker /> - Describe Conformance', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describePicker)(DesktopTimePicker_1.DesktopTimePicker, {
        render: render,
        fieldType: 'single-input',
        variant: 'desktop',
    });
    (0, describeConformance_1.describeConformance)(<DesktopTimePicker_1.DesktopTimePicker />, function () { return ({
        classes: {},
        render: render,
        muiName: 'MuiDesktopTimePicker',
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
