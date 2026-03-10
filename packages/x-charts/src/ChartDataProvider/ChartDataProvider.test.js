"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var ChartsDataProvider_1 = require("@mui/x-charts/ChartsDataProvider");
describe('<ChartsDataProvider />', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    (0, internal_test_utils_1.describeConformance)((0, jsx_runtime_1.jsx)(ChartsDataProvider_1.ChartsDataProvider, { height: 100, width: 100, series: [] }), function () { return ({
        classes: {},
        inheritComponent: 'div',
        render: render,
        muiName: 'MuiChartsDataProvider',
        testComponentPropWith: 'div',
        refInstanceof: window.HTMLDivElement,
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
