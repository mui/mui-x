"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
var DesktopTimeRangePicker_1 = require("@mui/x-date-pickers-pro/DesktopTimeRangePicker");
describe('<DesktopTimeRangePicker /> - Describe Conformance', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describePicker)(DesktopTimeRangePicker_1.DesktopTimeRangePicker, {
        render: render,
        fieldType: 'single-input',
        variant: 'desktop',
    });
    (0, internal_test_utils_1.describeConformance)(<DesktopTimeRangePicker_1.DesktopTimeRangePicker />, function () { return ({
        classes: {},
        render: render,
        muiName: 'MuiDesktopTimeRangePicker',
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
