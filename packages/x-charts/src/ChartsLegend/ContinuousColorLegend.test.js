"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var ChartsLegend_1 = require("@mui/x-charts/ChartsLegend");
var ChartDataProvider_1 = require("@mui/x-charts/ChartDataProvider");
var ChartsSurface_1 = require("@mui/x-charts/ChartsSurface");
var styles_1 = require("@mui/material/styles");
describe('<ContinuousColorLegend />', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    (0, internal_test_utils_1.describeConformance)((0, jsx_runtime_1.jsx)(ChartsLegend_1.ContinuousColorLegend, {}), function () { return ({
        classes: ChartsLegend_1.continuousColorLegendClasses,
        inheritComponent: 'ul',
        render: function (node) {
            return render(node, {
                wrapper: function (_a) {
                    var children = _a.children;
                    return ((0, jsx_runtime_1.jsxs)(ChartDataProvider_1.ChartDataProvider, { height: 50, width: 50, series: [
                            {
                                type: 'line',
                                label: 'Line 1',
                                data: [10, 20, 30, 40, 50],
                            },
                        ], zAxis: [
                            {
                                colorMap: {
                                    type: 'continuous',
                                    min: -0.5,
                                    max: 1.5,
                                    color: function (t) { return "".concat(t); },
                                },
                            },
                        ], children: [children, (0, jsx_runtime_1.jsx)(ChartsSurface_1.ChartsSurface, {})] }));
                },
            });
        },
        muiName: 'MuiContinuousColorLegend',
        testComponentPropWith: 'ul',
        refInstanceof: window.HTMLUListElement,
        ThemeProvider: styles_1.ThemeProvider,
        createTheme: styles_1.createTheme,
        // SKIP
        skip: ['themeVariants', 'componentProp', 'componentsProp'],
    }); });
});
