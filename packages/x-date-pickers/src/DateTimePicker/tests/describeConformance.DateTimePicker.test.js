"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var DateTimePicker_1 = require("@mui/x-date-pickers/DateTimePicker");
var pickers_1 = require("test/utils/pickers");
var describeConformance_1 = require("test/utils/describeConformance");
describe('<DateTimePicker /> - Describe Conformance', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, describeConformance_1.describeConformance)(<DateTimePicker_1.DateTimePicker />, function () { return ({
        classes: {},
        render: render,
        muiName: 'MuiDateTimePicker',
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
