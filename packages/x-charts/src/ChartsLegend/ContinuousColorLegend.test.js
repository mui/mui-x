"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var ChartsLegend_1 = require("@mui/x-charts/ChartsLegend");
var ChartDataProvider_1 = require("@mui/x-charts/ChartDataProvider");
var ChartsSurface_1 = require("@mui/x-charts/ChartsSurface");
var styles_1 = require("@mui/material/styles");
describe('<ContinuousColorLegend />', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    (0, internal_test_utils_1.describeConformance)(<ChartsLegend_1.ContinuousColorLegend />, function () { return ({
        classes: ChartsLegend_1.continuousColorLegendClasses,
        inheritComponent: 'ul',
        render: function (node) {
            return render(node, {
                wrapper: function (_a) {
                    var children = _a.children;
                    return (<ChartDataProvider_1.ChartDataProvider height={50} width={50} series={[
                            {
                                type: 'line',
                                label: 'Line 1',
                                data: [10, 20, 30, 40, 50],
                            },
                        ]} zAxis={[
                            {
                                colorMap: {
                                    type: 'continuous',
                                    min: -0.5,
                                    max: 1.5,
                                    color: function (t) { return "".concat(t); },
                                },
                            },
                        ]}>
            {/* Has to be first as describeConformance picks the "first child" */}
            {/* https://github.com/mui/material-ui/blob/c0620e333641deda56f3cd68c7c3736098ee818c/packages-internal/test-utils/src/describeConformance.tsx#L257 */}
            {children}
            <ChartsSurface_1.ChartsSurface />
          </ChartDataProvider_1.ChartDataProvider>);
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
