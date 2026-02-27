"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var checkBarChartScaleErrors_1 = require("./checkBarChartScaleErrors");
var constants_1 = require("../constants");
describe('checkBarChartScaleErrors', function () {
    describe('verticalLayout: true', function () {
        it('should throw an error when the x-axis is not a band scale', function () {
            expect(function () {
                var _a, _b;
                var xKey = constants_1.DEFAULT_X_AXIS_KEY;
                var yKey = constants_1.DEFAULT_Y_AXIS_KEY;
                (0, checkBarChartScaleErrors_1.checkBarChartScaleErrors)(true, 'seriesId', 1, xKey, (_a = {}, _a[xKey] = { scaleType: 'linear' }, _a), yKey, (_b = {},
                    _b[yKey] = { scaleType: 'linear' },
                    _b));
            }).throws('MUI X Charts: The first `xAxis` should be of type "band" to display the bar series of id "seriesId".');
        });
        it('should throw an error when the x-axis has no data property', function () {
            expect(function () {
                var _a, _b;
                var xKey = constants_1.DEFAULT_X_AXIS_KEY;
                var yKey = constants_1.DEFAULT_Y_AXIS_KEY;
                (0, checkBarChartScaleErrors_1.checkBarChartScaleErrors)(true, 'seriesId', 1, xKey, (_a = {}, _a[xKey] = { scaleType: 'band' }, _a), yKey, (_b = {},
                    _b[yKey] = { scaleType: 'linear' },
                    _b));
            }).throws('MUI X Charts: The first `xAxis` should have data property.');
        });
        it('should throw an error when the x-axis data property is smaller than the series data.', function () {
            expect(function () {
                var _a, _b;
                var xKey = constants_1.DEFAULT_X_AXIS_KEY;
                var yKey = constants_1.DEFAULT_Y_AXIS_KEY;
                (0, checkBarChartScaleErrors_1.checkBarChartScaleErrors)(true, 'seriesId', 2, xKey, (_a = {}, _a[xKey] = { scaleType: 'band', data: [1] }, _a), yKey, (_b = {}, _b[yKey] = { scaleType: 'linear' }, _b));
            }).toErrorDev('MUI X Charts: The first `xAxis` has less data (1 values) than the bar series of id "seriesId" (2 values)');
        });
        it('should throw an error when the y-axis is not a continuous scale', function () {
            expect(function () {
                var _a, _b;
                var xKey = constants_1.DEFAULT_X_AXIS_KEY;
                var yKey = constants_1.DEFAULT_Y_AXIS_KEY;
                (0, checkBarChartScaleErrors_1.checkBarChartScaleErrors)(true, 'seriesId', 1, xKey, (_a = {}, _a[xKey] = { scaleType: 'band', data: [] }, _a), yKey, (_b = {}, _b[yKey] = { scaleType: 'band' }, _b));
            }).throws('MUI X Charts: The first `yAxis` should be a continuous type to display the bar series of id "seriesId".');
        });
        it('should not throw an error when the scales are correct', function () {
            expect(function () {
                var _a, _b;
                var xKey = constants_1.DEFAULT_X_AXIS_KEY;
                var yKey = constants_1.DEFAULT_Y_AXIS_KEY;
                (0, checkBarChartScaleErrors_1.checkBarChartScaleErrors)(true, 'seriesId', 0, xKey, (_a = {}, _a[xKey] = { scaleType: 'band', data: [] }, _a), yKey, (_b = {}, _b[yKey] = { scaleType: 'linear' }, _b));
            }).not.to.throw();
        });
    });
    describe('verticalLayout: false', function () {
        it('should throw an error when the y-axis is not a band scale', function () {
            expect(function () {
                var _a, _b;
                var xKey = constants_1.DEFAULT_X_AXIS_KEY;
                var yKey = constants_1.DEFAULT_Y_AXIS_KEY;
                (0, checkBarChartScaleErrors_1.checkBarChartScaleErrors)(false, 'seriesId', 1, xKey, (_a = {}, _a[xKey] = { scaleType: 'linear' }, _a), yKey, (_b = {},
                    _b[yKey] = { scaleType: 'linear' },
                    _b));
            }).throws('MUI X Charts: The first `yAxis` should be of type "band" to display the bar series of id "seriesId".');
        });
        it('should throw an error when the y-axis has no data property', function () {
            expect(function () {
                var _a, _b;
                var xKey = constants_1.DEFAULT_X_AXIS_KEY;
                var yKey = constants_1.DEFAULT_Y_AXIS_KEY;
                (0, checkBarChartScaleErrors_1.checkBarChartScaleErrors)(false, 'seriesId', 1, xKey, (_a = {}, _a[xKey] = { scaleType: 'linear' }, _a), yKey, (_b = {},
                    _b[yKey] = { scaleType: 'band' },
                    _b));
            }).throws('MUI X Charts: The first `yAxis` should have data property.');
        });
        it('should throw an error when the x-axis is not a continuous scale', function () {
            expect(function () {
                var _a, _b;
                var xKey = constants_1.DEFAULT_X_AXIS_KEY;
                var yKey = constants_1.DEFAULT_Y_AXIS_KEY;
                (0, checkBarChartScaleErrors_1.checkBarChartScaleErrors)(false, 'seriesId', 1, xKey, (_a = {}, _a[xKey] = { scaleType: 'band' }, _a), yKey, (_b = {},
                    _b[yKey] = { scaleType: 'band', data: [] },
                    _b));
            }).throws('MUI X Charts: The first `xAxis` should be a continuous type to display the bar series of id "seriesId".');
        });
        it('should not throw an error when the scales are correct', function () {
            expect(function () {
                var _a, _b;
                var xKey = constants_1.DEFAULT_X_AXIS_KEY;
                var yKey = constants_1.DEFAULT_Y_AXIS_KEY;
                (0, checkBarChartScaleErrors_1.checkBarChartScaleErrors)(false, 'seriesId', 0, xKey, (_a = {}, _a[xKey] = { scaleType: 'linear' }, _a), yKey, (_b = {},
                    _b[yKey] = { scaleType: 'band', data: [] },
                    _b));
            }).not.to.throw();
        });
    });
    it('should throw an error specifying the x-axis id when it is not the default one', function () {
        expect(function () {
            var _a, _b;
            var xKey = 'x-test';
            var yKey = 'y-test';
            (0, checkBarChartScaleErrors_1.checkBarChartScaleErrors)(true, 'seriesId', 1, xKey, (_a = {}, _a[xKey] = { scaleType: 'linear' }, _a), yKey, (_b = {},
                _b[yKey] = { scaleType: 'band' },
                _b));
        }).throws('MUI X Charts: The x-axis with id "x-test" should be of type "band" to display the bar series of id "seriesId".');
    });
    it('should throw an error specifying the y-axis id when it is not the default one', function () {
        expect(function () {
            var _a, _b;
            var xKey = 'x-test';
            var yKey = 'y-test';
            (0, checkBarChartScaleErrors_1.checkBarChartScaleErrors)(false, 'seriesId', 1, xKey, (_a = {}, _a[xKey] = { scaleType: 'band' }, _a), yKey, (_b = {},
                _b[yKey] = { scaleType: 'linear' },
                _b));
        }).throws('MUI X Charts: The y-axis with id "y-test" should be of type "band" to display the bar series of id "seriesId".');
    });
});
