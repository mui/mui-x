"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var useChartGradientId_1 = require("./useChartGradientId");
var ChartDataProvider_1 = require("../ChartDataProvider");
function UseGradientId() {
    var id = (0, useChartGradientId_1.useChartGradientId)('test-id');
    return (0, jsx_runtime_1.jsx)("div", { children: id });
}
function UseGradientIdObjectBound() {
    var id = (0, useChartGradientId_1.useChartGradientIdObjectBound)('test-id');
    return (0, jsx_runtime_1.jsx)("div", { children: id });
}
describe('useChartGradientId', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    it('should properly generate a correct id', function () {
        render((0, jsx_runtime_1.jsx)(ChartDataProvider_1.ChartDataProvider, { series: [], height: 100, width: 100, children: (0, jsx_runtime_1.jsx)(UseGradientId, {}) }));
        expect(internal_test_utils_1.screen.getByText(/[«|:|_]\w+[»|:|_]-gradient-test-id/)).toBeVisible();
    });
    describe('useChartGradientIdObjectBound', function () {
        it('should properly generate a correct id', function () {
            render((0, jsx_runtime_1.jsx)(ChartDataProvider_1.ChartDataProvider, { series: [], height: 100, width: 100, children: (0, jsx_runtime_1.jsx)(UseGradientIdObjectBound, {}) }));
            expect(internal_test_utils_1.screen.getByText(/[«|:|_]\w+[»|:|_]-gradient-test-id-object-bound/)).toBeVisible();
        });
    });
});
