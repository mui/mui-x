"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
var MobileTimeRangePicker_1 = require("@mui/x-date-pickers-pro/MobileTimeRangePicker");
describe('<MobileTimeRangePicker /> - Describe Conformance', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describePicker)(MobileTimeRangePicker_1.MobileTimeRangePicker, {
        render: render,
        fieldType: 'single-input',
        variant: 'mobile',
    });
    (0, internal_test_utils_1.describeConformance)(<MobileTimeRangePicker_1.MobileTimeRangePicker />, function () { return ({
        classes: {},
        render: render,
        muiName: 'MuiMobileTimeRangePicker',
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
