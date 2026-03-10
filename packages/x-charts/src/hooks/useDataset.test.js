"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var useDataset_1 = require("./useDataset");
var ChartProvider_1 = require("../context/ChartProvider");
var defaultSeriesConfig_1 = require("../internals/plugins/utils/defaultSeriesConfig");
function UseDataset() {
    var dataset = (0, useDataset_1.useDataset)();
    return (0, jsx_runtime_1.jsx)("div", { children: dataset ? dataset.length : 'no-dataset' });
}
describe('useDataset', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    it('should return undefined when no dataset is provided', function () {
        render((0, jsx_runtime_1.jsx)(ChartProvider_1.ChartProvider, { pluginParams: {
                series: [{ type: 'bar', id: 'test-id', data: [1, 2] }],
                width: 200,
                height: 200,
                seriesConfig: defaultSeriesConfig_1.defaultSeriesConfig,
            }, children: (0, jsx_runtime_1.jsx)(UseDataset, {}) }));
        expect(internal_test_utils_1.screen.getByText('no-dataset')).toBeVisible();
    });
    it('should return the dataset when provided', function () {
        var dataset = [
            { x: 1, y: 10 },
            { x: 2, y: 20 },
            { x: 3, y: 30 },
        ];
        render((0, jsx_runtime_1.jsx)(ChartProvider_1.ChartProvider, { pluginParams: {
                dataset: dataset,
                series: [
                    {
                        type: 'line',
                        id: 'test-id',
                        dataKey: 'y',
                    },
                ],
                width: 200,
                height: 200,
                seriesConfig: defaultSeriesConfig_1.defaultSeriesConfig,
            }, children: (0, jsx_runtime_1.jsx)(UseDataset, {}) }));
        expect(internal_test_utils_1.screen.getByText('3')).toBeVisible();
    });
});
