"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var internal_test_utils_1 = require("@mui/internal-test-utils");
var React = require("react");
var useFunnelSeries_1 = require("./useFunnelSeries");
var FunnelChart_1 = require("../FunnelChart");
var mockSeries = [
    {
        type: 'funnel',
        id: '1',
        data: [{ value: 100 }, { value: 200 }, { value: 300 }],
    },
    {
        type: 'funnel',
        id: '2',
        data: [{ value: 400 }, { value: 500 }, { value: 600 }],
    },
];
var defaultProps = {
    series: mockSeries,
    height: 400,
    width: 400,
};
var options = {
    wrapper: function (_a) {
        var children = _a.children;
        return <FunnelChart_1.FunnelChart {...defaultProps}>{children}</FunnelChart_1.FunnelChart>;
    },
};
describe('useFunnelSeriesContext', function () {
    it('should return all funnel series when no seriesIds are provided', function () {
        var _a, _b, _c;
        var result = (0, internal_test_utils_1.renderHook)(function () { return (0, useFunnelSeries_1.useFunnelSeriesContext)(); }, options).result;
        expect((_a = result.current) === null || _a === void 0 ? void 0 : _a.seriesOrder).to.deep.equal(['1', '2']);
        expect(Object.keys((_c = (_b = result.current) === null || _b === void 0 ? void 0 : _b.series) !== null && _c !== void 0 ? _c : {})).to.deep.equal(['1', '2']);
    });
});
describe('useFunnelSeries', function () {
    it('should return the specific funnel series when a single seriesId is provided', function () {
        var _a;
        var result = (0, internal_test_utils_1.renderHook)(function () { return (0, useFunnelSeries_1.useFunnelSeries)('1'); }, options).result;
        expect((_a = result.current) === null || _a === void 0 ? void 0 : _a.id).to.deep.equal(mockSeries[0].id);
    });
    it('should return all funnel series when no seriesId is provided', function () {
        var _a;
        var result = (0, internal_test_utils_1.renderHook)(function () { return (0, useFunnelSeries_1.useFunnelSeries)(); }, options).result;
        expect((_a = result.current) === null || _a === void 0 ? void 0 : _a.map(function (v) { return v === null || v === void 0 ? void 0 : v.id; })).to.deep.equal([mockSeries[0].id, mockSeries[1].id]);
    });
    it('should return the specific funnel series when multiple seriesIds are provided', function () {
        var _a;
        var result = (0, internal_test_utils_1.renderHook)(function () { return (0, useFunnelSeries_1.useFunnelSeries)(['2', '1']); }, options).result;
        expect((_a = result.current) === null || _a === void 0 ? void 0 : _a.map(function (v) { return v === null || v === void 0 ? void 0 : v.id; })).to.deep.equal([mockSeries[1].id, mockSeries[0].id]);
    });
    it('should return undefined series when invalid seriesIds are provided', function () {
        var _a;
        var message = [
            "MUI X Charts: The following ids provided to \"useFunnelSeries\" could not be found: \"3\".",
            "Make sure that they exist and their series are using the \"funnel\" series type.",
        ].join('\n');
        var render;
        expect(function () {
            render = (0, internal_test_utils_1.renderHook)(function () { return (0, useFunnelSeries_1.useFunnelSeries)(['1', '3']); }, options);
        }).toWarnDev(message);
        expect((_a = render === null || render === void 0 ? void 0 : render.result.current) === null || _a === void 0 ? void 0 : _a.map(function (v) { return v === null || v === void 0 ? void 0 : v.id; })).to.deep.equal([mockSeries[0].id]);
    });
});
