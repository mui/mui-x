"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var ChartDataProvider_1 = require("@mui/x-charts/ChartDataProvider");
describe('<ChartDataProvider />', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    (0, internal_test_utils_1.describeConformance)((0, jsx_runtime_1.jsx)(ChartDataProvider_1.ChartDataProvider, { height: 100, width: 100, series: [] }), function () { return ({
        classes: {},
        inheritComponent: 'svg',
        render: render,
        muiName: 'MuiChartDataProvider',
        testComponentPropWith: 'div',
        refInstanceof: window.SVGSVGElement,
        skip: [
            'mergeClassName',
            'propsSpread',
            'rootClass',
            'refForwarding',
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
