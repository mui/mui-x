"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var DateRangePicker_1 = require("@mui/x-date-pickers-pro/DateRangePicker");
var pickers_1 = require("test/utils/pickers");
var describeConformance_1 = require("test/utils/describeConformance");
describe('<DateRangePicker /> - Describe Conformance', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, describeConformance_1.describeConformance)(<DateRangePicker_1.DateRangePicker />, function () { return ({
        classes: {},
        render: render,
        muiName: 'MuiDateRangePicker',
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
