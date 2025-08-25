"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
var DesktopDateTimeRangePicker_1 = require("../DesktopDateTimeRangePicker");
describe('<DesktopDateTimeRangePicker /> - Describe Conformance', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describePicker)(DesktopDateTimeRangePicker_1.DesktopDateTimeRangePicker, {
        render: render,
        fieldType: 'multi-input',
        variant: 'desktop',
    });
    (0, internal_test_utils_1.describeConformance)(<DesktopDateTimeRangePicker_1.DesktopDateTimeRangePicker />, function () { return ({
        classes: {},
        render: render,
        muiName: 'MuiDesktopDateTimeRangePicker',
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
