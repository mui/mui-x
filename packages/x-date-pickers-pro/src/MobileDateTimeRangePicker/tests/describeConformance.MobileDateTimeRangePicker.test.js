"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
var MobileDateTimeRangePicker_1 = require("@mui/x-date-pickers-pro/MobileDateTimeRangePicker");
describe('<MobileDateTimeRangePicker /> - Describe Conformance', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, pickers_1.describePicker)(MobileDateTimeRangePicker_1.MobileDateTimeRangePicker, {
        render: render,
        fieldType: 'single-input',
        variant: 'mobile',
    });
    (0, internal_test_utils_1.describeConformance)(<MobileDateTimeRangePicker_1.MobileDateTimeRangePicker />, function () { return ({
        classes: {},
        render: render,
        muiName: 'MuiMobileDateTimeRangePicker',
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
