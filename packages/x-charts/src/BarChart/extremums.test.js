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
var extremums_1 = require("./seriesConfig/bar/extremums");
var buildData = function (data, layout) {
    if (layout === void 0) { layout = 'vertical'; }
    var stackData = data.length
        ? [
            [data[0], data[1]],
            [data[2], data[3]],
        ]
        : [];
    return {
        series: {
            id1: {
                id: 'id1',
                type: 'bar',
                color: 'red',
                data: data,
                minBarSize: 0,
                stackedData: stackData,
                visibleStackedData: stackData,
                layout: layout,
                hidden: false,
                valueFormatter: function () { return ''; },
            },
        },
        axis: {
            id: 'id',
            data: data,
        },
        axisIndex: 0,
        isDefaultAxis: true,
    };
};
var buildDataWithAxisId = function (data, layout, testedDirection) {
    if (layout === void 0) { layout = 'vertical'; }
    if (testedDirection === void 0) { testedDirection = 'x'; }
    var axesIds = layout === 'horizontal'
        ? { yAxisId: 'axis-id', xAxisId: 'other-id' }
        : { xAxisId: 'axis-id', yAxisId: 'other-id' };
    var stackData = data.length
        ? [
            [data[0], data[1]],
            [data[2], data[3]],
        ]
        : [];
    return {
        series: {
            id1: __assign({ id: 'id1', type: 'bar', color: 'red', data: data, minBarSize: 0, stackedData: stackData, visibleStackedData: stackData, layout: layout, hidden: false, valueFormatter: function () { return ''; } }, axesIds),
        },
        axis: {
            id: axesIds["".concat(testedDirection, "AxisId")],
            data: data,
        },
        axisIndex: 0,
        isDefaultAxis: true,
    };
};
describe('BarChart - extremums', function () {
    describe('getExtremumX', function () {
        describe('vertical', function () {
            it('should correctly get the extremes from axis', function () {
                var _a = (0, extremums_1.getExtremumX)(buildData([-1, 2, 3, 8])), x = _a[0], y = _a[1];
                expect(x).to.equal(-1);
                expect(y).to.equal(8);
            });
            it('should correctly get Infinity when empty data', function () {
                var _a = (0, extremums_1.getExtremumX)(buildData([])), x = _a[0], y = _a[1];
                expect(x).to.equal(Infinity);
                expect(y).to.equal(-Infinity);
            });
            it('should correctly get the extremes from axis with axis id', function () {
                var _a = (0, extremums_1.getExtremumX)(buildDataWithAxisId([-1, 2, 3, 8])), x = _a[0], y = _a[1];
                expect(x).to.equal(-1);
                expect(y).to.equal(8);
            });
            it('should correctly get Infinity when empty data with axis id', function () {
                var _a = (0, extremums_1.getExtremumX)(buildDataWithAxisId([])), x = _a[0], y = _a[1];
                expect(x).to.equal(Infinity);
                expect(y).to.equal(-Infinity);
            });
        });
        describe('horizontal', function () {
            it('should correctly get the extremes from axis', function () {
                var _a = (0, extremums_1.getExtremumX)(buildData([-1, 2, 3, 8], 'horizontal')), x = _a[0], y = _a[1];
                expect(x).to.equal(-1);
                expect(y).to.equal(8);
            });
            it('should correctly get Infinity when empty data', function () {
                var _a = (0, extremums_1.getExtremumX)(buildData([], 'horizontal')), x = _a[0], y = _a[1];
                expect(x).to.equal(Infinity);
                expect(y).to.equal(-Infinity);
            });
            it('should correctly get the extremes from axis with axis id', function () {
                var _a = (0, extremums_1.getExtremumX)(buildDataWithAxisId([-1, 2, 3, 8], 'horizontal')), x = _a[0], y = _a[1];
                expect(x).to.equal(-1);
                expect(y).to.equal(8);
            });
            it('should correctly get Infinity when empty data with axis id', function () {
                var _a = (0, extremums_1.getExtremumX)(buildDataWithAxisId([], 'horizontal')), x = _a[0], y = _a[1];
                expect(x).to.equal(Infinity);
                expect(y).to.equal(-Infinity);
            });
        });
    });
    describe('getExtremumY', function () {
        describe('vertical', function () {
            it('should correctly get the extremes from axis', function () {
                var _a = (0, extremums_1.getExtremumY)(buildData([-1, 2, 3, 8])), x = _a[0], y = _a[1];
                expect(x).to.equal(-1);
                expect(y).to.equal(8);
            });
            it('should correctly get Infinity when empty data', function () {
                var _a = (0, extremums_1.getExtremumY)(buildData([])), x = _a[0], y = _a[1];
                expect(x).to.equal(Infinity);
                expect(y).to.equal(-Infinity);
            });
            it('should correctly get the extremes from axis with axis id', function () {
                var _a = (0, extremums_1.getExtremumY)(buildDataWithAxisId([-1, 2, 3, 8], 'vertical', 'y')), x = _a[0], y = _a[1];
                expect(x).to.equal(-1);
                expect(y).to.equal(8);
            });
            it('should correctly get Infinity when empty data with axis id', function () {
                var _a = (0, extremums_1.getExtremumY)(buildDataWithAxisId([], 'vertical', 'y')), x = _a[0], y = _a[1];
                expect(x).to.equal(Infinity);
                expect(y).to.equal(-Infinity);
            });
        });
        describe('horizontal', function () {
            it('should correctly get the extremes from axis', function () {
                var _a = (0, extremums_1.getExtremumY)(buildData([-1, 2, 3, 8], 'horizontal')), x = _a[0], y = _a[1];
                expect(x).to.equal(-1);
                expect(y).to.equal(8);
            });
            it('should correctly get Infinity when empty data', function () {
                var _a = (0, extremums_1.getExtremumY)(buildData([], 'horizontal')), x = _a[0], y = _a[1];
                expect(x).to.equal(Infinity);
                expect(y).to.equal(-Infinity);
            });
            it('should correctly get the extremes from axis with axis id', function () {
                var _a = (0, extremums_1.getExtremumY)(buildDataWithAxisId([-1, 2, 3, 8], 'horizontal', 'y')), x = _a[0], y = _a[1];
                expect(x).to.equal(-1);
                expect(y).to.equal(8);
            });
            it('should correctly get Infinity when empty data with axis id', function () {
                var _a = (0, extremums_1.getExtremumY)(buildDataWithAxisId([], 'horizontal', 'y')), x = _a[0], y = _a[1];
                expect(x).to.equal(Infinity);
                expect(y).to.equal(-Infinity);
            });
        });
    });
});
