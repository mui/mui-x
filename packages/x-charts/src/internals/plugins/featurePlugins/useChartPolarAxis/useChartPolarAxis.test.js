"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var skipIf_1 = require("test/utils/skipIf");
var ChartDataProvider_1 = require("@mui/x-charts/ChartDataProvider");
var useChartPolarAxis_1 = require("./useChartPolarAxis");
describe('useChartPolarAxis', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    // can't catch render errors in the browser for unknown reason
    // tried try-catch + error boundary + window onError preventDefault
    it.skipIf(!skipIf_1.isJSDOM)('should throw an error when axis have duplicate ids', function () {
        var expectedError = [
            'MUI X Charts: The following axis ids are duplicated: qwerty.',
            'Please make sure that each axis has a unique id.',
        ].join('\n');
        expect(function () {
            return render((0, jsx_runtime_1.jsx)(ChartDataProvider_1.ChartDataProvider, { rotationAxis: [
                    { scaleType: 'band', id: 'qwerty', data: ['a', 'b', 'c'] },
                    { scaleType: 'band', id: 'qwerty', data: ['a', 'b', 'c'] },
                ], height: 100, width: 100, plugins: [useChartPolarAxis_1.useChartPolarAxis] }));
        }).toErrorDev(expectedError);
    });
    // can't catch render errors in the browser for unknown reason
    // tried try-catch + error boundary + window onError preventDefault
    it.skipIf(!skipIf_1.isJSDOM)('should throw an error when axis have duplicate ids across different directions (radius, rotation)', function () {
        var expectedError = [
            'MUI X Charts: The following axis ids are duplicated: qwerty.',
            'Please make sure that each axis has a unique id.',
        ].join('\n');
        expect(function () {
            return render((0, jsx_runtime_1.jsx)(ChartDataProvider_1.ChartDataProvider, { rotationAxis: [{ scaleType: 'band', id: 'qwerty', data: ['a', 'b', 'c'] }], radiusAxis: [{ id: 'qwerty' }], height: 100, width: 100, plugins: [useChartPolarAxis_1.useChartPolarAxis] }));
        }).toErrorDev(expectedError);
    });
});
