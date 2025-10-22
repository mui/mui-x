"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var Gauge_1 = require("@mui/x-charts/Gauge");
describe('<Gauge />', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    (0, internal_test_utils_1.describeConformance)(<Gauge_1.Gauge height={100} width={100} value={60}/>, function () { return ({
        classes: {},
        inheritComponent: 'svg',
        render: render,
        muiName: 'MuiGauge',
        testComponentPropWith: 'div',
        refInstanceof: window.SVGSVGElement,
        skip: [
            'componentProp',
            'componentsProp',
            'slotPropsProp',
            'slotPropsCallback',
            'slotsProp',
            'themeDefaultProps',
            'themeStyleOverrides',
            'themeVariants',
            'themeCustomPalette',
        ],
    }); });
});
