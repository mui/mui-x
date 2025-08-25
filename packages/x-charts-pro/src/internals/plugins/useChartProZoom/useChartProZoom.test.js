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
var useChartProZoom_1 = require("./useChartProZoom");
describe('initializeZoomData', function () {
    var defaultZoomOptions = {
        axisId: 'x',
        minStart: 0,
        maxEnd: 100,
    };
    it('should initialize zoom data for all axes based on provided options when no zoom data is given', function () {
        var options = {
            x: __assign(__assign({}, defaultZoomOptions), { axisId: 'x', minStart: 0, maxEnd: 100 }),
            y: __assign(__assign({}, defaultZoomOptions), { axisDirection: 'y', axisId: 'y', minStart: 10, maxEnd: 50 }),
        };
        var result = (0, useChartProZoom_1.initializeZoomData)(options);
        expect(result).to.deep.equal([
            { axisId: 'x', start: 0, end: 100 },
            { axisId: 'y', start: 10, end: 50 },
        ]);
    });
    it('should override options with provided zoom data when matching axisId exists', function () {
        var options = {
            x: __assign(__assign({}, defaultZoomOptions), { axisId: 'x', minStart: 0, maxEnd: 100 }),
            y: __assign(__assign({}, defaultZoomOptions), { axisDirection: 'y', axisId: 'y', minStart: 10, maxEnd: 50 }),
        };
        var zoomData = [{ axisId: 'x', start: 20, end: 60 }];
        var result = (0, useChartProZoom_1.initializeZoomData)(options, zoomData);
        expect(result).to.deep.equal([
            { axisId: 'x', start: 20, end: 60 },
            { axisId: 'y', start: 10, end: 50 },
        ]);
    });
    it('should ignore zoom data if its axisId is not present in options', function () {
        var options = {
            x: __assign(__assign({}, defaultZoomOptions), { axisId: 'x', minStart: 0, maxEnd: 100 }),
        };
        var zoomData = [{ axisId: 'y', start: 10, end: 50 }];
        var result = (0, useChartProZoom_1.initializeZoomData)(options, zoomData);
        expect(result).to.deep.equal([{ axisId: 'x', start: 0, end: 100 }]);
    });
    it('should handle an empty options object without errors', function () {
        var result = (0, useChartProZoom_1.initializeZoomData)({});
        expect(result).to.deep.equal([]);
    });
    it('should handle undefined zoomData gracefully', function () {
        var options = {
            x: __assign(__assign({}, defaultZoomOptions), { axisId: 'x', minStart: 0, maxEnd: 100 }),
        };
        var result = (0, useChartProZoom_1.initializeZoomData)(options, undefined);
        expect(result).to.deep.equal([{ axisId: 'x', start: 0, end: 100 }]);
    });
});
