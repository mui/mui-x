"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var ChartsLegend_1 = require("@mui/x-charts/ChartsLegend");
var ChartDataProvider_1 = require("@mui/x-charts/ChartDataProvider");
var ChartsSurface_1 = require("@mui/x-charts/ChartsSurface");
var styles_1 = require("@mui/material/styles");
describe('<PiecewiseColorLegend />', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    (0, internal_test_utils_1.describeConformance)(<ChartsLegend_1.PiecewiseColorLegend />, function () { return ({
        classes: ChartsLegend_1.piecewiseColorLegendClasses,
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
                                    type: 'piecewise',
                                    thresholds: [new Date(1961, 0, 1), new Date(1990, 0, 1)],
                                    colors: ['blue', 'gray', 'red'],
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
        muiName: 'MuiPiecewiseColorLegend',
        testComponentPropWith: 'ul',
        refInstanceof: window.HTMLUListElement,
        ThemeProvider: styles_1.ThemeProvider,
        createTheme: styles_1.createTheme,
        // SKIP
        skip: ['themeVariants', 'componentProp', 'componentsProp'],
    }); });
    it('should apply inline-start class when labelPosition="inline-start"', function () {
        render(<ChartDataProvider_1.ChartDataProvider height={50} width={50} series={[
                {
                    type: 'line',
                    label: 'Line 1',
                    data: [10, 20, 30, 40, 50],
                },
            ]} zAxis={[
                {
                    colorMap: {
                        type: 'piecewise',
                        thresholds: [new Date(1961, 0, 1), new Date(1990, 0, 1)],
                        colors: ['blue', 'gray', 'red'],
                    },
                },
            ]}>
        <ChartsLegend_1.PiecewiseColorLegend labelPosition="inline-start"/>
        <ChartsSurface_1.ChartsSurface />
      </ChartDataProvider_1.ChartDataProvider>);
        expect(internal_test_utils_1.screen.getByRole('list').className).contains(ChartsLegend_1.piecewiseColorLegendClasses.inlineStart);
    });
    it('should apply inline-end class when labelPosition="inline-end"', function () {
        render(<ChartDataProvider_1.ChartDataProvider height={50} width={50} series={[
                {
                    type: 'line',
                    label: 'Line 1',
                    data: [10, 20, 30, 40, 50],
                },
            ]} zAxis={[
                {
                    colorMap: {
                        type: 'piecewise',
                        thresholds: [new Date(1961, 0, 1), new Date(1990, 0, 1)],
                        colors: ['blue', 'gray', 'red'],
                    },
                },
            ]}>
        <ChartsLegend_1.PiecewiseColorLegend labelPosition="inline-end"/>
        <ChartsSurface_1.ChartsSurface />
      </ChartDataProvider_1.ChartDataProvider>);
        expect(internal_test_utils_1.screen.getByRole('list').className).contains(ChartsLegend_1.piecewiseColorLegendClasses.inlineEnd);
    });
});
