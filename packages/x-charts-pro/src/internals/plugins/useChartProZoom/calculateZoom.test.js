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
var calculateZoom_1 = require("./calculateZoom");
describe('calculateZoom', function () {
    var defaultOptions = {
        minSpan: 10,
        maxSpan: 100,
        minStart: 0,
        maxEnd: 100,
    };
    it('should zoom in with positive step', function () {
        var result = (0, calculateZoom_1.calculateZoom)({ start: 20, end: 80 }, 0.1, defaultOptions);
        expect(result).to.deep.equal({ start: 23, end: 77 });
        var result2 = (0, calculateZoom_1.calculateZoom)({ start: 10, end: 90 }, 0.2, defaultOptions);
        expect(result2).to.deep.equal({ start: 18, end: 82 });
    });
    it('should zoom out with negative step', function () {
        var result = (0, calculateZoom_1.calculateZoom)({ start: 30, end: 70 }, -0.1, defaultOptions);
        expect(result).to.deep.equal({ start: 28, end: 72 });
        var result2 = (0, calculateZoom_1.calculateZoom)({ start: 20, end: 80 }, -0.2, defaultOptions);
        expect(result2).to.deep.equal({ start: 14, end: 86 });
    });
    it('should respect minSpan', function () {
        var result = (0, calculateZoom_1.calculateZoom)({ start: 40, end: 50 }, 0.4, __assign(__assign({}, defaultOptions), { minSpan: 0 }));
        expect(result).to.deep.equal({ start: 42, end: 48 });
        var result2 = (0, calculateZoom_1.calculateZoom)({ start: 40, end: 50 }, 0.4, __assign(__assign({}, defaultOptions), { minSpan: 8 }));
        expect(result2).to.deep.equal({ start: 41, end: 49 });
    });
    it('should respect maxSpan', function () {
        var result = (0, calculateZoom_1.calculateZoom)({ start: 30, end: 70 }, -0.4, __assign(__assign({}, defaultOptions), { maxSpan: 100 }));
        expect(result).to.deep.equal({ start: 22, end: 78 });
        var result2 = (0, calculateZoom_1.calculateZoom)({ start: 30, end: 70 }, -0.4, __assign(__assign({}, defaultOptions), { maxSpan: 50 }));
        expect(result2).to.deep.equal({ start: 25, end: 75 });
    });
    it('should respect minStart', function () {
        var result = (0, calculateZoom_1.calculateZoom)({ start: 25, end: 75 }, -0.4, __assign(__assign({}, defaultOptions), { minStart: 0 }));
        expect(result).to.deep.equal({ start: 15, end: 85 });
        var result2 = (0, calculateZoom_1.calculateZoom)({ start: 25, end: 75 }, -0.4, __assign(__assign({}, defaultOptions), { minStart: 20 }));
        expect(result2).to.deep.equal({ start: 20, end: 85 });
    });
    it('should respect maxEnd', function () {
        var result = (0, calculateZoom_1.calculateZoom)({ start: 25, end: 75 }, -0.4, __assign(__assign({}, defaultOptions), { maxEnd: 100 }));
        expect(result).to.deep.equal({ start: 15, end: 85 });
        var result2 = (0, calculateZoom_1.calculateZoom)({ start: 25, end: 75 }, -0.4, __assign(__assign({}, defaultOptions), { maxEnd: 80 }));
        expect(result2).to.deep.equal({ start: 15, end: 80 });
    });
    it('spreads the received zoomData', function () {
        var result = (0, calculateZoom_1.calculateZoom)({ testProp: true, start: 20, end: 80 }, 0.1, defaultOptions);
        expect(result).to.deep.equal({ testProp: true, start: 23, end: 77 });
    });
});
