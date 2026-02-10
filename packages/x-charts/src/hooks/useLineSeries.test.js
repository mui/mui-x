"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var React = require("react");
var useLineSeries_1 = require("./useLineSeries");
var LineChart_1 = require("../LineChart");
var mockSeries = [
    {
        type: 'line',
        id: '1',
        data: [1, 2, 3],
    },
    {
        type: 'line',
        id: '2',
        data: [4, 5, 6],
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
        return (0, jsx_runtime_1.jsx)(LineChart_1.LineChart, __assign({}, defaultProps, { children: children }));
    },
};
describe('useLineSeriesContext', function () {
    it('should return all line series when no seriesIds are provided', function () {
        var _a, _b, _c;
        var result = (0, internal_test_utils_1.renderHook)(function () { return (0, useLineSeries_1.useLineSeriesContext)(); }, options).result;
        expect((_a = result.current) === null || _a === void 0 ? void 0 : _a.seriesOrder).to.deep.equal(['1', '2']);
        expect(Object.keys((_c = (_b = result.current) === null || _b === void 0 ? void 0 : _b.series) !== null && _c !== void 0 ? _c : {})).to.deep.equal(['1', '2']);
    });
});
describe('useLineSeries', function () {
    it('should return the specific line series when a single seriesId is provided', function () {
        var _a;
        var result = (0, internal_test_utils_1.renderHook)(function () { return (0, useLineSeries_1.useLineSeries)('1'); }, options).result;
        expect((_a = result.current) === null || _a === void 0 ? void 0 : _a.id).to.deep.equal(mockSeries[0].id);
    });
    it('should return all line series when no seriesId is provided', function () {
        var _a;
        var result = (0, internal_test_utils_1.renderHook)(function () { return (0, useLineSeries_1.useLineSeries)(); }, options).result;
        expect((_a = result.current) === null || _a === void 0 ? void 0 : _a.map(function (v) { return v === null || v === void 0 ? void 0 : v.id; })).to.deep.equal([mockSeries[0].id, mockSeries[1].id]);
    });
    it('should return the specific line series when multiple seriesIds are provided', function () {
        var _a;
        var result = (0, internal_test_utils_1.renderHook)(function () { return (0, useLineSeries_1.useLineSeries)(['2', '1']); }, options).result;
        expect((_a = result.current) === null || _a === void 0 ? void 0 : _a.map(function (v) { return v === null || v === void 0 ? void 0 : v.id; })).to.deep.equal([mockSeries[1].id, mockSeries[0].id]);
    });
    it('should return undefined series when invalid seriesIds are provided', function () {
        var _a;
        var message = [
            "MUI X Charts: The following ids provided to \"useLineSeries\" could not be found: \"3\".",
            "Make sure that they exist and their series are using the \"line\" series type.",
        ].join('\n');
        var render;
        expect(function () {
            render = (0, internal_test_utils_1.renderHook)(function () { return (0, useLineSeries_1.useLineSeries)(['1', '3']); }, options);
        }).toWarnDev(message);
        expect((_a = render === null || render === void 0 ? void 0 : render.result.current) === null || _a === void 0 ? void 0 : _a.map(function (v) { return v === null || v === void 0 ? void 0 : v.id; })).to.deep.equal([mockSeries[0].id]);
    });
    it('should return empty array when empty seriesIds array is provided', function () {
        var result = (0, internal_test_utils_1.renderHook)(function () { return (0, useLineSeries_1.useLineSeries)([]); }, options).result;
        expect(result.current).to.deep.equal([]);
    });
});
