"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var internal_test_utils_1 = require("@mui/internal-test-utils");
var React = require("react");
var useHeatmapSeries_1 = require("./useHeatmapSeries");
var Heatmap_1 = require("../Heatmap");
var mockSeries = [
    {
        type: 'heatmap',
        id: '1',
        data: [
            [0, 0, 10],
            [0, 1, 20],
            [0, 2, 40],
        ],
    },
    {
        type: 'heatmap',
        id: '2',
        data: [
            [1, 0, 20],
            [1, 1, 70],
            [1, 2, 90],
        ],
    },
];
var defaultProps = {
    series: mockSeries,
    height: 400,
    width: 400,
    xAxis: [{ data: [1, 2, 3] }],
    yAxis: [{ data: ['A', 'B', 'C'] }],
};
var options = {
    wrapper: function (_a) {
        var children = _a.children;
        return <Heatmap_1.Heatmap {...defaultProps}>{children}</Heatmap_1.Heatmap>;
    },
};
describe('useHeatmapSeriesContext', function () {
    it('should return all heatmap series when no seriesIds are provided', function () {
        var _a, _b, _c;
        var result = (0, internal_test_utils_1.renderHook)(function () { return (0, useHeatmapSeries_1.useHeatmapSeriesContext)(); }, options).result;
        expect((_a = result.current) === null || _a === void 0 ? void 0 : _a.seriesOrder).to.deep.equal(['1', '2']);
        expect(Object.keys((_c = (_b = result.current) === null || _b === void 0 ? void 0 : _b.series) !== null && _c !== void 0 ? _c : {})).to.deep.equal(['1', '2']);
    });
});
describe('useHeatmapSeries', function () {
    it('should return the specific heatmap series when a single seriesId is provided', function () {
        var _a;
        var result = (0, internal_test_utils_1.renderHook)(function () { return (0, useHeatmapSeries_1.useHeatmapSeries)('1'); }, options).result;
        expect((_a = result.current) === null || _a === void 0 ? void 0 : _a.id).to.deep.equal(mockSeries[0].id);
    });
    it('should return all heatmap series when no seriesId is provided', function () {
        var _a;
        var result = (0, internal_test_utils_1.renderHook)(function () { return (0, useHeatmapSeries_1.useHeatmapSeries)(); }, options).result;
        expect((_a = result.current) === null || _a === void 0 ? void 0 : _a.map(function (v) { return v === null || v === void 0 ? void 0 : v.id; })).to.deep.equal([mockSeries[0].id, mockSeries[1].id]);
    });
    it('should return the specific heatmap series when multiple seriesIds are provided', function () {
        var _a;
        var result = (0, internal_test_utils_1.renderHook)(function () { return (0, useHeatmapSeries_1.useHeatmapSeries)(['2', '1']); }, options).result;
        expect((_a = result.current) === null || _a === void 0 ? void 0 : _a.map(function (v) { return v === null || v === void 0 ? void 0 : v.id; })).to.deep.equal([mockSeries[1].id, mockSeries[0].id]);
    });
    it('should return undefined series when invalid seriesIds are provided', function () {
        var _a;
        var message = [
            "MUI X Charts: The following ids provided to \"useHeatmapSeries\" could not be found: \"3\".",
            "Make sure that they exist and their series are using the \"heatmap\" series type.",
        ].join('\n');
        var render;
        expect(function () {
            render = (0, internal_test_utils_1.renderHook)(function () { return (0, useHeatmapSeries_1.useHeatmapSeries)(['1', '3']); }, options);
        }).toWarnDev(message);
        expect((_a = render === null || render === void 0 ? void 0 : render.result.current) === null || _a === void 0 ? void 0 : _a.map(function (v) { return v === null || v === void 0 ? void 0 : v.id; })).to.deep.equal([mockSeries[0].id]);
    });
});
