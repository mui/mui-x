"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var SparkLineChart_1 = require("@mui/x-charts/SparkLineChart");
describe('<SparkLineChart />', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    (0, internal_test_utils_1.describeConformance)((0, jsx_runtime_1.jsx)(SparkLineChart_1.SparkLineChart, { height: 100, width: 100, data: [100, 200] }), function () { return ({
        classes: {},
        inheritComponent: 'svg',
        render: render,
        muiName: 'MuiSparkLineChart',
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
