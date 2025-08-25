"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var pickers_1 = require("test/utils/pickers");
var DesktopDateRangePicker_1 = require("@mui/x-date-pickers-pro/DesktopDateRangePicker");
var describeConformance_1 = require("test/utils/describeConformance");
describe('<DesktopDateRangePicker /> - Describe Conformance', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describePicker)(DesktopDateRangePicker_1.DesktopDateRangePicker, { render: render, fieldType: 'multi-input', variant: 'desktop' });
    (0, describeConformance_1.describeConformance)(<DesktopDateRangePicker_1.DesktopDateRangePicker />, function () { return ({
        classes: {},
        render: render,
        muiName: 'MuiDesktopDateRangePicker',
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
