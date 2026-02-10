"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var offsetDiverging_1 = require("./offsetDiverging");
/**
 * Generates series data for stacking order tests.
 * Each series is an array of data points, where each data point has a `data` object
 * containing the original value.
 *
 * Use the optional `zeros` parameter to specify custom end values for each data point.
 * The `zeros` array accepts `undefined` to indicate that the default end value should be used.
 *
 * @example
 * ```tsx
 *  const series = generateSeries(
 *    [[10, 5]],
 *    [[undefined, 0]],
 *  );
 * // series will be:
 * [[
 *   { data: { S0: 10 }, 0: 0, 1: 10 },
 *   { data: { S0: 0 }, 0: 0, 1: 5 },
 * ]]
 * ```
 *
 * @param data - A 2D array where each sub-array represents a series and contains the values for that series.
 * @param zeros - (Optional) A 2D array of the same shape as `data` to specify custom end values for each data point.
 * @returns An array of series formatted for stacking order tests.
 */
var generateSeries = function (data, zeros) {
    var series = data.map(function (seriesData, seriesIndex) {
        var points = seriesData.map(function (value, pointIndex) {
            var _a;
            var _b, _c;
            return ({
                data: (_a = {}, _a["S".concat(seriesIndex)] = value, _a),
                0: 0,
                1: ((_b = zeros === null || zeros === void 0 ? void 0 : zeros[seriesIndex]) === null || _b === void 0 ? void 0 : _b[pointIndex]) === undefined
                    ? value
                    : (_c = zeros === null || zeros === void 0 ? void 0 : zeros[seriesIndex]) === null || _c === void 0 ? void 0 : _c[pointIndex],
            });
        });
        points.key = "S".concat(seriesIndex);
        return points;
    });
    return series;
};
describe('offsetDiverging', function () {
    it('should handle empty series array', function () {
        var series = [];
        var order = [];
        (0, offsetDiverging_1.offsetDiverging)(series, order);
        (0, vitest_1.expect)(series).to.deep.equal([]);
    });
    it('should stack positive values above zero', function () {
        var series = generateSeries([
            [10, 20],
            [5, 15],
        ]);
        var order = [0, 1];
        (0, offsetDiverging_1.offsetDiverging)(series, order);
        // First series starts at 0
        (0, vitest_1.expect)(series[0][0][0]).to.equal(0);
        (0, vitest_1.expect)(series[0][0][1]).to.equal(10);
        (0, vitest_1.expect)(series[0][1][0]).to.equal(0);
        (0, vitest_1.expect)(series[0][1][1]).to.equal(20);
        // Second series stacks on top of first
        (0, vitest_1.expect)(series[1][0][0]).to.equal(10);
        (0, vitest_1.expect)(series[1][0][1]).to.equal(15);
        (0, vitest_1.expect)(series[1][1][0]).to.equal(20);
        (0, vitest_1.expect)(series[1][1][1]).to.equal(35);
    });
    it('should stack negative values below zero', function () {
        var series = generateSeries([
            [-10, -20],
            [-5, -15],
        ]);
        var order = [0, 1];
        (0, offsetDiverging_1.offsetDiverging)(series, order);
        // First series starts at 0 and goes negative
        (0, vitest_1.expect)(series[0][0][1]).to.equal(0);
        (0, vitest_1.expect)(series[0][0][0]).to.equal(-10);
        (0, vitest_1.expect)(series[0][1][1]).to.equal(0);
        (0, vitest_1.expect)(series[0][1][0]).to.equal(-20);
        // Second series stacks below first
        (0, vitest_1.expect)(series[1][0][1]).to.equal(-10);
        (0, vitest_1.expect)(series[1][0][0]).to.equal(-15);
        (0, vitest_1.expect)(series[1][1][1]).to.equal(-20);
        (0, vitest_1.expect)(series[1][1][0]).to.equal(-35);
    });
    it('should handle mixed positive and negative values', function () {
        var series = generateSeries([
            [10, -20],
            [-5, 15],
        ]);
        var order = [0, 1];
        (0, offsetDiverging_1.offsetDiverging)(series, order);
        // First point: A=10 (positive), B=-5 (negative)
        (0, vitest_1.expect)(series[0][0][0]).to.equal(0);
        (0, vitest_1.expect)(series[0][0][1]).to.equal(10);
        (0, vitest_1.expect)(series[1][0][1]).to.equal(0);
        (0, vitest_1.expect)(series[1][0][0]).to.equal(-5);
        // Second point: A=-20 (negative), B=15 (positive)
        (0, vitest_1.expect)(series[0][1][1]).to.equal(0);
        (0, vitest_1.expect)(series[0][1][0]).to.equal(-20);
        (0, vitest_1.expect)(series[1][1][0]).to.equal(0);
        (0, vitest_1.expect)(series[1][1][1]).to.equal(15);
    });
    it('should handle zero values with positive original data', function () {
        var series = generateSeries([
            [10, 1],
            [5, 0],
        ]);
        var order = [0, 1];
        (0, offsetDiverging_1.offsetDiverging)(series, order);
        // First point: A=10, B=5
        (0, vitest_1.expect)(series[0][0][0]).to.equal(0);
        (0, vitest_1.expect)(series[0][0][1]).to.equal(10);
        (0, vitest_1.expect)(series[1][0][0]).to.equal(10);
        (0, vitest_1.expect)(series[1][0][1]).to.equal(15);
        // Second point: A=1, B=0 (with positive original data 0 > 0 is false, so uses 0,0)
        (0, vitest_1.expect)(series[0][1][0]).to.equal(0);
        (0, vitest_1.expect)(series[0][1][1]).to.equal(1);
        // B has original value 0 which equals 0, so falls through to else case
        (0, vitest_1.expect)(series[1][1][0]).to.equal(0);
        (0, vitest_1.expect)(series[1][1][1]).to.equal(0);
    });
    it('should handle zero values with negative original data', function () {
        var series = generateSeries([
            [-10, -1],
            [-5, 0],
        ]);
        var order = [0, 1];
        (0, offsetDiverging_1.offsetDiverging)(series, order);
        // First point: A=-10, B=-5
        (0, vitest_1.expect)(series[0][0][1]).to.equal(0);
        (0, vitest_1.expect)(series[0][0][0]).to.equal(-10);
        (0, vitest_1.expect)(series[1][0][1]).to.equal(-10);
        (0, vitest_1.expect)(series[1][0][0]).to.equal(-15);
        // Second point: A=-1, B=0 (with 0 original data, falls through to else)
        (0, vitest_1.expect)(series[0][1][1]).to.equal(0);
        (0, vitest_1.expect)(series[0][1][0]).to.equal(-1);
        (0, vitest_1.expect)(series[1][1][0]).to.equal(0);
        (0, vitest_1.expect)(series[1][1][1]).to.equal(0);
    });
    it('should handle zero values with zero original data', function () {
        var series = generateSeries([[10, 0]]);
        var order = [0];
        (0, offsetDiverging_1.offsetDiverging)(series, order);
        (0, vitest_1.expect)(series[0][0][0]).to.equal(0);
        (0, vitest_1.expect)(series[0][0][1]).to.equal(10);
        (0, vitest_1.expect)(series[0][1][0]).to.equal(0);
        (0, vitest_1.expect)(series[0][1][1]).to.equal(0);
    });
    it('should respect custom order', function () {
        var series = generateSeries([
            [10, 20],
            [5, 15],
        ]);
        var order = [1, 0]; // Reverse order
        (0, offsetDiverging_1.offsetDiverging)(series, order);
        // First series (B) starts at 0
        (0, vitest_1.expect)(series[1][0][0]).to.equal(0);
        (0, vitest_1.expect)(series[1][0][1]).to.equal(5);
        (0, vitest_1.expect)(series[1][1][0]).to.equal(0);
        (0, vitest_1.expect)(series[1][1][1]).to.equal(15);
        // Second series (A) stacks on top
        (0, vitest_1.expect)(series[0][0][0]).to.equal(5);
        (0, vitest_1.expect)(series[0][0][1]).to.equal(15);
        (0, vitest_1.expect)(series[0][1][0]).to.equal(15);
        (0, vitest_1.expect)(series[0][1][1]).to.equal(35);
    });
    it('should handle single series', function () {
        var series = generateSeries([[10, -5, 15]]);
        var order = [0];
        (0, offsetDiverging_1.offsetDiverging)(series, order);
        (0, vitest_1.expect)(series[0][0][0]).to.equal(0);
        (0, vitest_1.expect)(series[0][0][1]).to.equal(10);
        (0, vitest_1.expect)(series[0][1][1]).to.equal(0);
        (0, vitest_1.expect)(series[0][1][0]).to.equal(-5);
        (0, vitest_1.expect)(series[0][2][0]).to.equal(0);
        (0, vitest_1.expect)(series[0][2][1]).to.equal(15);
    });
    it('should handle multiple series with complex stacking', function () {
        var series = generateSeries([
            [10, -10, 5],
            [5, 10, -5],
            [-5, 5, 10],
        ]);
        var order = [0, 1, 2];
        (0, offsetDiverging_1.offsetDiverging)(series, order);
        // Point 0: A=10+, B=5+, C=-5
        (0, vitest_1.expect)(series[0][0][0]).to.equal(0);
        (0, vitest_1.expect)(series[0][0][1]).to.equal(10);
        (0, vitest_1.expect)(series[1][0][0]).to.equal(10);
        (0, vitest_1.expect)(series[1][0][1]).to.equal(15);
        (0, vitest_1.expect)(series[2][0][1]).to.equal(0);
        (0, vitest_1.expect)(series[2][0][0]).to.equal(-5);
        // Point 1: A=-10, B=10+, C=5+
        (0, vitest_1.expect)(series[0][1][1]).to.equal(0);
        (0, vitest_1.expect)(series[0][1][0]).to.equal(-10);
        (0, vitest_1.expect)(series[1][1][0]).to.equal(0);
        (0, vitest_1.expect)(series[1][1][1]).to.equal(10);
        (0, vitest_1.expect)(series[2][1][0]).to.equal(10);
        (0, vitest_1.expect)(series[2][1][1]).to.equal(15);
        // Point 2: A=5+, B=-5, C=10+
        (0, vitest_1.expect)(series[0][2][0]).to.equal(0);
        (0, vitest_1.expect)(series[0][2][1]).to.equal(5);
        (0, vitest_1.expect)(series[1][2][1]).to.equal(0);
        (0, vitest_1.expect)(series[1][2][0]).to.equal(-5);
        (0, vitest_1.expect)(series[2][2][0]).to.equal(5);
        (0, vitest_1.expect)(series[2][2][1]).to.equal(15);
    });
    it('should handle null values in series', function () {
        var series = generateSeries([
            [10, null, 5],
            [null, 15, -5],
        ]);
        var order = [0, 1];
        (0, offsetDiverging_1.offsetDiverging)(series, order);
        // Point 0: A=10, B=null (difference=0)
        (0, vitest_1.expect)(series[0][0][0]).to.equal(0);
        (0, vitest_1.expect)(series[0][0][1]).to.equal(10);
        // B has null, difference = null - 0 = NaN, which is treated as 0
        (0, vitest_1.expect)(series[1][0][0]).to.be.a('number');
        (0, vitest_1.expect)(series[1][0][1]).to.be.a('number');
        // Point 1: A=null (difference=0), B=15
        (0, vitest_1.expect)(series[0][1][0]).to.be.a('number');
        (0, vitest_1.expect)(series[0][1][1]).to.be.a('number');
        (0, vitest_1.expect)(series[1][1][0]).to.be.a('number');
        (0, vitest_1.expect)(series[1][1][1]).to.be.a('number');
        // Point 2: A=5, B=-5
        (0, vitest_1.expect)(series[0][2][0]).to.be.a('number');
        (0, vitest_1.expect)(series[0][2][1]).to.be.a('number');
        (0, vitest_1.expect)(series[1][2][1]).to.be.a('number');
        (0, vitest_1.expect)(series[1][2][0]).to.be.a('number');
    });
    it('should handle null values without breaking stacking order', function () {
        var series = generateSeries([
            [10, 20],
            [null, 5],
        ]);
        var order = [0, 1];
        (0, offsetDiverging_1.offsetDiverging)(series, order);
        // First point: A=10, B=null
        (0, vitest_1.expect)(series[0][0][0]).to.equal(0);
        (0, vitest_1.expect)(series[0][0][1]).to.equal(10);
        // Second point: A=20, B=5
        (0, vitest_1.expect)(series[0][1][0]).to.equal(0);
        (0, vitest_1.expect)(series[0][1][1]).to.equal(20);
        (0, vitest_1.expect)(series[1][1][0]).to.equal(20);
        (0, vitest_1.expect)(series[1][1][1]).to.equal(25);
    });
    it('should handle differently when computed data is 0 but dataset is not', function () {
        var series = generateSeries([
            [10, 20],
            [5, 30],
            [10, 10],
        ], [
            [0, 0],
            [undefined, undefined],
            [undefined, undefined],
        ]);
        var order = [2, 0, 1];
        (0, offsetDiverging_1.offsetDiverging)(series, order);
        // First point: A=10, B=5
        (0, vitest_1.expect)(series[2][0][0]).to.equal(0);
        (0, vitest_1.expect)(series[2][0][1]).to.equal(10);
        (0, vitest_1.expect)(series[0][0][0]).to.equal(10);
        (0, vitest_1.expect)(series[0][0][1]).to.equal(10);
        (0, vitest_1.expect)(series[1][0][0]).to.equal(10);
        (0, vitest_1.expect)(series[1][0][1]).to.equal(15);
        // Second point: A=20, B=30
        (0, vitest_1.expect)(series[2][1][0]).to.equal(0);
        (0, vitest_1.expect)(series[2][1][1]).to.equal(10);
        (0, vitest_1.expect)(series[0][1][0]).to.equal(10);
        (0, vitest_1.expect)(series[0][1][1]).to.equal(10);
        (0, vitest_1.expect)(series[1][1][0]).to.equal(10);
        (0, vitest_1.expect)(series[1][1][1]).to.equal(40);
    });
});
