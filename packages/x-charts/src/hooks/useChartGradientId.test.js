"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var useChartGradientId_1 = require("./useChartGradientId");
var ChartDataProvider_1 = require("../ChartDataProvider");
function UseGradientId() {
    var id = (0, useChartGradientId_1.useChartGradientId)('test-id');
    return <div>{id}</div>;
}
function UseGradientIdObjectBound() {
    var id = (0, useChartGradientId_1.useChartGradientIdObjectBound)('test-id');
    return <div>{id}</div>;
}
describe('useChartGradientId', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    it('should properly generate a correct id', function () {
        render(<ChartDataProvider_1.ChartDataProvider series={[]} height={100} width={100}>
        <UseGradientId />
      </ChartDataProvider_1.ChartDataProvider>);
        expect(internal_test_utils_1.screen.getByText(/[«|:]\w+[»|:]-gradient-test-id/)).toBeVisible();
    });
    describe('useChartGradientIdObjectBound', function () {
        it('should properly generate a correct id', function () {
            render(<ChartDataProvider_1.ChartDataProvider series={[]} height={100} width={100}>
          <UseGradientIdObjectBound />
        </ChartDataProvider_1.ChartDataProvider>);
            expect(internal_test_utils_1.screen.getByText(/[«|:]\w+[»|:]-gradient-test-id-object-bound/)).toBeVisible();
        });
    });
});
